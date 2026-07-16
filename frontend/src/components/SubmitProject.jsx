import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function SubmitProject({ onProjectCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    developer: user?.name || "",
    description: "",
    hostedUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.post("/projects", form);
      // Refresh the homepage feed instantly with the new project
      onProjectCreated(data);
      setSuccess("Project submitted successfully!");
      setForm({
        title: "",
        developer: user?.name || "",
        description: "",
        hostedUrl: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-full lg:w-[340px] lg:shrink-0">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Submit Your Project
        </h2>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-600 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-400">
            {success}
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
              placeholder="Enter project name"
              value={form.title}
              onChange={handleChange("title")}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Developer Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={form.developer}
                onChange={handleChange("developer")}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm text-gray-500 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400"
              />
              <FiEdit2 className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Description
            </label>
            <textarea
              required
              placeholder="Briefly describe your project..."
              rows={3}
              value={form.description}
              onChange={handleChange("description")}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hosted URL
            </label>
            <input
              type="url"
              required
              placeholder="e.g., https://myproject.com"
              value={form.hostedUrl}
              onChange={handleChange("hostedUrl")}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1E5AA8] focus:ring-1 focus:ring-[#1E5AA8] dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1E5AA8] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#184a8a] disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Project"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Your project will appear on the feed instantly upon submission.
          </p>
        </form>
      </div>
    </aside>
  );
}
