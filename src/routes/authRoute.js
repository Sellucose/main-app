const { register, login } = require('../controller/authUsersController');

module.exports = [
	{
		path: '/register',
		method: 'post',
		controller: register
	},
	{
		path: '/login',
		method: 'post',
		controller: login
	},
];