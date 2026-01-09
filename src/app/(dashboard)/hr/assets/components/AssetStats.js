// src/app/(dashboard)/hr/assets/components/AssetStats.js
"use client";
import { useEffect, useState } from "react";
import { Package, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";
import { assetService } from "../../../../../services/hr-services/asset.service";

export default function AssetStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await assetService.getAssetsStats();
        setStats(response.data);
      } catch (error) {
        console.error("Asset stats error:", error.message);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  const cardData = [
    {
      title: "Total Assets",
      value: stats.totalAssets,
      icon: Package,
      color: "bg-blue-500"
    },
    {
      title: "Available Assets",
      value: stats.byStatus?.available || 0,
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Maintenance Due",
      value: stats.assetsDueForMaintenance,
      icon: AlertTriangle,
      color: "bg-yellow-500"
    },
    {
      title: "Total Asset Value",
      value: `₹${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {cardData.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
