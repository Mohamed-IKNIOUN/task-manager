import { useEffect, useState } from "react";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

import Modal from "../components/Modal";

import {
  Plus,
  FolderKanban,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingProjectId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const project = { name, description };

    try {
      if (editingProjectId !== null) {
        await updateProject(editingProjectId, project);
      } else {
        await createProject(project);
      }

      resetForm();
      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Unable to save project.");
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await deleteProject(id);
      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Unable to delete project.");
    }
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Projects
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and organize all your projects.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Project count */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
          <FolderKanban size={22} />
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Total Projects
          </p>

          <p className="text-2xl font-bold text-gray-900">
            {projects.length}
          </p>
        </div>
      </div>

      {/* Projects grid */}
      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <FolderOpen className="mx-auto mb-3 text-gray-400" size={40} />

          <h3 className="font-semibold text-gray-800">
            No projects yet
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="rounded-lg bg-indigo-100 p-3 text-indigo-600">
                  <FolderKanban size={22} />
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  #{project.id}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {project.name}
              </h3>

              <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                {project.description}
              </p>

              <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {isModalOpen && (
        <Modal
          title={editingProjectId !== null ? "Edit Project" : "Create Project"}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter project name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe your project"
                rows="4"
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {editingProjectId !== null ? "Save Changes" : "Create Project"}
              </button>
            </div>

          </form>
        </Modal>
      )}
    </div>
  );
}

export default Projects;