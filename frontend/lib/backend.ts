const API_BASE_URL =
  process.env.DJANGO_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export function backendUrl(path: string, search = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}${search}`;
}

export async function proxyToBackend(
  request: Request,
  path: string,
  method: string
) {
  const incomingUrl = new URL(request.url);
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const init: RequestInit = {
    method,
    headers,
  };

  if (!["GET", "HEAD"].includes(method)) {
    init.body = await request.text();
  }

  const response = await fetch(
    backendUrl(path, incomingUrl.search),
    init
  );
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
