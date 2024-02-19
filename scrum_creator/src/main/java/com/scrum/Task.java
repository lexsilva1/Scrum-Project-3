package com.scrum;


import java.time.LocalDate;



public class Task {
    String id;
    String title;
    String description;
    int status;
    int priority;
    LocalDate startDate;
    LocalDate endDate;

    private static final int low = 100;
    private static final int medium = 200;
    private static final int high = 300;
    private static  final int todo = 10;
    private static final int doing = 20;
    private static final int done = 30;


    public Task( String title, String description, LocalDate startDate, LocalDate endDate, int priority) {
        this.priority = priority;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    @Override
    public String toString() {
        return "{" +
                "\"title\":\"" + title + "\"" +
                ", \"description\":\"" + description + "\"" +
                ", \"priority\":" + priority  +
                ", \"startDate\":\"" + startDate + "\"" +
                ", \"endDate\":\"" + endDate + "\"" +
                "}";
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }

    public int getPriority() {
        return priority;
    }
    public void setPriority(int priority) {
        this.priority = priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {this.startDate = startDate;}

    public LocalDate getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    public void generateId() {
        this.id = "task" + Math.random() * 1000;
    }
     public void setinitialStatus() {
          this.status = todo;
     }



}
