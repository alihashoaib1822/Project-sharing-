import Project from "../models/Project.js";

// GET /api/projects
// Returns all projects, most recently submitted first
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
};

// POST /api/projects
// Creates a new project, associated with the logged-in user
export const createProject = async (req, res) => {
  try {
    const { title, developer, description, hostedUrl } = req.body;

    if (!title || !developer || !description || !hostedUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = await Project.create({
      title,
      developer,
      description,
      hostedUrl,
      owner: req.user.id,
    });

    const populated = await project.populate("owner", "name email");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit project", error: err.message });
  }
};

// PUT /api/projects/:id
// Updates a project - only the owner may edit it
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, developer, description, hostedUrl } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own projects" });
    }

    if (!title || !developer || !description || !hostedUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    project.title = title;
    project.developer = developer;
    project.description = description;
    project.hostedUrl = hostedUrl;
    await project.save();

    const populated = await project.populate("owner", "name email");

    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project", error: err.message });
  }
};

// DELETE /api/projects/:id
// Deletes a project - only the owner may delete it
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own projects" });
    }

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
};
