"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Employee, PaginatedResponse } from "@/lib/types";

const pageSize = 20;

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  job_title: "",
  country: "",
  department: "",
  salary: "",
};

type EmployeeForm = typeof emptyForm;

function formatCurrency(value: string | number | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formFromEmployee(employee: Employee): EmployeeForm {
  return {
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    job_title: employee.job_title,
    country: employee.country,
    department: employee.department,
    salary: employee.salary,
  };
}

function messageFromResponse(body: string) {
  if (!body) {
    return "Unable to save employee";
  }

  try {
    const parsed = JSON.parse(body) as Record<string, string[] | string>;

    return Object.entries(parsed)
      .map(([field, value]) => {
        const text = Array.isArray(value) ? value.join(" ") : value;
        return `${field.replace("_", " ")}: ${text}`;
      })
      .join(" ");
  } catch {
    return body;
  }
}

export default function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(totalEmployees / pageSize));

  const visibleRange = useMemo(() => {
    if (totalEmployees === 0) {
      return "0";
    }

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalEmployees);

    return `${start}-${end}`;
  }, [page, totalEmployees]);

  const resetToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      ordering: "first_name",
      page: String(page),
      page_size: String(pageSize),
    });

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (country.trim()) {
      params.set("country", country.trim());
    }

    if (department.trim()) {
      params.set("department", department.trim());
    }

    try {
      const response = await fetch(`/api/employees?${params}`);

      if (!response.ok) {
        throw new Error("Unable to load employees");
      }

      const data = (await response.json()) as PaginatedResponse<Employee>;
      setEmployees(data.results);
      setTotalEmployees(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [country, department, page, query]);

  useEffect(() => {
    const timeout = window.setTimeout(loadEmployees, 250);
    return () => window.clearTimeout(timeout);
  }, [loadEmployees]);

  function updateForm(field: keyof EmployeeForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEdit(employee: Employee) {
    setEditingEmployee(employee);
    setForm(formFromEmployee(employee));
    setError("");
  }

  function cancelEdit() {
    setEditingEmployee(null);
    setForm(emptyForm);
    setError("");
  }

  async function submitEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const isEditing = editingEmployee !== null;
    const url = isEditing
      ? `/api/employees/${editingEmployee.id}`
      : "/api/employees";

    try {
      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          salary: Number(form.salary),
        }),
      });

      if (!response.ok) {
        throw new Error(messageFromResponse(await response.text()));
      }

      setForm(emptyForm);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(employee: Employee) {
    setError("");
    setDeletingId(employee.id);

    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(messageFromResponse(await response.text()));
      }

      if (editingEmployee?.id === employee.id) {
        cancelEdit();
      }

      await loadEmployees();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete employee");
    } finally {
      setDeletingId(null);
    }
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
            onChange={(event) => {
              setQuery(event.target.value);
              resetToFirstPage();
            }}
          />
        </label>

        <Input
          placeholder="Country filter"
          value={country}
          onChange={(event) => {
            setCountry(event.target.value);
            resetToFirstPage();
          }}
        />

        <Input
          placeholder="Department filter"
          value={department}
          onChange={(event) => {
            setDepartment(event.target.value);
            resetToFirstPage();
          }}
        />

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
          <div className="flex min-h-12 flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium">
              {loading
                ? "Loading employees"
                : `${visibleRange} of ${totalEmployees.toLocaleString()} employees`}
            </h2>
            {error ? (
              <span className="max-w-xl text-xs text-destructive">
                {error}
              </span>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
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
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Edit ${employee.full_name}`}
                          onClick={() => startEdit(employee)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="destructive"
                          aria-label={`Delete ${employee.full_name}`}
                          disabled={deletingId === employee.id}
                          onClick={() => deleteEmployee(employee)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
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

          <div className="flex items-center justify-between border-t px-4 py-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
            >
              <ChevronLeft />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={loading || page >= totalPages}
            >
              Next
              <ChevronRight />
            </Button>
          </div>
        </div>

        <form
          className="rounded-lg border bg-card p-4"
          onSubmit={submitEmployee}
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {editingEmployee ? (
                <Pencil className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              <h2 className="text-sm font-medium">
                {editingEmployee ? "Edit employee" : "Add employee"}
              </h2>
            </div>

            {editingEmployee ? (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label="Cancel edit"
                onClick={cancelEdit}
              >
                <X />
              </Button>
            ) : null}
          </div>

          <div className="grid gap-3">
            <Input
              required
              placeholder="First name"
              value={form.first_name}
              onChange={(event) => updateForm("first_name", event.target.value)}
            />
            <Input
              required
              placeholder="Last name"
              value={form.last_name}
              onChange={(event) => updateForm("last_name", event.target.value)}
            />
            <Input
              required
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
            />
            <Input
              required
              placeholder="Job title"
              value={form.job_title}
              onChange={(event) => updateForm("job_title", event.target.value)}
            />
            <Input
              required
              placeholder="Country"
              value={form.country}
              onChange={(event) => updateForm("country", event.target.value)}
            />
            <Input
              required
              placeholder="Department"
              value={form.department}
              onChange={(event) => updateForm("department", event.target.value)}
            />
            <Input
              required
              type="number"
              min={0}
              placeholder="Salary"
              value={form.salary}
              onChange={(event) => updateForm("salary", event.target.value)}
            />
          </div>

          <Button className="mt-4 w-full" type="submit" disabled={saving}>
            {editingEmployee ? <Save /> : <Plus />}
            {saving
              ? "Saving"
              : editingEmployee
                ? "Save changes"
                : "Add employee"}
          </Button>
        </form>
      </section>
    </main>
  );
}
