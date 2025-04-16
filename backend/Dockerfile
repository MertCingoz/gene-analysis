ARG NODE_IMAGE=node:22-alpine

# Build stage
FROM ${NODE_IMAGE} AS build
WORKDIR /app
# Copy and install dependencies
COPY package*.json .
RUN npm ci
# Copy source code
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Final lightweight image
FROM ${NODE_IMAGE} AS dist
WORKDIR /app/dist
COPY --from=build /app/dist .
ENV NODE_ENV=production
CMD ["node", "index.js"]
