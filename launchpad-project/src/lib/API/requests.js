import axios from "axios";
import { normalizeBritishMuseum, normalizeHarvard, normalizeVandA } from "./normalize.js";


const API_KEY = process.env.NEXT_PUBLIC_HARVARD_API_KEY || "57bea388-3f95-4dc3-bb9c-48f8ec9123f4"; // Use env variable if set

export function fetchHarvardArtworks(page = 1, size = 20) {
  return axios
    .get(`https://api.harvardartmuseums.org/object`, {
      params: {
        apikey: API_KEY,
        page,
        size,
        hasimage: 1,
        sort: "rank",
      },
    })
    .then((res) => {
      const records = res.data.records.map(normalizeHarvard);
      return { records };
    })
    .catch((err) => {
      console.error("Error fetching Harvard artworks:", err.message);
      return { records: [] };
    });
}


export function fetchVandAArtworks(page = 1, size = 50) {
  const url = `https://api.vam.ac.uk/v2/objects/search?q=Bed Ware&page_size=${size}&page=${page}`;
  return axios
    .get(url)
    .then((res) => {
      const records = res.data.records.map(normalizeVandA);
      return { records };
    })
    .catch((err) => {
      console.error("Error fetching V&A artworks:", err.message);
      return { records: [] };
    });
}

export function fetchBritishMuseumArtworks() {
  const API_KEY = " hictaiev"; 
  const BASE_URL = "https://api.europeana.eu/record/v2/search.json";

  const params = {
    wskey: API_KEY,
    query: 'who:"British Museum"',  // filter by British Museum
    rows: 20,
    profile: "rich",  // more metadata
  };

  return axios
    .get(BASE_URL, { params })
    .then((res) => {
      // Map Europeana results to your desired format
      const records = res.data.items.map((item) => ({
        object: item.id,
        title: item.title ? item.title[0] : "No title",
        creator: item.dataProvider ? item.dataProvider : "Unknown",
        date: item.year || "Unknown",
        image: item.edmIsShownBy ? item.edmIsShownBy : null,
      }));
      return { records };
    })
    .catch((err) => {
      console.error("Error fetching Europeana artworks:", err.message);
      return { records: [] };
    });
}


export function fetchTateModernArtworks() {
  const API_KEY = " hictaiev"; 
  const BASE_URL = "https://api.europeana.eu/record/v2/search.json";

  const params = {
    wskey: API_KEY,
    query: 'who:"Tate Modern"',  // filter by British Museum
    rows: 20,
    profile: "rich",  // more metadata
  };

  return axios
    .get(BASE_URL, { params })
    .then((res) => {
      // Map Europeana results to your desired format
      const records = res.data.items.map((item) => ({
        object: item.id,
        title: item.title ? item.title[0] : "No title",
        creator: item.dataProvider ? item.dataProvider : "Unknown",
        date: item.year || "Unknown",
        image: item.edmIsShownBy ? item.edmIsShownBy : null,
      }));
      return { records };
    })
    .catch((err) => {
      console.error("Error fetching Europeana artworks:", err.message);
      return { records: [] };
    });
}
fetchBritishMuseumArtworks()