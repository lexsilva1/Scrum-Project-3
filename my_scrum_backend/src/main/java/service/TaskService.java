package service;

import bean.TaskBean;
import bean.UserBean;
import dto.Category;
import dto.Task;
import dto.User;
import entities.TaskEntity;
import entities.UserEntity;
import entities.CategoryEntity;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import jakarta.ws.rs.*;
@Path("/task")
public class TaskService {
    @Inject
    TaskBean taskBean;
    @Inject
    UserBean userBean;

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response isUserValid(@HeaderParam("token") String token) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            ArrayList<Task> taskList = new ArrayList<>();
            for (TaskEntity taskEntity : taskBean.getTasks()) {
                taskList.add(taskBean.convertToDto(taskEntity));
            }
            taskList.sort(Comparator.comparing(Task::getPriority, Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getEndDate)));
            return Response.status(200).entity(taskList).build();
        }
    }
    @GET
    @Path("/byUser")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasksByUser(@HeaderParam("token") String token) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            User user = userBean.getUser(token);
            ArrayList<Task> taskList = new ArrayList<>();
            for (TaskEntity taskEntity : taskBean.getTasksByUser(userBean.convertToEntity(user))) {
                if(taskEntity.isActive()) {
                    taskList.add(taskBean.convertToDto(taskEntity));
                }
            }
            taskList.sort(Comparator.comparing(Task::getPriority, Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getEndDate)));
            return Response.status(200).entity(taskList).build();
        }
    }@GET
    @Path("/byCategory")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasksByCategory(@HeaderParam("token") String token, @QueryParam("category") String category) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            ArrayList<Task> taskList = new ArrayList<>();
            for (TaskEntity taskEntity : taskBean.getTasksByCategory(category)) {
                taskList.add(taskBean.convertToDto(taskEntity));
            }
            taskList.sort(Comparator.comparing(Task::getPriority, Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getEndDate)));
            return Response.status(200).entity(taskList).build();
        }
    }
    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addTask(Task task, @HeaderParam("token") String token) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            boolean valid = taskBean.isTaskValid(task);
            boolean categoryExists = taskBean.categoryExists(task.getCategory().getName());
            if (!valid) {
                return Response.status(400).entity("All elements are required").build();
            }else if (!categoryExists){
                return Response.status(400).entity("Category does not exist").build();
            }
            User user = userBean.getUser(token);
            Category category = task.getCategory();
            CategoryEntity categoryEntity = taskBean.findCategoryByName(category.getName());
            TaskEntity taskEntity = taskBean.convertToEntity(task);
            taskEntity.setCategory(categoryEntity);
            taskEntity.setUser(userBean.convertToEntity(user));
            taskBean.addTask(taskEntity);
            return Response.status(201).entity(taskBean.convertToDto(taskEntity)).build();
        }
    }
    @POST
    @Path("/createCategory")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCategory(Category category, @HeaderParam("token") String token) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            boolean valid = taskBean.categoryExists(category.getName());
            if (!valid) {
                return Response.status(400).entity("All elements are required").build();
            }
            User user = userBean.getUser(token);
            category.setCreator(user.getUsername());
            CategoryEntity categoryEntity = new CategoryEntity();
            taskBean.createCategory(category);
            return Response.status(201).entity(taskBean.convertCatToDto(categoryEntity)).build();
        }
    }
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(Task task, @HeaderParam("token") String token) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            boolean valid = taskBean.isTaskValid(task);
            boolean categoryExists = taskBean.categoryExists(task.getCategory().getName());
            if (!valid) {
                return Response.status(400).entity("All elements are required").build();
            }else if (!categoryExists){
                return Response.status(400).entity("Category does not exist").build();
            }
            User user = userBean.getUser(token);
            Category category = task.getCategory();
            CategoryEntity categoryEntity = taskBean.findCategoryByName(category.getName());
            TaskEntity taskEntity = taskBean.convertToEntity(task);
            taskEntity.setCategory(categoryEntity);
            taskEntity.setUser(userBean.convertToEntity(user));
            boolean updated = taskBean.updateTask(taskEntity);
            if(!updated){
                return Response.status(400).entity("Failed. Task not updated").build();
            } else{
                return Response.status(200).entity(taskBean.convertToDto(taskEntity)).build();
            }
        }
    }
    @PATCH
    @Path("/changeStatus/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeStatus(@HeaderParam("token") String token, @PathParam("id") String id, @QueryParam("status") int status) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            boolean changed = taskBean.changeStatus(id, status);
            if (!changed) {
                return Response.status(400).entity("Failed. Status not changed").build();
            } else {
                return Response.status(200).entity("Status changed").build();
            }
        }
    }
    @DELETE
    @Path("/delete/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeTask(@HeaderParam("token") String token, @PathParam("id") String id) {
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            boolean removed = taskBean.removeTask(id);
            if (!removed) {
                return Response.status(400).entity("Failed. Task not removed").build();
            } else {
                return Response.status(200).entity("Task removed").build();
            }
        }
    }

}