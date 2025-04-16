import { Autocomplete, Button, Box, TextField } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

// Set the global base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export default function App() {
    const autocompleteRef = useRef(null);
    const [rows, setRows] = useState([]);
    const [geneOptions, setGeneOptions] = useState([]);
    const [selectedGenes, setSelectedGenes] = useState([]);
    const [textFieldValue, setTextFieldValue] = useState('');
    const [selectedRowIds, setSelectedRowIds] = useState([]);

    useEffect(() => {
        if (geneOptions.length) {
            autocompleteRef.current.querySelector('input').focus();
        }
    }, [geneOptions]);

    const handleSearchChange = useMemo(() => debounce(async (event) => {
        const { value } = event.target;
        if (value.length < 1) return;

        try {
            setTextFieldValue(value);
            const res = await axios.get('/search', { params: { geneID: value } });
            setGeneOptions(res.data);
        } catch (err) {
            console.error('Search failed', err);
            setGeneOptions([]);
        }
    }, 800), []);

    const handleFetchData = async () => {
        try {
            const res = await axios.post('/fetch', { geneIDs: selectedGenes });
            const data = res.data.map((row, index) => ({ id: index, ...row }));
            setRows(data);
            setSelectedRowIds([]);
        } catch (err) {
            console.error('Data fetch failed', err);
        }
    };

    const SearchBar = () => (
        <GridToolbarContainer sx={{ borderBottom: '0.5px solid', borderColor: 'primary.main' }}>
            <Box sx={{ p: 1, gap: 2, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Autocomplete
                    sx={{ width: '100%' }}
                    ref={autocompleteRef}
                    multiple
                    openOnFocus
                    filterSelectedOptions
                    options={geneOptions}
                    value={selectedGenes}
                    onChange={(event, newValue) => setSelectedGenes(newValue)}
                    filterOptions={(options) => options}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            value={textFieldValue}
                            onChange={handleSearchChange}
                            label={selectedGenes.length ? textFieldValue : textFieldValue || 'Search genes'}
                            size="small"
                        />
                    )}
                    slotProps={{ chip: { sx: { height: '24px' } } }}
                />
                <Button
                    sx={{ width: '125px' }}
                    variant="contained"
                    size="small"
                    onClick={handleFetchData}
                    disabled={selectedGenes.length === 0}
                >
                    Fetch
                </Button>
            </Box>
            <GridToolbar printOptions={{ hideToolbar: true }}/>
        </GridToolbarContainer>
    );

    const handleRowAnalysis = async (row) => {
        try {
            if (row.median !== undefined) return;
            const res = await axios.post('/analyze', { geneID: row.gene });
            const { mean, median, variance } = res.data;
            const updatedRow = { ...row, mean, median, variance };
            setRows(prevRows => prevRows.map(r => (r.id === row.id ? updatedRow : r)));
        } catch (err) {
            console.error('Data analysis failed', err);
        }
    };

    const columns = [
        { field: 'gene', headerName: 'Gene', width: 200 },
        { field: 'exper_rep1', headerName: 'Exp 1', type: 'number' },
        { field: 'exper_rep2', headerName: 'Exp 2', type: 'number' },
        { field: 'exper_rep3', headerName: 'Exp 3', type: 'number' },
        { field: 'control_rep1', headerName: 'Cont 1', type: 'number' },
        { field: 'control_rep2', headerName: 'Cont 2', type: 'number' },
        { field: 'control_rep3', headerName: 'Cont 3', type: 'number' },
        {
            field: 'analyze',
            headerName: 'Analyze',
            sortable: false,
            filterable: false,
            headerAlign: 'right',
            align: 'center',
            width: 110,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleRowAnalysis(params.row)}
                >
                    Analyze
                </Button>
            ),
        },
        { field: 'mean', headerName: 'Mean', type: 'number' },
        { field: 'median', headerName: 'Median', type: 'number' },
        { field: 'variance', headerName: 'Variance', type: 'number' },
    ];

    const ChartFooter = useMemo(() => {
        return memo(() => {
            if (selectedRowIds.length === 0) return null;
            const selectedRows = selectedRowIds.map(id => rows.find(r => r.id === id));
            return (
                <BarChart
                    sx={{ paddingTop: '6px', borderTop: '0.5px solid', borderColor: 'primary.main' }}
                    height={400}
                    grid={{ horizontal: true }}
                    barLabel="value"
                    xAxis={[{ scaleType: 'band', data: selectedRows.map(r => r.gene) }]}
                    series={[
                        { data: selectedRows.map(r => r.exper_rep1), label: 'Exp 1' },
                        { data: selectedRows.map(r => r.exper_rep2), label: 'Exp 2' },
                        { data: selectedRows.map(r => r.exper_rep3), label: 'Exp 3' },
                    ]}
                />
            );
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRowIds]);

    return (
        <DataGrid
            sx={{
                border: '0.5px solid', borderColor: 'primary.main',
                "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                    outline: "none",
                },
            }}
            initialState={{ sorting: { sortModel: [{ field: 'gene', sort: 'asc' }] } }}
            slots={{ toolbar: SearchBar, footer: ChartFooter }}
            columns={columns}
            rows={rows}
            hideFooterPagination
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedRowIds}
            onRowSelectionModelChange={(ids) => setSelectedRowIds(ids)}
        />
    );
}
