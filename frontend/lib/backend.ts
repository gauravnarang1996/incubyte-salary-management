const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const normalizedApiBaseUrl = API_BASE_URL.replace(/\/$/, "");

export function backendUrl(path: string, search = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedApiBaseUrl}${normalizedPath}${search}`;
}

export async function proxyToBackend(
  request: Request,
  path: string,
  method: string
) {
  const incomingUrl = new URL(request.url);
  const headers = new Headers();

  const init: RequestInit = {
    method,
  };

  if (!["GET", "HEAD"].includes(method)) {
    const body = await request.text();

    if (body) {
      headers.set("Content-Type", "application/json");
      init.headers = headers;
      init.body = body;
    }
  }

  const response = await fetch(
    backendUrl(path, incomingUrl.search),
    init
  );

  if ([204, 205, 304].includes(response.status)) {
    return new Response(null, {
      status: response.status,
    });
  }

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
