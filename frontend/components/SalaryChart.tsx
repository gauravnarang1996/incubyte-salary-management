"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CountryInsight } from "@/lib/types";

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default function SalaryChart() {
  const [data, setData] =
    useState<CountryInsight[]>([]);

  useEffect(() => {
    fetch(
      "/api/insights/country"
    )
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <ResponsiveContainer
      width="100%"
      height={400}
    >
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis dataKey="country" tickLine={false} />

        <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />

        <Tooltip
          formatter={(value, name) => [
            formatCurrency(value as number | string),
            String(name),
          ]}
        />

        <Legend />

        <Bar
          dataKey="min_salary"
          name="Minimum salary"
          fill="#0f766e"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="avg_salary"
          name="Average salary"
          fill="var(--primary)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="max_salary"
          name="Maximum salary"
          fill="#dc2626"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
