package com.taskmanager.task_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanager.task_service.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long>{

}
