package dao;

import entities.TaskEntity;
import entities.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

import java.util.ArrayList;
import java.util.List;

@Stateless
public class TaskDao extends AbstractDao<TaskEntity>{
    @PersistenceContext
    private EntityManager em;
    public TaskDao() {
        super(TaskEntity.class);
    }
    private static final long serialVersionUID = 1L;

    public TaskEntity findTaskById(int id) {
        try {
            return (TaskEntity) em.createNamedQuery("Task.findTaskById").setParameter("id", id)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }

    }

    public ArrayList<TaskEntity> findTaskByUser(UserEntity userEntity) {
        try {
            ArrayList<TaskEntity> taskEntityEntities = (ArrayList<TaskEntity>) em.createNamedQuery("Task.findTaskByUser").setParameter("user", userEntity).getResultList();
            return taskEntityEntities;
        } catch (Exception e) {
            return null;
        }
    }
    public TaskEntity createTask(TaskEntity taskEntity) {
        em.persist(taskEntity);
        return taskEntity;
    }
    public String findCreatorByName(String name){
        try {
            return (String) em.createNamedQuery("Category.findCreatorByName").setParameter("name", name)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
    public List<TaskEntity> findTasksByUser(UserEntity userEntity) {
        try {
            List<TaskEntity> taskEntityEntities = (List<TaskEntity>) em.createNamedQuery("Task.findTaskByUser").setParameter("user", userEntity).getResultList();
            return taskEntityEntities;
        } catch (Exception e) {
            return null;
        }
    }

}
