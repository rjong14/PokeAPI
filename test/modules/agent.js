'use strict'

const supertest = require('supertest')
const app = require('../../app')

const request = supertest.agent(app.listen())

module.exports = request;
