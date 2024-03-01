package bean;
import dto.Category;
import dto.TaskCreator;
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
        taskEntity.setCategory(taskDao.findCategoryByName(task.getCategory()));
        taskEntity.setStartDate(task.getStartDate());
        taskEntity.setPriority(task.getPriority());
        taskEntity.setEndDate(task.getEndDate());
        taskEntity.setUser(taskDao.findTaskById(task.getId()).getUser());
        taskEntity.setActive(true);
        return taskEntity;
    }
    public TaskEntity createTaskEntity(dto.Task task, String username) {
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setId(task.getId());
        taskEntity.setTitle(task.getTitle());
        taskEntity.setDescription(task.getDescription());
        taskEntity.setStatus(task.getStatus());
        taskEntity.setCategory(taskDao.findCategoryByName(task.getCategory()));
        taskEntity.setStartDate(task.getStartDate());
        taskEntity.setPriority(task.getPriority());
        taskEntity.setEndDate(task.getEndDate());
        taskEntity.setUser(userDao.findUserByUsername(username));
        taskEntity.setActive(true);
        return taskEntity;
    }
    public TaskEntity createTaskEntity(dto.Task task, UserEntity userEntity) {
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setId(task.getId());
        taskEntity.setTitle(task.getTitle());
        taskEntity.setDescription(task.getDescription());
        taskEntity.setStatus(task.getStatus());
        taskEntity.setCategory(taskDao.findCategoryByName(task.getCategory()));
        taskEntity.setStartDate(task.getStartDate());
        taskEntity.setPriority(task.getPriority());
        taskEntity.setEndDate(task.getEndDate());
        taskEntity.setUser(userEntity);
        taskEntity.setActive(true);
        return taskEntity;
    }
    public boolean restoreTask(String id) {
        TaskEntity a = taskDao.findTaskById(id);
        if (a != null) {
            a.setActive(true);
            taskDao.updateTask(a);
            return true;
        }
        return false;
    }
    public CategoryEntity convertCatToEntity(Category category) {
        CategoryEntity categoryEntity= taskDao.findCategoryById(category.getId());
        categoryEntity.setName(category.getName());
        return categoryEntity;
    }
    public Category convertCatToDto(CategoryEntity categoryEntity) {
        Category category = new Category();
        category.setId(categoryEntity.getId());
        category.setName(categoryEntity.getName());
        return category;
    }
    public dto.Task convertToDto(TaskEntity taskEntity) {
        dto.Task task = new dto.Task();
        task.setId(taskEntity.getId());
        task.setTitle(taskEntity.getTitle());
        task.setDescription(taskEntity.getDescription());
        task.setStatus(taskEntity.getStatus());
        task.setCategory(convertCatToDto(taskEntity.getCategory()).getName());
        task.setStartDate(taskEntity.getStartDate());
        task.setPriority(taskEntity.getPriority());
        task.setEndDate(taskEntity.getEndDate());
        task.setActive(taskEntity.isActive());
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
    public boolean deleteAllTasksByUser(UserEntity userEntity) {
        List<TaskEntity> tasks = taskDao.findTasksByUser(userEntity);
        for(TaskEntity task: tasks){
            task.setActive(false);
        }
        return true;
    }
    public List<Task> convertToDtoList(List<TaskEntity> taskEntities) {
        List<Task> tasks = new ArrayList<>();
        for (TaskEntity taskEntity : taskEntities) {
            tasks.add(convertToDto(taskEntity));
        }
        return tasks;
    }
    public Task findTaskById(String id) {
        return convertToDto(taskDao.findTaskById(id));
    }
    public TaskCreator findUserById(String id) {
    TaskEntity taskEntity = taskDao.findTaskById(id);
        TaskCreator taskCreator = new TaskCreator();
        taskCreator.setUsername(taskEntity.getUser().getUsername());
        taskCreator.setName(taskEntity.getUser().getName());
        return taskCreator;
    }
    public boolean categoryExists(String name) {
        if(taskDao.findCategoryByName(name) != null) {
            return true;
        }
        return false;
    }
    public boolean updateCategory(CategoryEntity categoryEntity) {
        CategoryEntity a = taskDao.findCategoryById(categoryEntity.getId());
        if (a != null) {
            a.setName(categoryEntity.getName());
            taskDao.updateCategory(a);
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
        List<TaskEntity> tasks = taskDao.findAll();
        List<TaskEntity> tasksByCategory = new ArrayList<>();
        for(TaskEntity task : tasks) {
            if(task.getCategory().getName().equals(name)) {
                tasksByCategory.add(task);
            }
        }
        if(tasksByCategory.isEmpty()) {
            taskDao.removeCategory(taskDao.findCategoryByName(name));
            return true;
        }
        return false;
    }
    public CategoryEntity findCategoryByName(String name) {
        return taskDao.findCategoryByName(name);
    }
    public CategoryEntity findCategoryById(int id) {
        return taskDao.findCategoryById(id);
    }
    public boolean blockTask(String id,String role) {
        TaskEntity a = taskDao.findTaskById(id);
        if (a != null) {
            if(a.isActive() && !role.equals("developer")) {
                a.setActive(false);
                taskDao.updateTask(a);
            }else if(!a.isActive()&& role.equals("Owner")) {
                taskDao.remove(a);
            }
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
    public void setTaskDao(TaskDao taskDao) {
        this.taskDao = taskDao;
    }
    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }
    public void setInitialId(Task task){
        task.setId("Task" + System.currentTimeMillis());}

}
