package bean;

import entities.TaskEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import bean.TaskBean;
import bean.UserBean;
import dao.TaskDao;
import dao.UserDao;


import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class TaskBeanTest {
TaskBean taskBean;
UserBean userBean;
TaskDao taskDao;
UserDao userDao;
List<TaskEntity> taskEntitiesSet;
ArrayList<TaskEntity> taskEntityArrayList;
@BeforeEach
void setUp() {
    taskBean = new TaskBean();
    userBean = new UserBean();
    taskDao = mock(TaskDao.class);
    userDao = mock(UserDao.class);
    taskEntitiesSet = taskDao.findAll();
    taskEntityArrayList = new ArrayList<>(taskEntitiesSet);
    taskBean.setTaskDao(taskDao);
    taskBean.setUserDao(userDao);
}

    @Test
    void convertToEntity() {
    }

    @Test
    void convertToDto() {
    }

    @Test
    void findTaskById() {

    }

    @Test
    void findUserById() {
    }
}