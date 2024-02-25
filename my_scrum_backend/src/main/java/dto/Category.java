package dto;

public class Category {
    private String name;

    public Category() {
    }

    public Category(String name, String creator) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
