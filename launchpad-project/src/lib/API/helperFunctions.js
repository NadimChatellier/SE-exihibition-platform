export function buildHarvardQuery(typeFilter, searchTerm) {
  const type = typeFilter.trim();
  const term = searchTerm.trim();

  if (!type && !term) return "";

  if (type && term) {
    return `classification:${type} AND (title:${term} OR description:${term} OR people.name:${term})`;
  }

  if (type) return `classification:${type}`;
  if (term) return `(title:${term} OR description:${term} OR people.name:${term})`;

  return "";
}
