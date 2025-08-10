"use client";

import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const monthlyData = [
  { month: "JAN", thisYear: 0, lastYear: 0 },
  { month: "FEB", thisYear: 400000, lastYear: 50000 },
  { month: "MAR", thisYear: 1200000, lastYear: 800000 },
  { month: "APR", thisYear: 800000, lastYear: 4800000 },
  { month: "MAY", thisYear: 20000, lastYear: 500000 },
  { month: "JUN", thisYear: 180000, lastYear: 200000 },
  { month: "JUL", thisYear: 50000, lastYear: 150000 },
  { month: "AUG", thisYear: 10000, lastYear: 50000 },
  { month: "SEP", thisYear: 500000, lastYear: 100000 },
  { month: "OCT", thisYear: 450000, lastYear: 800000 },
  { month: "NOV", thisYear: 200000, lastYear: 600000 },
  { month: "DEC", thisYear: 50000, lastYear: 100000 },
];

const chartConfig = {
  thisYear: {
    label: "This Year",
    color: "#8b5cf6",
  },
  lastYear: {
    label: "Last Year",
    color: "#ec4899",
  },
};

export function RevenueReport() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Month" | "Year">(
    "Year"
  );

  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) {
      return `${value / 1000000}M`;
    }
    if (value >= 1000) {
      return `${value / 1000}k`;
    }
    return value.toString();
  };

  const formatTooltipValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <Card className="w-full bg-white dark:bg-blue-500 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-black">
            Revenue report
          </h2>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-violet-500"></div>
              <span className="text-sm text-gray-600 dark:text-black">This Year</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-sm text-gray-600 dark:text-black">Last Year</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedPeriod === "Month" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("Month")}
            className={
              selectedPeriod === "Month"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white dark:text-black text-gray-600 hover:bg-gray-50"
            }
          >
            Month
          </Button>
          <Button
            variant={selectedPeriod === "Year" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("Year")}
            className={
              selectedPeriod === "Year"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-white dark:text-black text-gray-600 hover:bg-gray-50"
            }
          >
            Year
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={formatYAxisTick}
                domain={[0, 5000000]}
                ticks={[0, 50000, 100000, 500000, 1000000, 5000000]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatTooltipValue(value as number),
                      chartConfig[name as keyof typeof chartConfig]?.label ||
                        name,
                    ]}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="thisYear"
                stroke={chartConfig.thisYear.color}
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 4, fill: chartConfig.thisYear.color }}
              />
              <Line
                type="monotone"
                dataKey="lastYear"
                stroke={chartConfig.lastYear.color}
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 4, fill: chartConfig.lastYear.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
