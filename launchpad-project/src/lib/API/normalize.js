// lib/API/normalize.js

export function normalizeVandA(item) {
  const iiifBase = item._images?._iiif_image_base_url;

  return {
    id: item.systemNumber,
    title: item._primaryTitle || "Untitled",
    image: iiifBase ? `${iiifBase}full/!800,800/0/default.jpg` : null,
    artist: item._primaryMaker?.name || "Unknown Artist",
    date: item._primaryDate || "Date Unknown",
    source: "vam",
  };
}

export function normalizeHarvard(item) {
  return {
    id: item.id,
    title: item.title || "Untitled",
    image: item.primaryimageurl || null,
    artist:
      (item.people && item.people[0]?.name) ||
      item.dated ||
      "Unknown Artist",
    date: item.dated || "Date Unknown",
    source: "harvard",
  };
}

export function normalizeBritishMuseum(item) {
  return {
    id: item.object.value,
    title: item.title?.value || "Untitled",
    image: item.image?.value || null,
    artist: item.creator?.value || "Unknown Artist",
    date: item.date?.value || "Date Unknown",
    source: "british-museum",
  };
}
