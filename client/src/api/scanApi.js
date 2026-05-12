import { SCAN_URL } from './config';

export const scanFood = async (imageBase64) => {
  const response = await fetch(SCAN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: imageBase64 })
  });
  return await response.json();
};
