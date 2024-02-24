package service;

import bean.TaskBean;
import bean.UserBean;
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
            if (!valid) {
                return Response.status(400).entity("All elements are required").build();
            }
            User user = userBean.getUser(token);
            TaskEntity taskEntity = taskBean.convertToEntity(task);
            taskEntity.setCategory(taskBean.convertCatToEntity(task.getCategory()));
            taskEntity.setUser(userBean.convertToEntity(user));
            taskBean.addTask(taskEntity);
            return Response.status(201).entity(taskBean.convertToDto(taskEntity)).build();
        }
    }
    @POST
    @Path("/createCategory")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCategory(String name, @HeaderParam("token") String token) {
        System.out.println(token);
        boolean authorized = userBean.isUserAuthorized(token);
        if (!authorized) {
            return Response.status(401).entity("Unauthorized").build();
        } else {
            boolean valid = taskBean.categoryExists(name);
            if (!valid) {
                return Response.status(400).entity("All elements are required").build();
            }
            CategoryEntity categoryEntity = new CategoryEntity();
            taskBean.createCategory(name,token);
            return Response.status(201).entity(taskBean.convertCatToDto(categoryEntity)).build();
        }
    }

}
