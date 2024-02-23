package bean;
import entities.UserEntity;
import entities.CategoryEntity;
import entities.TaskEntity;

import java.util.ArrayList;
import java.util.List;
import dao.TaskDao;
import dao.UserDao;
import bean.UserBean;
import dto.Task;
import entities.CategoryEntity;
import entities.TaskEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.ejb.Stateless;


@Singleton

public class TaskBean {
    public TaskBean() {
    }
    @EJB
    TaskDao taskDao;
    public boolean isTaskValid(Task task) {
        if (task.getTitle().isBlank() || task.getDescription().isBlank() || task.getStartDate() == null || task.getEndDate() == null) {
            return false;
        } else {
            return task.getTitle() != null && task.getDescription() != null && task.getStartDate() != null && task.getEndDate() != null;
        }
    }

    public TaskEntity convertToEntity(dto.Task task) {
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setId(task.getId());
        taskEntity.setTitle(task.getTitle());
        taskEntity.setDescription(task.getDescription());
        taskEntity.setStatus(task.getStatus());
        taskEntity.setCategory(convertCatToEntity(task.getCategory()));
        taskEntity.setStartDate(task.getStartDate());
        taskEntity.setPriority(task.getPriority());
        taskEntity.setEndDate(task.getEndDate());
        return taskEntity;

    }
    public CategoryEntity convertCatToEntity(String name) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setCreator(taskDao.findCreatorByName(name));
        categoryEntity.setName(name);
        return categoryEntity;
    }
    public String convertCatToDto(CategoryEntity categoryEntity) {
        return categoryEntity.getName();
    }
    public dto.Task convertToDto(TaskEntity taskEntity) {
        dto.Task task = new dto.Task();
        task.setId(taskEntity.getId());
        task.setTitle(taskEntity.getTitle());
        task.setDescription(taskEntity.getDescription());
        task.setStatus(taskEntity.getStatus());
        task.setCategory(convertCatToDto(taskEntity.getCategory()));
        task.setStartDate(taskEntity.getStartDate());
        task.setPriority(taskEntity.getPriority());
        task.setEndDate(taskEntity.getEndDate());
        return task;
    }

    public void addTask(TaskEntity taskEntity) {
        taskDao.createTask(taskEntity);
    }
    public List<TaskEntity> getTasks() {
        return taskDao.findAll();
    }
    public  List<TaskEntity> getTasksByUser(UserEntity userEntity) {
        return taskDao.findTasksByUser(userEntity);
    }
    public List<Task> convertToDtoList(List<TaskEntity> taskEntities) {
        List<Task> tasks = new ArrayList<>();
        for (TaskEntity taskEntity : taskEntities) {
            tasks.add(convertToDto(taskEntity));
        }
        return tasks;
    }
}
