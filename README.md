[![Build Status](https://travis-ci.org/AI111/trellolo-server.svg?branch=master)](https://travis-ci.org/AI111/trellolo-server)
[![Coverage Status](https://coveralls.io/repos/github/AI111/trellolo-server/badge.svg)](https://coveralls.io/github/AI111/trellolo-server)
[![codebeat badge](https://codebeat.co/badges/54eb95fd-a145-40e2-b2c3-13ceba1dcd7a)](https://codebeat.co/projects/github-com-ai111-trellolo-server-master)

<h3>Deployment commands</h3>

```
sudo npm i -g typescript node-gyp nyc
npm install
npm i mysql2
npm build
npm run test
pm2 start npm -- start
```
[**Api documentation**](https://trellolo.com/swagger/)