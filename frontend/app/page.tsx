import Link from "next/link";
import { BarChart3, DollarSign, Globe2, Users } from "lucide-react";

import SalaryChart from "@/components/SalaryChart";
import { Button } from "@/components/ui/button";
import { backendUrl } from "@/lib/backend";
import type { DashboardMetrics } from "@/lib/types";

const fallbackMetrics: DashboardMetrics = {
  total_employees: 0,
  avg_salary: null,
  countries: 0,
  payroll: null,
};

function formatCurrency(value: number | null) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

async function getMetrics() {
  try {
    const response = await fetch(backendUrl("/dashboard/"), {
      cache: "no-store",
    });

    if (!response.ok) {
      return fallbackMetrics;
    }

    return (await response.json()) as DashboardMetrics;
  } catch {
    return fallbackMetrics;
  }
}

export default async function Home() {
  const metrics = await getMetrics();
  const cards = [
    {
      label: "Employees",
      value: metrics.total_employees.toLocaleString(),
      icon: Users,
    },
    {
      label: "Average salary",
      value: formatCurrency(metrics.avg_salary),
      icon: BarChart3,
    },
    {
      label: "Countries",
      value: metrics.countries.toLocaleString(),
      icon: Globe2,
    },
    {
      label: "Payroll",
      value: formatCurrency(metrics.payroll),
      icon: DollarSign,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            Salary Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor payroll, compensation spread, and workforce distribution.
          </p>
        </div>

        <Button asChild>
          <Link href="/employees">
            <Users />
            Manage employees
          </Link>
        </Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} className="rounded-lg border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {card.label}
                </span>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-semibold">{card.value}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <div className="mb-4">
          <h2 className="text-sm font-medium">Average salary by country</h2>
        </div>
        <SalaryChart />
      </section>
    </main>
  );
}
