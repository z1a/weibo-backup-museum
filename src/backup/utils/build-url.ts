export function buildURL(baseUrl: string, query: Record<string, any>) {
  const paramsList = Object.entries(query).map(([k, v]) =>
    v === undefined ? "" : `${k}=${v}`
  );
  return `${baseUrl}?${paramsList.filter(Boolean).join("&")}`;
}
