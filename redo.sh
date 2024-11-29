#!/bin/bash


npx prisma migrate dev
npx prisma migrate reset
npx prisma db push

cd ../seed/.
bash run.sh
