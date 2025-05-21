"use client";

import { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Label } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  stock: {
    label: "Actions",
    color: "hsl(var(--chart-1))",
  },
  etf: {
    label: "ETF",
    color: "hsl(var(--chart-2))",
  },
  crypto: {
    label: "Crypto",
    color: "hsl(var(--chart-3))",
  },
};

const PortfolioChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/portfolios/1/realtime-distribution"
        );
        const data = await res.json();

        // Grouper par type (stock, etf, crypto)
        const grouped = data.reduce((acc, item) => {
          if (!acc[item.type]) acc[item.type] = 0;
          acc[item.type] += item.value;
          return acc;
        }, {});

        const transformed = Object.entries(grouped).map(([type, value]) => ({
          type,
          value,
          fill: chartConfig[type]?.color,
        }));

        setChartData(transformed);
      } catch (err) {
        console.error("Erreur chargement données portfolio:", err);
      }
    };

    fetchData();
  }, []);

  const totalValue = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition du portefeuille</CardTitle>
        <CardDescription>Actions / ETF / Crypto</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox?.cx && viewBox?.cy) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-2xl font-bold fill-foreground"
                        >
                          {totalValue.toLocaleString()} $
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 20}
                          className="text-sm fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Visualisation instantanée <TrendingUp className="w-4 h-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Répartition basée sur la valeur actuelle du marché
        </div>
      </CardFooter>
    </Card>
  );
};

export default PortfolioChart;
