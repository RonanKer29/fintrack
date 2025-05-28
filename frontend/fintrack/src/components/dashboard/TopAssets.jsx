"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function TopAsset() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopAssets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/assets/top", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Erreur lors du chargement des données");
        const topAssets = await res.json();

        // Jaune brutalisme : variantes cohérentes
        const colors = ["#fde68a", "#facc15", "#eab308", "#ca8a04", "#a16207"];

        const formatted = topAssets.map((a, i) => ({
          ticker: a.ticker,
          value: a.current_value,
          fill: colors[i % colors.length],
        }));

        setData(formatted);
      } catch (err) {
        console.error("Erreur TopAsset:", err);
      }
    };

    fetchTopAssets();
  }, []);

  const chartConfig = {
    value: {
      label: "Current Value (USD)",
    },
    ...Object.fromEntries(
      data.map((a) => [
        a.ticker,
        {
          label: a.ticker,
          color: a.fill,
        },
      ])
    ),
  };

  return (
    <Card className="bg-[#212121] text-white rounded-xl p-6">
      <CardHeader>
        <CardTitle className="text-white">Top 5 actifs</CardTitle>
        <CardDescription className="text-gray-400">
          Basé sur la valeur de marché actuelle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 10 }}
            barSize={20}
          >
            <YAxis
              dataKey="ticker"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#ddd", fontSize: 13 }}
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              layout="vertical"
              radius={5}
              fill="#facc15"
              isAnimationActive={true}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Tendance du mois <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-gray-400">Top 5 par valeur actuelle (USD)</div>
      </CardFooter>
    </Card>
  );
}
