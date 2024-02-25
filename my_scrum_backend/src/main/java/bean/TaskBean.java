package bean;
import dto.Category;
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
    @EJB
    UserDao userDao;
    public boolean isTaskValid(Task task) {
        if (task.getTitle().isBlank() || task.getDescription().isBlank() || task.getStartDate() == null || task.getEndDate() == null || task.getCategory() == null) {
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
        //taskEntity.setCategory(taskDao.findCategoryByName(task.getCategory()));
        taskEntity.setStartDate(task.getStartDate());
        taskEntity.setPriority(task.getPriority());
        taskEntity.setEndDate(task.getEndDate());
        return taskEntity;

    }
    public CategoryEntity convertCatToEntity(String name) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setCreator(taskDao.findCategoryByName(name).getCreator());
        categoryEntity.setName(name);
        return categoryEntity;
    }
    public Category convertCatToDto(CategoryEntity categoryEntity) {
        Category category = new Category();
        category.setName(categoryEntity.getName());
        return category;
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
    public boolean categoryExists(String name) {
        if(taskDao.findCategoryByName(name) != null) {
            return true;
        }
        return false;
    }
    public void createCategory(String name, String creator) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setName(name);
        categoryEntity.setCreator(creator);
        taskDao.createCategory(categoryEntity);
    }
    public boolean removeCategory(String name) {
        CategoryEntity a = taskDao.findCategoryByName(name);
        if (a != null) {
            taskDao.removeCategory(a);
            return true;
        }
        return false;
    }
    public CategoryEntity findCategoryByName(String name) {
        return taskDao.findCategoryByName(name);
    }
    public boolean blockTask(String id) {
        TaskEntity a = taskDao.findTaskById(id);
        if (a != null) {
            a.setActive(false);
            taskDao.updateTask(a);
            return true;
        }
        return false;
    }
    public boolean removeTask(String id) {
        TaskEntity a = taskDao.findTaskById(id);
        if (a != null) {
            taskDao.remove(a);
            return true;
        }
        return false;
    }
    public List<TaskEntity> getTasksByCategory(String category) {
        return taskDao.findTasksByCategory(category);
    }
    public boolean unblockTask(String id) {
        TaskEntity a = taskDao.findTaskById(id);
        if (a != null) {
            a.setActive(true);
            taskDao.updateTask(a);
            return true;
        }
        return false;
    }
    public List <TaskEntity> getBlockedTasks() {
        return taskDao.findBlockedTasks();
    }
    public boolean updateTask(TaskEntity task) {
        TaskEntity a = taskDao.findTaskById(task.getId());
        if (a != null) {
            a.setTitle(task.getTitle());
            a.setDescription(task.getDescription());
            a.setPriority(task.getPriority());
            a.setStatus(task.getStatus());
            a.setStartDate(task.getStartDate());
            a.setEndDate(task.getEndDate());
            taskDao.updateTask(a);
            return true;
        }
        return false;
    }
    public boolean changeStatus(String id, int status) {
        TaskEntity a = taskDao.findTaskById(id);
        if (a != null) {
            a.setStatus(status);
            taskDao.updateTask(a);
            return true;
        }
        return false;
    }
    public List<CategoryEntity> getAllCategories() {
        return taskDao.findAllCategories();
    }

}
