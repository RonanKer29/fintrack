"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PortfolioPerformance() {
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:8000/portfolios/performance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Erreur chargement performance");
        const data = await res.json();
        setPerformance(data);
      } catch (err) {
        console.error("Erreur fetch performance:", err);
      }
    };

    fetchPerformance();
  }, []);

  if (!performance) return null;

  const { total_cost, current_value, gain, percentage_gain } = performance;

  const isPositive = gain >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const gainColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Performance</CardTitle>
        <CardDescription>Based on current market prices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cost Basis</span>
          <span>${total_cost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current Value</span>
          <span>${current_value.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Gain / Loss</span>
          <span className={gainColor}>
            {gain >= 0 ? "+" : ""}${gain.toLocaleString()} (
            {percentage_gain.toFixed(2)}%)
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendIcon className="w-4 h-4" />
        <span>
          Portfolio {isPositive ? "increased" : "decreased"} by{" "}
          {Math.abs(percentage_gain).toFixed(2)}%
        </span>
      </CardFooter>
    </Card>
  );
}
