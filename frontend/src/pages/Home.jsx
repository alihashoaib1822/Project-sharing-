import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ProjectFeed from "../components/ProjectFeed";
import SubmitProject from "../components/SubmitProject";
import Footer from "../components/Footer";
import EditProjectModal from "../components/EditProjectModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Instantly reflect a new submission on the homepage feed without
  // waiting for a full refetch — then re-sync with the server in the background.
  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    fetchProjects();
  };

  // Edit flow -----------------------------------------------------------
  const handleEditClick = (project) => setEditingProject(project);

  const handleProjectUpdated = (updatedProject) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
    setEditingProject(null);
    setToastMessage("Project updated successfully!");
  };

  // Delete flow ---------------------------------------------------------
  const handleDeleteClick = (project) => setDeletingProject(project);

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/projects/${deletingProject._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== deletingProject._id));
      setToastMessage("Project deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project.");
    } finally {
      setDeleteLoading(false);
      setDeletingProject(null);
    }
  };

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.developer?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [projects, search]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          search={search}
          setSearch={setSearch}
        />

        <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
          <div className="lg:w-[70%]">
            <ProjectFeed
              projects={filteredProjects}
              loading={loading}
              error={error}
              currentUserId={user?.id}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </div>
          <div className="lg:w-[30%]">
            <SubmitProject onProjectCreated={handleProjectCreated} />
          </div>
        </main>

        <Footer />
      </div>

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdated={handleProjectUpdated}
        />
      )}

      <ConfirmDialog
        open={!!deletingProject}
        title="Delete this project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProject(null)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
