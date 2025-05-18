import axios from "axios";
import { normalizeBritishMuseum, normalizeHarvard, normalizeVandA } from "./normalize.js";


const API_KEY = process.env.NEXT_PUBLIC_HARVARD_API_KEY || "57bea388-3f95-4dc3-bb9c-48f8ec9123f4"; // Use env variable if set

export function fetchHarvardArtworks(page = 1, size = 20) {
  return axios
    .get("https://api.harvardartmuseums.org/object", {
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
      return { records, total: res.data.info.totalRecords }; // Include total records for pagination
    })
    .catch((err) => {
      console.error("Error fetching Harvard artworks:", err.message);
      return { records: [], total: 0 }; // Include total as 0 in case of error
    });
}


export function fetchVandAArtworks(page = 1, size = 50, query = "") {
  const baseUrl = "https://api.vam.ac.uk/v2/objects/search";
  const url = `${baseUrl}?q=${encodeURIComponent(query)}&page_size=${size}&page=${page}`;

  return axios
    .get(url)
    .then((res) => {
      const records = res.data.records.map(normalizeVandA);
      return {
        records,
        total: res.data.info.hits || 0, // you might use this later for total pages
      };
    })
    .catch((err) => {
      console.error("Error fetching V&A artworks:", err.message);
      return { records: [] };
    });
}



export function fetchBritishMuseumArtworks(page = 1, size = 20) {
  const API_KEY = "hictaiev"; 
  const BASE_URL = "https://api.europeana.eu/record/v2/search.json";

  const params = {
    wskey: API_KEY,
    query: 'who:"British Museum"', // Filter by British Museum
    rows: size,
    start: (page - 1) * size, // Start parameter for pagination
    profile: "rich", // More metadata
  };

  return axios
    .get(BASE_URL, { params })
    .then((res) => {
      const records = res.data.items.map((item) => ({
        object: item.id,
        title: item.title ? item.title[0] : "No title",
        creator: item.dataProvider ? item.dataProvider : "Unknown",
        date: item.year || "Unknown",
        image: item.edmIsShownBy ? item.edmIsShownBy : null,
      }));
      return { records, total: res.data.totalResults }; // Include total records for pagination
    })
    .catch((err) => {
      console.error("Error fetching Europeana artworks:", err.message);
      return { records: [], total: 0 }; // Include total as 0 in case of error
    });
}


