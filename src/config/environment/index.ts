'use strict';
/*eslint no-process-env:0*/
import {DevConfig} from './development';
import {ProdConfig} from './production';
import {TestConfig} from './test';
import {IConfig} from "../../models/IConfig";

let configConstructor;
if(process.env.NODE_ENV === 'production') configConstructor = ProdConfig;
if(process.env.NODE_ENV === 'test') configConstructor = TestConfig;
if(!configConstructor) configConstructor = DevConfig;
export  const Config : IConfig = new configConstructor();