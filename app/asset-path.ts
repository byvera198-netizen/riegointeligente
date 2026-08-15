const configuredBase = import.meta.env.BASE_URL || "/";
const normalizedBase = configuredBase.endsWith("/")
  ? configuredBase
  : `${configuredBase}/`;

export function assetPath(path: string) {
  return `${normalizedBase}${path.replace(/^\/+/, "")}`;
}
