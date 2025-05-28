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
  const gainColor = isPositive ? "text-emerald-400" : "text-rose-500";

  return (
    <Card className="bg-[#212121] text-white rounded-xl p-6">
      <CardHeader>
        <CardTitle className="text-white">Performance globale</CardTitle>
        <CardDescription className="text-gray-400">
          Évaluation basée sur les prix actuels du marché
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Prix d'achat total</span>
          <span className="font-medium">
            $
            {total_cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-300">
          <span>Valeur actuelle</span>
          <span className="font-medium">
            $
            {current_value.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Gain / Perte</span>
          <span className={gainColor}>
            {gain >= 0 ? "+" : ""}$
            {gain.toLocaleString(undefined, { maximumFractionDigits: 0 })} (
            {percentage_gain.toFixed(2)}%)
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 text-sm text-gray-400">
        <TrendIcon className={`w-4 h-4 ${gainColor}`} />
        <span>
          Le portefeuille a {isPositive ? "augmenté" : "diminué"} de{" "}
          {Math.abs(percentage_gain).toFixed(2)}%
        </span>
      </CardFooter>
    </Card>
  );
}
