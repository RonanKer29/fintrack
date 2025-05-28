import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { subDays, subMonths, subYears, isAfter } from "date-fns";
import { Card } from "@/components/ui/card";

const formatDate = (str) =>
  new Date(str).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const applyFilter = (data, filter) => {
  const now = new Date();
  let startDate;

  switch (filter) {
    case "1J":
      startDate = subDays(now, 1);
      break;
    case "7J":
      startDate = subDays(now, 7);
      break;
    case "1M":
      startDate = subMonths(now, 1);
      break;
    case "YTD":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "1A":
      startDate = subYears(now, 1);
      break;
    case "TOUT":
    default:
      return data;
  }

  return data.filter((entry) => {
    const entryDate = new Date(entry.date);
    return isAfter(entryDate, startDate);
  });
};

export default function PortfolioPerformanceChart() {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("YTD");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:8000/portfolios/performance-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Erreur chargement historique");

        const data = await res.json();
        setChartData(data);
      } catch (err) {
        console.error("Erreur chargement performance :", err);
      }
    };

    fetchHistory();
  }, []);

  const filteredData = useMemo(
    () => applyFilter(chartData, filter),
    [chartData, filter]
  );

  const latestValue =
    filteredData.length > 0 ? filteredData[filteredData.length - 1].value : 0;
  const latestDate =
    filteredData.length > 0
      ? formatDate(filteredData[filteredData.length - 1].date)
      : "";

  return (
    <Card className="bg-[#212121] text-white rounded-xl p-6">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-400">{latestDate}</p>
          <h2 className="text-4xl font-bold">{latestValue} CHF</h2>
        </div>

        <div className="flex flex-wrap gap-2 text-sm font-medium">
          {["1J", "7J", "1M", "YTD", "1A", "TOUT"].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full transition-colors ${
                t === filter
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[240px]">
        <ResponsiveContainer>
          <LineChart data={filteredData}>
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#1f1f1f" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#999", fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value) => value.slice(5)} // MM-DD
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#999", fontSize: 12 }}
              tickFormatter={(val) => `${val} CHF`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "none",
                color: "white",
              }}
              labelStyle={{ color: "#aaa" }}
              formatter={(value) => [`${value} CHF`, "Valeur"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#facc15"
              strokeWidth={2}
              dot={false}
              fill="url(#colorLine)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
