import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import api from "../api/axios";

export default function EditProjectModal({ project, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: project.title || "",
    developer: project.developer || "",
    description: project.description || "",
    hostedUrl: project.hostedUrl || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.put(`/projects/${project._id}`, form);
      onUpdated(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Project</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={handleChange("title")}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Developer Name
            </label>
            <input
              type="text"
              required
              value={form.developer}
              onChange={handleChange("developer")}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Description
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={handleChange("description")}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hosted URL
            </label>
            <input
              type="url"
              required
              value={form.hostedUrl}
              onChange={handleChange("hostedUrl")}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#1E5AA8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#184a8a] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
