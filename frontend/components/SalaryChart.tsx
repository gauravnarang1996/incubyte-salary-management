"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CountryInsight } from "@/lib/types";

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
      <BarChart data={data}>
        <XAxis dataKey="country" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="avg_salary" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
