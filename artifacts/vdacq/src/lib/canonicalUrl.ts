export const SITE_URL = "https://www.vdacq.com";

export function canonicalUrlForPath(pathname: string): string {
  const absolutePath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const route = absolutePath.endsWith("/") ? absolutePath : `${absolutePath}/`;

  return `${SITE_URL}${route}`;
}