package service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import bean.UserBean;
import dto.Task;
import dto.User;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Path("/user")
public class UserService {
    @Inject
    UserBean userBean;
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getUsers() {
        return userBean.getUsers();
    }
    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addUser(User a) {
       boolean valid = userBean.isUserValid(a);
        if (!valid) {
            return Response.status(400).entity("All elements are required are required").build();
        }
        boolean user = userBean.userExists(a.getUsername());
        if (user) {

            return Response.status(409).entity("User with this username is already exists").build();
        } else {
            userBean.addUser(a);
            return Response.status(201).entity("A new user is created").build();
        }
    }

    @GET
    @Path("/tasks")
    @Produces(MediaType.APPLICATION_JSON)
       public Response isUserValid(@HeaderParam("username") String username, @HeaderParam("password") String password) {
              boolean user = userBean.userExists(username);
              boolean authorized = userBean.isUserAuthorized(username, password);
                if (!user) {
                    return Response.status(404).entity("User with this username is not found").build();
                }else if (!authorized) {
                    return Response.status(401).entity("Unauthorized").build();
                }else {
                    User user1 = userBean.getUser(username);
                    ArrayList<Task> taskList = user1.getTasks();
                    taskList.sort(Comparator.comparing(Task::getPriority,Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getEndDate)));
                    return Response.status(200).entity(taskList).build();
                }
            }

    @POST
    @Path("/addtask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addTaskToUser(@HeaderParam("username") String username,@HeaderParam("password") String password, Task task) {
        boolean user = userBean.userExists(username);
        boolean authorized = userBean.isUserAuthorized(username, password);
        if(task.getEndDate()==null){
            LocalDate undifined = LocalDate.of(2199, 12, 31);
            task.setEndDate(undifined);
        }
        if (!user) {
            System.out.println("user not found");
            return Response.status(404).entity("User with this username is not found").build();
        }else if (!authorized) {
            System.out.println("unauthorized");
            return Response.status(403).entity("Forbidden").build();
        }else {
            task.generateId();task.setinitialStatus();
            userBean.addTaskToUser(username, task);
            User user1 = userBean.getUser(username);
            return Response.status(201).entity(user1.getTaskbyId(task.getId())).build();
        }
    }

    @DELETE
    @Path("/removetask")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeTaskFromUser(@HeaderParam("username") String username, @HeaderParam("password") String password, @HeaderParam("id")String id) {
        boolean user = userBean.userExists(username);
        boolean authorized = userBean.isUserAuthorized(username, password);
        System.out.println(id);
        if (!user) {
            return Response.status(404).entity("User with this username is not found").build();
        }else if (!authorized) {
            return Response.status(403).entity("Forbidden").build();
        }
        userBean.removeTaskFromUser(username, id);
        return Response.status(200).entity("task Deleted").build();
    }
    @PUT
    @Path("/updatetask")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(@HeaderParam("username") String username, @HeaderParam("password") String password, Task a) {
        if(a.getEndDate()==null){
            LocalDate undifined = LocalDate.of(2199, 12, 31);
            a.setEndDate(undifined);
        }
        boolean authorized = userBean.isUserAuthorized(username, password);;
        boolean isvalid = userBean.isTaskValid(a);
         if (!authorized) {
            return Response.status(403).entity("Forbidden").build();
        }else if (!isvalid) {
            return Response.status(400).entity("All elements are required").build();
        }
        boolean updated = userBean.updateTask(username, a);
        if (!updated)
            return Response.status(400).entity("Failed. Task not updated").build();
        return Response.status(200).entity("updated").build();
    }

    @GET
    @Path("/photo")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPhoto(@HeaderParam("username") String username, @HeaderParam("password") String password) {
        boolean user = userBean.userExists(username);
        boolean authorized = userBean.isUserAuthorized(username, password);
        if (!user) {
            return Response.status(404).entity("User with this username is not found").build();
        }else if (!authorized) {
            return Response.status(403).entity("Forbidden").build();
        }
        User user1 = userBean.getUser(username);
        if(user1.getUserPhoto() == null){
            return Response.status(400).entity("User with no photo").build();
        }
        return Response.status(200).entity(user1.getUserPhoto()).build();
    }


    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeUser(@QueryParam("id")String id) {
        boolean deleted = userBean.removeUser(id);
        if (!deleted)
            return Response.status(404).entity("User with this idea is not found").build();
        return Response.status(200).entity("deleted").build();
    }
    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("username")String username) {
        boolean exists = userBean.userExists(username);
        if (!exists)
            return Response.status(404).entity("User with this username is not found").build();
        User user = userBean.getUser(username);
        return Response.status(200).entity(user).build();
    }
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@HeaderParam("username") String username, @HeaderParam("password") String password, User a) {
        boolean user = userBean.userExists(username);
        boolean authorized = userBean.isUserAuthorized(username, password);
        boolean valid = userBean.isUserValid(a);
        if (!user) {
            return Response.status(404).entity("User with this username is not found").build();
        }else if (!authorized) {
            return Response.status(405).entity("Forbidden").build();
        }else if (!valid) {
            return Response.status(401).entity("All elements are required").build();
        }
        boolean updated = userBean.updateUser(username, a);
        if (!updated)
            return Response.status(400).entity("Failed. User not updated").build();
        return Response.status(200).entity("updated").build();
    }

    @GET
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@HeaderParam("username") String username, @HeaderParam("password") String password){
        User user = userBean.login(username,password);
        if (user==null) {
            return Response.status(404).entity("User with this username and password is not found").build();
        }else {
            return Response.status(200).entity(user).build();

        }
    }
    @GET
    @Path("/logout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout(@HeaderParam("username") String username, @HeaderParam("password") String password){
        boolean authorized = userBean.isUserAuthorized(username, password);
        if (!authorized) {
            return Response.status(405).entity("Forbidden").build();
        }else {
            return Response.status(200).entity("Logged out").build();
        }
    }
}

