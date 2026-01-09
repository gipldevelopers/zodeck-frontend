"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { UploadCloud, Trash2 } from "lucide-react";

export default function ProfilePicturePage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Settings", href: "/employee/settings" },
    { label: "Profile Picture", href: "/employee/settings/profile-picture" },
  ];

  const [avatar, setAvatar] = useState(
    "https://avatars.dicebear.com/api/gridy/profile.svg"
  );
  const [message, setMessage] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setAvatar("https://avatars.dicebear.com/api/gridy/profile.svg");
  };

  const handleSave = () => {
    // Handle save logic here (API call or state persistence)
    console.log("Profile picture updated:", avatar);
    setMessage("Profile picture has been updated successfully!");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {/* Full-width container */}
      <div className="mt-8 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Profile Picture
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Update your profile avatar to personalize your account.
        </p>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Avatar Card */}
          <div className="flex flex-col items-center gap-4 bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-sm w-full lg:w-1/3">
            <div className="w-36 h-36 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={avatar}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition">
                <UploadCloud size={18} /> Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> Reset
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm w-full lg:w-2/3">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Recommended Size
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Use a square image (e.g., 200x200px) for the best result. Supported formats: PNG, JPG, SVG.
            </p>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Tips
            </h3>
            <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-1">
              <li>Use a neutral or professional avatar.</li>
              <li>Ensure good contrast with the background.</li>
              <li>Avoid low-resolution images.</li>
            </ul>
            <p className="text-sm text-gray-400 mt-4">
              Changes will be visible after saving.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <p className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg dark:bg-green-700 dark:text-green-100 w-max">
            {message}
          </p>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
