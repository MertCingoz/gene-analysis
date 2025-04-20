ARG BUN_IMAGE=oven/bun:1.2.10-alpine

# Build stage
FROM ${BUN_IMAGE} AS build
WORKDIR /app
# Copy and install dependencies
COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile #https://github.com/oven-sh/bun/issues/5283
# Copy source code
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Final lightweight image
FROM ${BUN_IMAGE} AS dist
WORKDIR /app/dist
COPY --from=build /app/dist .
ENV NODE_ENV=production
CMD ["bun", "index.js"]
