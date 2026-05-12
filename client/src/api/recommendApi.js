import { BASE_URL } from './config';

export const getRecommendations = async (foodId) => {
  const response = await fetch(`${BASE_URL}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ food_id: foodId })
  });
  return await response.json();
};
