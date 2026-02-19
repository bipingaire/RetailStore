#!/bin/bash
echo "Running Database Migrations..."
docker exec retail_store_backend npx prisma db push --schema prisma/schema-master.prisma
docker exec retail_store_backend npx prisma db push --schema prisma/schema.prisma
echo "Migrations Complete!"
