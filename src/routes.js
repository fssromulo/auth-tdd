const routes = require('express').Router();
const { User } = require('./app/models');

User.create({
	name: 'Romulo',
	email: 'fssromulo@gmail.com',
	password_hash: '124568798556'
});


module.exports = routes;