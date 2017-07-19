[![Build Status](https://travis-ci.org/AI111/trellolo-server.svg?branch=master)](https://travis-ci.org/AI111/trellolo-server)
[![Coverage Status](https://coveralls.io/repos/github/AI111/trellolo-server/badge.svg)](https://coveralls.io/github/AI111/trellolo-server)

##Deployment commands

```
sudo npm i -g typescript node-gyp nyc
npm install
npm i mysql2
npm build
npm run test
npm run test:integration
pm2 start npm -- start
```
[**Api documentation**](https://trellolo.com/swagger/)