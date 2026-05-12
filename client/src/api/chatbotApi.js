import { BASE_URL } from './config';

export const sendChatMessage = async (message, history = []) => {
  const response = await fetch(`${BASE_URL}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  return await response.json();
};
