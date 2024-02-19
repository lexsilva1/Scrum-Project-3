package com.scrum;

public class Main {
    public static void main(String[] args) {

        String generatorType = args.length != 0 ? args[0] : null;

        if (generatorType == null) {
            System.out.println("Please choose a generator type");
        } else if (generatorType.equals("add_users")) {

            try {
                boolean usersNumberString = args.length > 1;
                if (!usersNumberString) {
                    System.out.println("Please provide the number of users you want to add");
                    return;
                } else if (args.length > 2) {
                    System.out.println("Too many arguments were given");
                    return;
                }
                int usersNumber = Integer.parseInt(args[1]);

                UserCreator userCreator = new UserCreator(usersNumber);
                userCreator.create();

            } catch (NumberFormatException e) {
                System.out.println("Invalid number of users");
            }
        } else if (generatorType.equals("add_tasks")) {
            System.out.println("Adding tasks");
            try {
                boolean isNumberOfArgsTasksProvided = args.length == 3;
                if (!isNumberOfArgsTasksProvided) {
                    System.out.println(args[1]+" "+args[2]+" "+args[3]);
                    System.out.println("Please provide the username, password and number of tasks to be added");
                }
                String username = args[1];
                String password = args[2];
                int numberOfTasks = Integer.parseInt(args[3]);

                TaskCreator taskPopulator = new TaskCreator(username, password, numberOfTasks);
                taskPopulator.create();
                System.out.println("Tasks added successfully");
            } catch (NumberFormatException e) {
                System.out.println("Invalid number of tasks");
            }
        } else {
            System.out.println("Invalid generator type");
        }

    }
}