import axios from "axios";
import {normalizeHarvard, normalizeHarvardForDetail, normalizeVandA, normalizeVandAForDetail} from "./normalize.js";
import { buildHarvardQuery } from "./helperFunctions.js";

//change
const API_KEY = process.env.NEXT_PUBLIC_HARVARD_API_KEY;

export function fetchHarvardArtworks(page = 1, size = 20, typeFilter = "", searchTerm = "") {
  const query = buildHarvardQuery(typeFilter, searchTerm);

  return axios
    .get("https://api.harvardartmuseums.org/object", {
      params: {
        apikey: API_KEY,
        page,
        size,
        hasimage: 1,
        sort: "rank",
        q: query || undefined,
      },
    })
    .then((res) => {
      const records = res.data.records.map(normalizeHarvard);
      return { records, total: res.data.info.totalrecords };
    })
    .catch((err) => {
      console.error("Error fetching Harvard artworks:", err.message);
      return { records: [], total: 0 };
    });
}



export function fetchVandAArtworks(page = 1, size = 20, typeFilter = "", searchTerm = "") {
  const query = `${typeFilter} ${searchTerm}`.trim();
  const baseUrl = "https://api.vam.ac.uk/v2/objects/search";
  const url = `${baseUrl}?q=${encodeURIComponent(query)}&page_size=${size}&page=${page}`;

  return axios
    .get(url)
    .then((res) => {
      console.log(res)
      const records = res.data.records.map(normalizeVandA);
      return {
        records,
        total: res.data.info.pages * size || 0, // you might use this later for total pages
      };
    })
    .catch((err) => {
      console.error("Error fetching V&A artworks:", err.message);
      return { records: [] };
    });
}




export function fetchVandAArtworkById(id) {
  console.log("Fetching V&A artwork by ID");
  const url = `https://api.vam.ac.uk/v2/museumobject/${id}`;

  return axios
    .get(url)
    .then((res) => {
      const record = res.data?.record;
      const meta = res.data?.meta?.images;
      if (!record) throw new Error("Record not found in response");

      return normalizeVandAForDetail(record, meta);
    })
    .catch((err) => {
      console.error(`Error fetching V&A artwork by ID ${id}:`, err.message);
      return null;
    });
}


export async function fetchHarvardArtworkById(id) {
    const url = `https://api.harvardartmuseums.org/object/${id}?apikey=${API_KEY}`;
    console.log("attempting: ", url)
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(normalizeHarvardForDetail(data))
        return normalizeHarvardForDetail(data);
    } catch (error) {
        console.error("Error fetching Harvard object:", error);
        return null;
    }
}


