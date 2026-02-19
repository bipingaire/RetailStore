# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install system dependencies
# openssl/openssl-dev: required by Prisma schema engine on Alpine
# cairo/pango/etc: required by canvas (for image generation)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev \
    librsvg-dev \
    openssl \
    openssl-dev

RUN npm install

# Bundle app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate --schema prisma/schema.prisma
RUN npx prisma generate --schema prisma/schema-master.prisma
RUN npx prisma generate --schema prisma/schema-tenant.prisma

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start:prod"]
