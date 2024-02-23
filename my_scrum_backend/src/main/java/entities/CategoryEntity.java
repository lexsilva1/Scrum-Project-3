package entities;

import jakarta.persistence.*;

@Entity
@Table(name="Categories")
@NamedQuery(name="Category.findCategoryByName", query="SELECT a FROM CategoryEntity a WHERE a.name = :name")
@NamedQuery(name="Category.findCategoryByCreator", query="SELECT a FROM CategoryEntity a WHERE a.creator = :creator")
@NamedQuery(name="Category.findCreatorByName", query="SELECT a FROM CategoryEntity a WHERE a.name = :name")
public class CategoryEntity {
    @Id
    @Column(name="name", nullable = false, unique = true)
    private String name;
    @Column(name="creator", nullable = false, unique = false)
    private String creator;




    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }
}
