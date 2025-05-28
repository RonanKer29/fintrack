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
    color: "#fde68a", // jaune clair
  },
  etf: {
    label: "ETF",
    color: "#facc15", // jaune moyen
  },
  crypto: {
    label: "Crypto",
    color: "#ca8a04", // jaune foncé
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

        const grouped = data.reduce((acc, item) => {
          if (!acc[item.type]) acc[item.type] = 0;
          acc[item.type] += item.value;
          return acc;
        }, {});

        const transformed = Object.entries(grouped).map(([type, value]) => ({
          type,
          value,
          fill: chartConfig[type]?.color || "#888",
        }));

        setChartData(transformed);
      } catch (err) {
        console.error("Loading portfolio data error:", err);
      }
    };

    fetchData();
  }, []);

  const totalValue = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col bg-[#212121] text-white rounded-xl p-6">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition du portefeuille</CardTitle>
        <CardDescription className="text-gray-400">
          Actions / ETF / Crypto
        </CardDescription>
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
              innerRadius={70}
              strokeWidth={5}
              stroke="#1f1f1f" // bordure discrète pour contraste
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
                          className="text-2xl font-bold fill-white"
                        >
                          {totalValue.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}{" "}
                          $
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 20}
                          className="text-sm fill-gray-400"
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
          Vue instantanée <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-gray-400">
          Basé sur la valeur actuelle du marché
        </div>
      </CardFooter>
    </Card>
  );
};

export default PortfolioChart;
