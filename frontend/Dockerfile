ARG BUN_IMAGE=oven/bun:1.2.14-alpine

# Build stage
FROM ${BUN_IMAGE} AS build
WORKDIR /app
# Copy and install dependencies
COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile
# Copy source code
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=production
RUN bun run build

FROM nginx:alpine-slim AS dist
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
