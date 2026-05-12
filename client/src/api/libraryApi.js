import { BASE_URL } from './config';

export const getLibrary = async () => {
  const response = await fetch(`${BASE_URL}/library`);
  return await response.json();
};
