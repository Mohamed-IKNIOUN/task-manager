import { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import { getProjects } from "../services/projectService";
import Modal from "../components/Modal";

import {
  Plus,
  CheckCircle,
  Clock,
  ListTodo,
  Pencil,
  Trash2,
} from "lucide-react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [projectId, setProjectId] = useState("");

  const fetchData = async () => {
    try {
      const [tasksData, projectsData] = await Promise.all([
        getTasks(),
        getProjects(),
      ]);

      setTasks(tasksData);
      setProjects(projectsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setCompleted(false);
    setProjectId("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const task = {
      title,
      description,
      completed,
      projectId: Number(projectId),
    };

    try {
      if (editingTaskId !== null) {
        await updateTask(editingTaskId, task);
      } else {
        await createTask(task);
      }

      resetForm();
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to save task.");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setCompleted(task.completed);
    setProjectId(String(task.projectId));
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(id);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Unable to delete task.");
    }
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const getProjectName = (id) => {
    const project = projects.find((project) => project.id === id);
    return project ? project.name : `Project #${id}`;
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your tasks.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={ListTodo}
          color="bg-indigo-100 text-indigo-600"
        />

        <StatCard
          title="Completed"
          value={completedCount}
          icon={CheckCircle}
          color="bg-green-100 text-green-600"
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          color="bg-orange-100 text-orange-600"
        />

      </div>

      {/* Tasks table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="font-semibold text-gray-900">All Tasks</h2>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center">
            <ListTodo className="mx-auto mb-3 text-gray-400" size={40} />
            <h3 className="font-semibold text-gray-800">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first task to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Task</th>
                  <th className="px-6 py-4 font-medium">Project</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {task.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {getProjectName(task.projectId)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          task.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                          title="Edit task"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(task.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Delete task"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {isModalOpen && (
        <Modal
          title={editingTaskId !== null ? "Edit Task" : "Create Task"}
          onClose={resetForm}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Task Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
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
                placeholder="Describe your task"
                rows="3"
                required
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project
              </label>

              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select a project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={completed}
                onChange={(event) => setCompleted(event.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />
              Mark as completed
            </label>

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
                {editingTaskId !== null ? "Save Changes" : "Create Task"}
              </button>
            </div>

          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <div className={`rounded-lg p-3 ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default Tasks;