package com.taskmanager.project_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.taskmanager.project_service.entity.Project;
import com.taskmanager.project_service.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existingProject = getProjectById(id);

        existingProject.setName(updatedProject.getName());
        existingProject.setDescription(updatedProject.getDescription());

        return projectRepository.save(existingProject);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}