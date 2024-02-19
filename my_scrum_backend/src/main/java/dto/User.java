package dto;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;

@XmlRootElement
public class User {
    String id;
    String username;

    String name;

    String email;

    String password;
    String contactNumber;
    ArrayList<Task> tasks = new ArrayList<Task>();
    String userPhoto;

    public User() {
    }

    public User(String id, String username, String name, String email, String password, String contactNumber, String userPhoto) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.contactNumber = contactNumber;
        this.userPhoto = userPhoto;
    }

    @XmlElement
    public String getId() {
        return id;
    }

    public void setId() {
        this.id = "user".concat(String.valueOf(Double.parseDouble(Math.floor(Math.random() * 1000) + "")));
    }

    @XmlElement
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @XmlElement
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @XmlElement
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @XmlElement
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @XmlElement
    public String getContactNumber() {
        return contactNumber;
    }
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    public void setUserPhoto(String userPhoto){
        this.userPhoto = userPhoto;
    }
    @XmlElement
    public String getUserPhoto(){
        return userPhoto;
    }
    @XmlElement
    public ArrayList<Task> getTasks() {
        return tasks;
    }
    public void setTasks(ArrayList<Task> tasks) {
        this.tasks = tasks;
    }
    public void addTask(Task task) {
        tasks.add(task);
    }
    public void removeTask(Task task) {
        tasks.remove(task);
    }
    public void removeTask(String id) {
        Iterator<Task> iterator = tasks.iterator();
        while (iterator.hasNext()) {
            Task task = iterator.next();
            if (task.getId().equals(id)) {
                iterator.remove();
            }
        }
    }
    public Task getTask(String id) {
        for (Task a : tasks) {
            if (a.getId().equals(id))
                return a;
        }
        return null;
    }
    public void updateTask(Task task) {
        for (Task a : tasks) {
            if (a.getId().equals(task.getId())) {
                a.setTitle(task.getTitle());
                a.setDescription(task.getDescription());
                a.setStatus(task.getStatus());
                a.setPriority(task.getPriority());
                a.setEndDate(task.getEndDate());
                a.setStartDate(task.getStartDate());
            }
        }
    }
    public ArrayList<Task> orderedtasks() {
        ArrayList<Task> status10 = new ArrayList<Task>();
        ArrayList<Task> status20 = new ArrayList<Task>();
        ArrayList<Task> status30 = new ArrayList<Task>();
        for (Task a : tasks) {
            if (a.getStatus() == 10) {
                status10.add(a);
            } else if (a.getStatus() == 20) {
                status20.add(a);
            } else if (a.getStatus() == 30) {
                status30.add(a);
            }
        }
        status10.sort(Comparator.comparing(Task::getPriority,Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getEndDate)));
        status20.sort(Comparator.comparing(Task::getPriority,Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getEndDate)));
        status30.sort(Comparator.comparing(Task::getPriority,Comparator.reverseOrder()).thenComparing(Comparator.comparing(Task::getStartDate).thenComparing(Task::getEndDate)));
        ArrayList<Task> orderedTasks = new ArrayList<Task>();
        orderedTasks.addAll(status10);
        orderedTasks.addAll(status20);
        orderedTasks.addAll(status30);
        return orderedTasks;
    }
    public Task getTaskbyId(String id) {
        for (Task a : tasks) {
            if (a.getId().equals(id)) {
                return a;
            }
        }
        return null;
    }
}
