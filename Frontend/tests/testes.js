function createTask(name, description, category, priority, startdate, enddate) {
    // Cria uma tarefa com o nome, a descrição e a priority passados como argumentos
    let task = {
        title: name,
        description: description,
        category: category,
        priority: priority,
        startDate: startdate,
        endDate: enddate,
    };

    return task;
    }
module.exports = { createTask };