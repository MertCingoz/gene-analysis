ARG NODE_IMAGE=node:22-alpine

# Build stage
FROM ${NODE_IMAGE} AS build
WORKDIR /app
# Copy and install dependencies
COPY package*.json .
RUN npm ci
# Copy source code
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine-slim AS dist
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
