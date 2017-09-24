"use strict";
/*eslint no-process-env:0*/

const envConfig = require(`./${process.env.NODE_ENV || "development"}`).default;
const defConfig = require("./default").default;
export  const config = {...defConfig, ...envConfig};
