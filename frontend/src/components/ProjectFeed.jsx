import React from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectFeed({ projects, loading, error, currentUserId, onEdit, onDelete }) {
  return (
    <section className="flex-1">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Project Feed
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Explore Community Projects
      </p>

      {loading && (
        <div className="mt-10 text-center text-sm text-gray-400">
          Loading projects...
        </div>
      )}

      {error && !loading && (
        <div className="mt-10 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600 dark:border-red-900 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-10 text-center text-sm text-gray-400 dark:border-gray-700">
          No projects yet — be the first to submit one!
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
