const authMiddleware = require('../middleware/auth');
const { novelRecommendationsController, collaborativeRecommendationsController } = require('../controller/recommendationsController');

module.exports = [
  {
    path: '/recommendations/novels',
    method: 'get',
    middleware: authMiddleware,
    controller: novelRecommendationsController
  },
  {
    path: '/recommendations/collaborative',
    method: 'get',
    middleware: authMiddleware,
    controller: collaborativeRecommendationsController
  },
];