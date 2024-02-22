package entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
public class UserEntity {
    @Id
    String username;
}
