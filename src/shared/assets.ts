export function assetUrl(path: string, base = import.meta.env.BASE_URL) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const prefix = base.endsWith("/") ? base : base + "/";
  return prefix + path.slice(1);
}
/** Mantiene los catálogos originales y adapta únicamente rutas de medios locales. */
export function withAssetBase<T>(value: T): T {
  if (typeof value === "string")
    return (value.startsWith("/media/") ? assetUrl(value) : value) as T;
  if (Array.isArray(value)) return value.map(withAssetBase) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, withAssetBase(v)]),
    ) as T;
  return value;
}
