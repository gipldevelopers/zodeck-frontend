"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Link from "next/link";
import { assetService } from "@/services/hr-services/asset.service";

export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    depreciationRate: "",
    usefulLife: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await assetService.createCategory({
        name: formData.name.trim(),
        description: formData.description?.trim(),
        depreciationRate: Number(formData.depreciationRate),
        usefulLife: Number(formData.usefulLife),
        isActive: true,
      });

      router.push("/hr/assets/categories");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        rightContent={
          <Link
            href="/hr/assets/categories"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft size={18} /> Back to Categories
          </Link>
        }
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Add Asset Category
          </h1>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Category name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="depreciationRate"
                placeholder="Depreciation %"
                required
                value={formData.depreciationRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="number"
                name="usefulLife"
                placeholder="Useful Life (years)"
                required
                value={formData.usefulLife}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/hr/assets/categories"
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
