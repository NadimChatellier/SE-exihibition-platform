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




export function normalizeVandAForDetail(record, meta) {
  const imageBaseUrl = meta?._iiif_image || null;
  const thumbnail = meta?._primary_thumbnail || null;
  console.log("normalising the following", record, meta)
  return {
    id: record.systemNumber,
  title: record.titles && record.titles.length > 0
  ? record.titles[0].text || "Untitled"
  : "Untitled",

    description:
      record.summaryDescription ||
      record.briefDescription ||
      "No description available.",
    type: record.objectType || "Unknown type",
    date:
      record.productionDates?.[0]?.date.text ||
      record.accessionYear?.toString() ||
      "Unknown date",
    place:
      record.placesOfOrigin?.[0]?.name ||
      record._currentLocation?.displayName ||
      "Unknown location",
    creator:
      record.artistMakerPerson?.[0]?.name.text || "Unknown artist",
    materials: record.materialsAndTechniques || "Unknown materials",
    image: imageBaseUrl
      ? `${imageBaseUrl}full/843,/0/default.jpg`
      : thumbnail || null,
  };
}
