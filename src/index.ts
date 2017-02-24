// import { Otserv } from "./otserv";
// let config = null;
// try {
// 	config = require('../config');
// } catch (e) {
// 	console.error("Copy `config.js.sample` to `config.js` and edit it before starting the server.");
// 	process.exit();
// }

// const otserv = new Otserv(config);
// otserv.start();

import * as path from 'path';
import { MapReader } from './mapreader';

const mapFileName = path.join(__dirname, '..', '..', 'content', 'smallMap.otbm');
const mapReader = new MapReader(mapFileName);
mapReader.parse();
