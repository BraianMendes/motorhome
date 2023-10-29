// services/GoogleDirectionsService.ts

import axios from 'axios';

const BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const API_KEY = 'SUA_CHAVE_API'; // Coloque sua chave da API aqui

export const getDirections = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
) => {
  const url = `${BASE_URL}?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    
    if (response.data.status !== "OK") {
      throw new Error(response.data.error_message || "Erro ao buscar direções.");
    }

    const routes = response.data.routes[0].legs[0].steps;
    return routes;
  } catch (error) {
    console.error("Erro no serviço Google Directions:", error);
    throw error;
  }
};