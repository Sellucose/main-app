const authMiddleware = require('../middleware/auth');
const { getProfileController, updateProfileController } = require('../controller/profileController');

module.exports = [
  {
    path: '/profile',
    method: 'get',
    middleware: authMiddleware,
    controller: getProfileController
  },
  {
    path: '/profile',
    method: 'put',
    middleware: authMiddleware,
    controller: updateProfileController
  },
];