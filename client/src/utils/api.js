import axios from 'axios';
import Auth from './auth';

export const saveCard = async (cardData) => {
  try {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    const response = await axios.post('/api/saved', cardData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const removeCard = async (cardId) => {
  try {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    const response = await axios.delete(`/api/saved/${cardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
}