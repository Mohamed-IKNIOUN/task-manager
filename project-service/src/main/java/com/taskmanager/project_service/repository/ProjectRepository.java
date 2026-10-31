package com.taskmanager.project_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanager.project_service.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long>{

}
