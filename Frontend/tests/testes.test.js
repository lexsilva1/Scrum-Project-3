const  { createTask} = require ("./testes");


test("Create a task", () => {
    const task = createTask("Estudar", "Estudar React", "Estudo", 100, "2021-09-01", "2021-09-30");
    expect(task).toEqual({
        title: "Estudar",
        description: "Estudar React",
        category: "Estudo",
        priority: 100,
        startDate: "2021-09-01",
        endDate: "2021-09-30",
    });
});

test("Create a task with empty title", () => {
    const task = createTask("", "Estudar React", "Estudo", 100, "2021-09-01", "2021-09-30");
    expect(task).toEqual({
        title: "",
        description: "Estudar React",
        category: "Estudo",
        priority: 100,
        startDate: "2021-09-01",
        endDate: "2021-09-30",
    });
});

test("Create a task with negative priority", () => {
    const task = createTask("Estudar", "Estudar React", "Estudo", -100, "2021-09-01", "2021-09-30");
    expect(task).toEqual({
        title: "Estudar",
        description: "Estudar React",
        category: "Estudo",
        priority: -100,
        startDate: "2021-09-01",
        endDate: "2021-09-30",
    });
});

test("Create a task with invalid start date", () => {
    const task = createTask("Estudar", "Estudar React", "Estudo", 100, "2021-09-31", "2021-09-30");
    expect(task).toEqual({
        title: "Estudar",
        description: "Estudar React",
        category: "Estudo",
        priority: 100,
        startDate: "2021-09-31",
        endDate: "2021-09-30",
    });
});





