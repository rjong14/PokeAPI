/**
 * @file mylittletest.js
 * @project PokeApi
 **/

process.env.NODE_ENV = 'test';

// Create SuperAgent
const api = require('./modules/agent');

const token = require('./routes/token')(api);

// Login Agent
const login = require('./routes/login')(api);

// Test the routes
const user = require('./routes/users')(api);
const locations = require('./routes/locations')(api);
const roles = require('./routes/roles')(api);
const frontend = require('./routes/frontend')(api);



