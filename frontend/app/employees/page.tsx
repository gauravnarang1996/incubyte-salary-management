async function getEmployees() {
  const response = await fetch(
    "http://127.0.0.1:8000/api/employees/",
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function DashboardPage() {
  const employees = await getEmployees();

  const totalEmployees =
    employees.length;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Salary Management Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded">
          <h2>Total Employees</h2>

          <p className="text-2xl font-bold">
            {totalEmployees}
          </p>
        </div>
      </div>
    </main>
  );
}