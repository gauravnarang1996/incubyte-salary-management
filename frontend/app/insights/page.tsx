import SalaryChart
from "@/components/SalaryChart";

export default function InsightsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Salary Insights
      </h1>

      <SalaryChart />
    </main>
  );
}