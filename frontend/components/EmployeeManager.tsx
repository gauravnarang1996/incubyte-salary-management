"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Plus, RefreshCw, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/lib/types";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  job_title: "",
  country: "",
  department: "",
  salary: "",
};

function formatCurrency(value: string | number | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const countries = useMemo(
    () =>
      Array.from(
        new Set(employees.map((employee) => employee.country))
      ).sort(),
    [employees]
  );

  const departments = useMemo(
    () =>
      Array.from(
        new Set(employees.map((employee) => employee.department))
      ).sort(),
    [employees]
  );

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (country) {
      params.set("country", country);
    }

    if (department) {
      params.set("department", department);
    }

    params.set("ordering", "first_name");

    try {
      const response = await fetch(`/api/employees?${params}`);

      if (!response.ok) {
        throw new Error("Unable to load employees");
      }

      setEmployees(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [country, department, query]);

  useEffect(() => {
    const timeout = window.setTimeout(loadEmployees, 250);
    return () => window.clearTimeout(timeout);
  }, [loadEmployees]);

  async function createEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "Unable to add employee");
      }

      setForm(emptyForm);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(id: number) {
    setError("");

    const response = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Unable to delete employee");
      return;
    }

    setEmployees((current) =>
      current.filter((employee) => employee.id !== id)
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-normal">
          Employees
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Search and manage salary records across countries, departments, and roles.
        </p>
      </section>

      <section className="grid gap-3 rounded-lg border bg-card p-4 lg:grid-cols-[1fr_180px_180px_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search name, email, role, country"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        >
          <option value="">All countries</option>
          {countries.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
        >
          <option value="">All departments</option>
          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <Button
          type="button"
          variant="outline"
          onClick={loadEmployees}
          disabled={loading}
        >
          <RefreshCw />
          Refresh
        </Button>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="flex h-12 items-center justify-between border-b px-4">
            <h2 className="text-sm font-medium">
              {loading ? "Loading employees" : `${employees.length} employees`}
            </h2>
            {error ? (
              <span className="max-w-xl truncate text-xs text-destructive">
                {error}
              </span>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 text-right font-medium">Salary</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{employee.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">{employee.job_title}</td>
                    <td className="px-4 py-3">{employee.department}</td>
                    <td className="px-4 py-3">{employee.country}</td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="destructive"
                        aria-label={`Delete ${employee.full_name}`}
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}

                {!loading && employees.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={6}
                    >
                      No employees match the current search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <form
          className="rounded-lg border bg-card p-4"
          onSubmit={createEmployee}
        >
          <div className="mb-4 flex items-center gap-2">
            <Plus className="size-4" />
            <h2 className="text-sm font-medium">Add employee</h2>
          </div>

          <div className="grid gap-3">
            {Object.keys(emptyForm).map((key) => (
              <Input
                key={key}
                required
                type={key === "salary" ? "number" : "text"}
                min={key === "salary" ? 0 : undefined}
                placeholder={key.replace("_", " ")}
                value={form[key as keyof typeof form]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
              />
            ))}
          </div>

          <Button className="mt-4 w-full" type="submit" disabled={saving}>
            <Plus />
            {saving ? "Saving" : "Add employee"}
          </Button>
        </form>
      </section>
    </main>
  );
}
