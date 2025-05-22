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

        const colors = [
          "--chart-1",
          "--chart-2",
          "--chart-3",
          "--chart-4",
          "--chart-5",
        ];

        const formatted = topAssets.map((a, i) => ({
          ticker: a.ticker,
          value: a.current_value,
          fill: `hsl(var(${colors[i % colors.length]}))`,
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
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Assets</CardTitle>
        <CardDescription>Based on current market value</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="ticker"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value]?.label || value}
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending assets this month <TrendingUp className="w-4 h-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current top 5 by USD value
        </div>
      </CardFooter>
    </Card>
  );
}
