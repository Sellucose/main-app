const baseUrl = process.env.RECOMMENDATIONS_SERVER_URL;

const novelRecommendationsController = async (req, res) => {
  const response = await fetch(`${baseUrl}/recommendations/novels`);
  const body = await response.json();

  res.send(body);
}

const collaborativeRecommendationsController = async (req, res) => {
  const response = await fetch(`${baseUrl}/recommendations/collaborative`);
  const body = await response.json();

  res.send(body);
}

module.exports = { novelRecommendationsController, collaborativeRecommendationsController };