package dto;

public class TaskCreator {
    String username;
    public TaskCreator() {
    }
    public TaskCreator(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
