import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";

import {
  FolderKanban,
  ListTodo,
  CheckCircle,
  Clock,
} from "lucide-react";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getDashboardData();
        setData(result);
      } catch (error) {
        console.error(error);
        setError("Unable to load dashboard data.");
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  const stats = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      icon: FolderKanban,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      icon: ListTodo,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Completed Tasks",
      value: data.completedTasks,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Tasks",
      value: data.pendingTasks,
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your projects and tasks.
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent projects */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Recent Projects
        </h2>

        {data.projects.length === 0 ? (
          <p className="text-sm text-gray-500">
            No projects available yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.projects.slice(-5).reverse().map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {project.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {project.description}
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                  Project #{project.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent tasks */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Recent Tasks
        </h2>

        {data.tasks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No tasks available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="pb-3 font-medium">Task</th>
                  <th className="pb-3 font-medium">Project ID</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {data.tasks.slice(-5).reverse().map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-4 font-medium text-gray-800">
                      {task.title}
                    </td>

                    <td className="py-4 text-gray-500">
                      #{task.projectId}
                    </td>

                    <td className="py-4">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;