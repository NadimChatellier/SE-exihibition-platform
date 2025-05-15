import axios from "axios";

const BASE_URL = "https://api.harvardartmuseums.org";
const API_KEY = process.env.NEXT_PUBLIC_HARVARD_API_KEY || "57bea388-3f95-4dc3-bb9c-48f8ec9123f4"; // Use env variable if set

export function fetchHarvardArtworks(page = 1, size = 20) {
  return axios
    .get(`${BASE_URL}/object`, {
      params: {
        apikey: API_KEY,
        page,
        size,
        hasimage: 1,
        sort: "rank",
      },
    })
    .then((res) => res.data.records)
    .catch((err) => {
      console.error("Error fetching Harvard artworks:", err.message);
      return [];
    });
}


export function fetchHarvardArtworkById(id) {
  return axios
    .get(`${BASE_URL}/object/${id}`, {
      params: { apikey: API_KEY },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Error fetching Harvard artwork ${id}:`, err.message);
      return null;
    });
}
