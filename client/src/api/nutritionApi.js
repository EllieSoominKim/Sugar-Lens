import { BASE_URL } from './config';

export const getNutrition = async (foodId) => {
  const response = await fetch(`${BASE_URL}/nutrition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ food_id: foodId })
  });
  return await response.json();
};
