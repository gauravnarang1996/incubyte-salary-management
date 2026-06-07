import { proxyToBackend } from "@/lib/backend";

type EmployeeRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: EmployeeRouteContext
) {
  const { id } = await context.params;
  return proxyToBackend(request, `/employees/${id}/`, "PATCH");
}

export async function DELETE(
  request: Request,
  context: EmployeeRouteContext
) {
  const { id } = await context.params;
  return proxyToBackend(request, `/employees/${id}/`, "DELETE");
}
