#!/bin/sh
npm install
npm i mysql2
npm run build
npm run test
npm run test:integration
pm2 start npm -- start
