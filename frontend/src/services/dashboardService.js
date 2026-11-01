import { getProjects } from "./projectService";
import { getTasks } from "./taskService";

export const getDashboardData = async () => {
  const [projects, tasks] = await Promise.all([
    getProjects(),
    getTasks(),
  ]);

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);

  return {
    projects,
    tasks,
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    pendingTasks: pendingTasks.length,
  };
};