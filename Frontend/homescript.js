window.onload = async function () {
  const user = await getUserDTO();
  sessionStorage.setItem("role", user.role);
  loadTasks();
  updateDate();
  showTime();
  const editButton = document.getElementById("editCategoriesButton");
  const names = user.name.split(" ");
  document.getElementById("profileImageHome").src = user.userPhoto;
  document.getElementById("login-home").innerHTML = names[0];
  fillUserFilter();
  fillCategoryFilter();
  if (user.role === "developer") {
    document.getElementById("filter-container").style.display = "none";
    document.getElementById("viewUsersButton").style.display = "none";
  }
  if (user.role !== "Owner") {
    document.getElementById("editCategoriesButton").style.display = "none";
  }
};

//checkbox para mostrar tarefas apagadas
const deletebox = document.getElementById("deleted");
deletebox.addEventListener("change", () => {
  if (deletebox.checked === true) {
    clearTaskPanels();
    loadDeletedTasks();
  } else {
    clearTaskPanels();
    loadTasks();
  }
});

if (
  sessionStorage.getItem("token") === null ||
  sessionStorage.getItem("token") === ""
) {
  window.location.href = "index.html";
}

let tasks = document.querySelectorAll(".task");
const panels = document.querySelectorAll(".panel");

function attachDragAndDropListeners(task) {
  // Adiciona os listeners de drag and drop a uma tarefa criada dinamicamente
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
    updateStatus(task);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  fillTaskCategory();
});

async function fillUserFilter() {
  const users = await getUsers();
  const userFilter = document.getElementById("userFilter");

  // Limpa a combobox antes de adicionar novas opções
  userFilter.innerHTML = "";

  // Adiciona uma opção vazia no início
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "";
  userFilter.appendChild(defaultOption);

  // Adiciona uma opção para cada usuário
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.username;
    option.text = user.name;
    userFilter.appendChild(option);
  });
}

async function fillCategoryFilter() {
  const categories = await getCategories();
  const categoryFilter = document.getElementById("categoryFilter");

  // Limpa a combobox antes de adicionar novas opções
  categoryFilter.innerHTML = "";

  // Adiciona uma opção vazia no início
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "";
  categoryFilter.appendChild(defaultOption);

  // Adiciona uma opção para cada categoria
  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category.name;

    option.text = category.name;
    categoryFilter.appendChild(option);
  });
}
async function fillTaskCategory() {
  try {
    // Agora estamos usando await para esperar a promessa ser resolvida
    var categories = await getCategories();
    var select = document.getElementById("taskCategory");

    // Limpa opções existentes
    select.innerHTML = "";

    // Cria uma nova opção para cada categoria e adiciona à combobox
    for (var i = 0; i < categories.length; i++) {
      var option = document.createElement("option");
      option.value = categories[i].name;
      option.text = categories[i].name;
      select.appendChild(option);
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle fetch errors
    alert("Error fetching categories. Please try again.");
  }
}



// Adiciona os listeners de drag and drop a um painel
panels.forEach((panel) => {
  panel.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(panel, e.clientY);
    const task = document.querySelector(".dragging");
    const panelID = document.getElementById(panel.id); // Guarda o ID do painel onde a tarefa vai ser colocada
    if (afterElement == null) {
      panel.appendChild(task);
      task.status = panel.id;
      for (var i = 0; i < tasks.length; i++) {
        // Percorre o array de tarefas e altera o status da tarefa para o painel onde foi colocada
        if (tasks[i].id == task.id) {
          tasks[i].status = panelID; // Atualiza o status da tarefa
        }
      }
    } else {
      panel.insertBefore(task, afterElement);
      task.status = panel.id;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == task.id) {
          tasks[i].status = panelID;
        }
      }
    }
  });
});





// Definir os botões de priority
const lowButton = document.getElementById("low-button-home");
const mediumButton = document.getElementById("medium-button-home");
const highButton = document.getElementById("high-button-home");
let taskPriority;

function setPriorityButtonSelected(button, priority) {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
  taskPriority = priority;
}
function removeSelectedPriorityButton() {
  const buttons = [lowButton, mediumButton, highButton];
  buttons.forEach((btn) => btn.classList.remove("selected"));
}

// Event listeners para os botões priority
lowButton.addEventListener("click", () =>
  setPriorityButtonSelected(lowButton, 100)
);
mediumButton.addEventListener("click", () =>
  setPriorityButtonSelected(mediumButton, 200)
);
highButton.addEventListener("click", () =>
  setPriorityButtonSelected(highButton, 300)
);

function getDragAfterElement(panel, y) {
  const draggableElements = [...panel.querySelectorAll(".task:not(.dragging)")]; // Dentro da lista de painéis, seleciona todos os elementos com a classe task que nao tenham a classe dragging
  return draggableElements.reduce(
    (closest, child) => {
      // Retorna o elemento mais próximo do que esáa a ser arrastado e que está a ser comparado
      const box = child.getBoundingClientRect(); // Retorna o tamanho do elemento e a sua posição relativamente ao viewport
      const offset = y - box.top - box.height / 2; // Calcula a distância entre o elemento que está a ser arrastado e o que está a ser comparado
      if (offset < 0 && offset > closest.offset) {
        // Se a distância for menor que 0 e maior que a distância do elemento mais próximo até agora
        return { offset: offset, element: child };
      } else {
        //
        return closest; // Retorna o elemento mais próximo até agora
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Event listener do botão add task para criar uma nova task e colocá-la no painel To Do (default para qualquer task criada)
document.getElementById("addTask").addEventListener("click", function () {
  var Description = taskDescription.value.trim();
  var Name = taskName.value.trim();
  var category = document.getElementById("taskCategory").value;
  var priority = taskPriority;
  var startdate = document.getElementById("startdate").value;
  var enddate = document.getElementById("enddate").value;
  if (
    Name === "" ||
    Description === "" ||
    category === "" ||
    priority === null ||
    startdate === ""
  ) {
    document.getElementById("warningMessage2").innerText =
      "Fill in all fields and define a priority and a category";
  } else if (enddate !== "") {
    if (startdate > enddate) {
      document.getElementById("warningMessage2").innerText =
        "Start date must be before end date";
    }
  } else {
    document.getElementById("warningMessage2").innerText = "";
  }
  if (
    Name.trim() !== "" &&
    Description.trim() !== "" &&
    category !== null &&
    priority !== null &&
    startdate !== ""
  ) {
    if (enddate === "") {
      enddate = "2199-12-31";
    }
    const task = createTask(
      Name,
      Description,
      category,
      priority,
      startdate,
      enddate
    );
    postTask(task);
    clearTaskPanels();
    loadTasks();
    // Limpar os input fields depois de adicionar a task
    document.getElementById("taskName").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskCategory").value = "";
    document.getElementById("startdate").value = "";
    document.getElementById("enddate").value = "";
    removeSelectedPriorityButton();
    taskPriority = null;
  }
});

function createTask(name, description, category, priority, startdate, enddate) {
  // Cria uma tarefa com o nome, a descrição e a priority passados como argumentos
  const task = {
    title: name,
    description: description,
    category: category,
    priority: priority,
    startDate: startdate,
    endDate: enddate,
  };
  return task;
}
async function postTask(task) {
  await fetch("http://localhost:8080/Scrum-Project-3/rest/task/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
    body: JSON.stringify(task),
  }).then(async function (response) {
    if (response.status === 201) {
      const taskData = await response.json();
      task = {
        id: taskData.id,
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority: taskData.priority,
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        status: taskData.status,
        active: taskData.active,
      };
      const taskElement = createTaskElement(task);
      if (task.status === 10) {
        document.getElementById("todo").appendChild(taskElement);
      } else if (task.status === 20) {
        document.getElementById("doing").appendChild(taskElement);
      } else if (task.status === 30) {
        document.getElementById("done").appendChild(taskElement);
      }
      attachDragAndDropListeners(taskElement);
    } else if (response.status === 404) {
      alert("User not found");
    }
  });
}

function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.category = task.category;
  taskElement.id = task.id;
  taskElement.priority = task.priority;
  taskElement.classList.add("task");
  if (task.priority === 100) {
    taskElement.classList.add("low");
  } else if (task.priority === 200) {
    taskElement.classList.add("medium");
  } else if (task.priority === 300) {
    taskElement.classList.add("high");
  }
  taskElement.draggable = true;
  taskElement.description = task.description;
  taskElement.title = task.title;
  if (task.status === 10) {
    taskElement.status = "todo";
  } else if (task.status === 20) {
    taskElement.status = "doing";
  } else if (task.status === 30) {
    taskElement.status = "done";
  }
  taskElement.startdate = task.startDate;
  taskElement.enddate = task.endDate;

  const postIt = document.createElement("div");
  postIt.className = "post-it";

  const taskTitle = document.createElement("h3");
  taskTitle.textContent = task.title;
  const descriprioncontainer = document.createElement("div");
  descriprioncontainer.className = "post-it-text";
  const displayDescription = document.createElement("p");
  displayDescription.textContent = task.description;

  const deleteButton = document.createElement("img");
  deleteButton.src = "multimedia/dark-cross-01.png";
  deleteButton.className = "apagarButton";
  deleteButton.id = "delete-button99";
  deleteButton.addEventListener("click", function () {
    const deletemodal = document.getElementById("delete-modal");
    deletemodal.style.display = "grid";
    const deletebtn = document.getElementById("delete-button");

    async function deleteButtonClickHandler() {
      await deleteTask(taskElement.id);
      if(taskElement.classList.contains('taskdeleted')){
      taskElement.remove();
      deletebtn.removeEventListener("click", deleteButtonClickHandler);
      clearTaskPanels();
      await loadDeletedTasks();
      deletemodal.style.display = "none";
    }else{
      taskElement.remove();
      deletebtn.removeEventListener("click", deleteButtonClickHandler);
      clearTaskPanels();
      await loadTasks();
      deletemodal.style.display = "none";
    }
  }

    deletebtn.addEventListener("click", deleteButtonClickHandler);
    const cancelbtn = document.getElementById("cancel-delete-button");
    cancelbtn.addEventListener("click", () => {
      deletemodal.style.display = "none";
    });
  });

  descriprioncontainer.appendChild(displayDescription);
  postIt.appendChild(taskTitle);
  if (
    sessionStorage.getItem("role") !== null &&
    sessionStorage.getItem("role") !== "developer"
  ) {
    console.log(sessionStorage.getItem("role"));
    postIt.appendChild(deleteButton);
  }
  taskElement.appendChild(postIt);
  postIt.appendChild(descriprioncontainer);

  taskElement.addEventListener("dblclick", function () {
    if (task.active === true) {
      sessionStorage.setItem("taskDescription", taskElement.description);
      sessionStorage.setItem("taskTitle", taskElement.title);
      sessionStorage.setItem("taskid", taskElement.id);
      sessionStorage.setItem("taskStatus", taskElement.status);
      sessionStorage.setItem("taskPriority", taskElement.priority);
      sessionStorage.setItem("taskStartDate", task.startDate);
      sessionStorage.setItem("taskEndDate", task.endDate);
      sessionStorage.setItem("taskCategory", task.category);
      window.location.href = "task.html";
    }
  });

  return taskElement;
}

async function loadTasks() {
  await fetch("http://localhost:8080/Scrum-Project-3/rest/task/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  }).then(async function (response) {
    if (response.status === 200) {
      clearTaskPanels();
      const taskArray = await response.json();

      if (taskArray.length > 0) {
        taskArray.forEach((task) => {
          if (task.active === true) {
            console.log(task);
            const taskElement = createTaskElement(task);
            if (task.status === 10) {
              document.getElementById("todo").appendChild(taskElement);
            } else if (task.status === 20) {
              document.getElementById("doing").appendChild(taskElement);
            } else if (task.status === 30) {
              document.getElementById("done").appendChild(taskElement);
            }
            attachDragAndDropListeners(taskElement);
          }
        });
      }
    } else if (response.status === 404) {
      alert("User not found");
    } else if (response.status === 401) {
      alert("Unauthorized");
    }
  });
}
async function loadDeletedTasks() {
  await fetch("http://localhost:8080/Scrum-Project-3/rest/task/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  }).then(async function (response) {
    if (response.status === 200) {
      const taskArray = await response.json();

      await fetch("http://localhost:8080/Scrum-Project-3/rest/task/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }).then(async function (response) {
        if (response.status === 200) {
          clearTaskPanels();
          const taskArray = await response.json();

          if (taskArray.length > 0) {
            taskArray.forEach((task) => {
              if (task.active === false) {
                const taskElement = createTaskElement(task);
                if (task.status === 10) {
                  document.getElementById("todo").appendChild(taskElement);
                } else if (task.status === 20) {
                  document.getElementById("doing").appendChild(taskElement);
                } else if (task.status === 30) {
                  document.getElementById("done").appendChild(taskElement);
                }
                taskElement.style.opacity = 0.5;
                const resutaurar = document.createElement("img");
                resutaurar.src = "multimedia/restore.png";
                resutaurar.className = "restoreButton";
                taskElement.classList.add("taskdeleted");
                taskElement.appendChild(resutaurar);
                if(sessionStorage.getItem('role') !== null && sessionStorage.getItem('role') === 'ScrumMaster'){
                  document.getElementById('delete-button99').remove();
                }
                resutaurar.addEventListener("click", async function () {
                  restoreTask(taskElement.id);
                  taskElement.classList.remove("taskdeleted");
                  taskElement.remove();
                  await loadDeletedTasks();
                });
              }
            });
          } else if (response.status === 404) {
            alert("User not found");
          } else if (response.status === 401) {
            alert("Unauthorized");
          }
        }
      });
    }
  });
}

async function restoreTask(id) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/restore/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.ok) {
      alert("Task restored");
    } else if (response.status === 404) {
      alert("Task not found");
    } else if (response.status === 401) {
      alert("Unauthorized");
    } else {
      // Handle other response status codes
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error restoring task:", error);
    // Handle fetch errors
    alert("Error restoring task. Please try again.");
  }
}
async function deleteTask(id) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/block/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.ok) {
      alert("Task deleted");
      clearTaskPanels();
    } else if (response.status === 404) {
      alert("Task not found");
    } else if (response.status === 401) {
      alert("Unauthorized");
    } else {
      // Handle other response status codes
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    // Handle fetch errors
    alert("Error deleting task. Please try again.");
  }
}
async function updateStatus(taskElement) {
  let taskElementstatus;
  if (taskElement.status === "todo") {
    taskElementstatus = 10;
  } else if (taskElement.status === "doing") {
    taskElementstatus = 20;
  } else if (taskElement.status === "done") {
    taskElementstatus = 30;
  }
  let taskStatus = {
    id: taskElement.id,
    status: taskElementstatus,
  };
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/changeStatus/${taskStatus.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(taskStatus),
      }
    );

    if (response.ok) {
      console.log("Task updated");
    } else if (response.status === 404) {
      console.log("Task not found");
    } else if (response.status === 401) {
      console.log("Unauthorized");
    } else {
      // Handle other response status codes
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error updating task:", error);
    // Handle fetch errors
    alert("Error updating task. Please try again.");
  }
}
async function updateTask(taskElement) {
  let taskElementstatus;
  if (taskElement.status === "todo") {
    taskElementstatus = 10;
  } else if (taskElement.status === "doing") {
    taskElementstatus = 20;
  } else if (taskElement.status === "done") {
    taskElementstatus = 30;
  }
  let task = {
    id: taskElement.id,
    title: taskElement.title,
    description: taskElement.description,
    priority: taskElement.priority,
    startDate: taskElement.startdate,
    endDate: taskElement.enddate,
    status: taskElementstatus,
  };

  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/changeStatus/${task.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(task),
      }
    );

    if (response.ok) {
      console.log("Task updated");
      clearTaskPanels();
      loadTasks();
    } else if (response.status === 404) {
      console.log("Task not found");
    } else if (response.status === 401) {
      console.log("Unauthorized");
    } else {
      // Handle other response status codes
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error updating task:", error);
    // Handle fetch errors
    alert("Error updating task. Please try again.");
  }
}
// Elemento html onde vai ser mostrada a hora
const displayTime = document.querySelector(".display-time");
function showTime() {
  let time = new Date();
  let timeString = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  displayTime.innerText = timeString;
  setTimeout(showTime, 1000);
}
// Data
function updateDate() {
  // Mostra a data atual
  let today = new Date();
  let dayName = today.getDay(), // 0 - 6
    dayNum = today.getDate(), // 1 - 31
    month = today.getMonth(), // 0 - 11
    year = today.getFullYear(); // 2020

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Valor -> ID do elemento html
  const IDCollection = ["day", "daynum", "month", "year"]; // Array com os IDs dos elementos html que vão mostrar a data
  // Retornar um array com números como índices
  const val = [dayWeek[dayName], dayNum, months[month], year]; // Array com os valores que vão ser mostrados nos elementos html
  for (let i = 0; i < IDCollection.length; i++) {
    // Percorre o array de IDs
    document.getElementById(IDCollection[i]).firstChild.nodeValue = val[i]; // Altera o valor do elemento html com o ID correspondente
  }
}

document.getElementById("login-home").addEventListener("click", () => {
  window.location.href = "profileEdition.html";
});

document.getElementById("logout").addEventListener("click", () => {
  logout();
});

window.onclose = function () {
  sessionStorage.clear();
  localStorage.clear();
};

async function logout() {
  await fetch("http://localhost:8080/Scrum-Project-3/rest/user/logout", {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: sessionStorage.getItem("token"),
    },
  }).then(function (response) {
    if (response.status === 200) {
      // User is logged in successfully
      alert("User is logged out successfully :)");
      const tasks = document.querySelectorAll(".task");
      if (tasks.length > 0) {
        tasks.forEach((task) => {
          updateTask(task);
        });
      }
      sessionStorage.clear();
      window.location.href = "index.html";
    } else if (response.status === 405) {
      sessionStorage.clear();
      window.location.href = "index.html";
      // User not found
      alert("Unauthorized User");
    } else {
      // Something went wrong
      alert("Something went wrong :(");
      sessionStorage.clear();
      window.location.href = "index.html";
    }
  });
  sessionStorage.clear();
  window.location.href = "index.html";
}

async function getCategories() {
  try {
    const response = await fetch(
      "http://localhost:8080/Scrum-Project-3/rest/task/allCategories",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      const categoriesArray = await response.json();
      console.log(categoriesArray);
      if (categoriesArray.length === 0) {
        alert("Categories not found");
      } else {
        const Array = [];
        for (var i = 0; i < categoriesArray.length; i++) {
          Array.push(categoriesArray[i]);
        }
        return Array;
      }
    } else if (response.status === 404) {
      alert("Categories not found");
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    throw error;
  }
}

async function getUsers() {
  try {
    const response = await fetch(
      "http://localhost:8080/Scrum-Project-3/rest/user/all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      const usersArray = await response.json();
      if (usersArray.length === 0) {
        alert("Users not found");
      } else {
        const Array = [];
        for (var i = 0; i < usersArray.length; i++) {
          Array.push(usersArray[i]);
        }
        return Array;
      }
    } else if (response.status === 404) {
      alert("Users not found");
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    throw error;
  }
}

async function getUserDTO() {
  try {
    const response = await fetch(
      "http://localhost:8080/Scrum-Project-3/rest/user/myUserDto",
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const obj = await response.json();
    return obj;
  } catch (error) {
    console.error("Something went wrong:", error);
    // Re-throw the error or return a rejected promise
    throw error;
  }
}

function clearTaskPanels() {
  let panels = ["todo", "doing", "done"];
  for (let panel of panels) {
    let tasks = document.querySelectorAll(`#${panel} .task`);
    for (let task of tasks) {
      task.remove();
    }
  }
}

document
  .getElementById("userFilter")
  .addEventListener("change", async function () {
    const selectedUser = this.value;
    if (selectedUser === "") {
      clearTaskPanels();
      loadTasks();
    } else {
      const tasks = await getTasksByUser(selectedUser);

      // Limpa as colunas antes de adicionar novas tasks
      clearTaskPanels();

      // Adiciona uma task para cada task
      tasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        if (task.status === 10) {
          document.getElementById("todo").appendChild(taskElement);
        } else if (task.status === 20) {
          document.getElementById("doing").appendChild(taskElement);
        } else if (task.status === 30) {
          document.getElementById("done").appendChild(taskElement);
        }
        attachDragAndDropListeners(taskElement);
      });
    }
  });

async function getTasksByUser(username) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/byUser/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const obj = await response.json();
    return obj;
  } catch (error) {
    console.error("Something went wrong:", error);
    // Re-throw the error or return a rejected promise
    throw error;
  }
}

document
  .getElementById("categoryFilter")
  .addEventListener("change", async function () {
    console.log(this.value);
    const selectedCategory = this.value;
    if (selectedCategory === "") {
      clearModalCategories();
      loadTasks();
    } else {
      const tasks = await getTasksByCategory(selectedCategory);

      // Limpa as colunas antes de adicionar novas tasks
      clearTaskPanels();

      // Adiciona uma task para cada task
      tasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        if (task.status === 10) {
          document.getElementById("todo").appendChild(taskElement);
        } else if (task.status === 20) {
          document.getElementById("doing").appendChild(taskElement);
        } else if (task.status === 30) {
          document.getElementById("done").appendChild(taskElement);
        }
        attachDragAndDropListeners(taskElement);
      });
    }
  });

async function getTasksByCategory(category) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/byCategory/${category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const obj = await response.json();
    return obj;
  } catch (error) {
    console.error("Something went wrong:", error);
    // Re-throw the error or return a rejected promise
    throw error;
  }
}

// modal das categorias

function createCategoryModal() {
  var modalCategories = document.createElement("modal");
  var modalContent = document.createElement("div");
  var modalTitle = document.createElement("h2");
  var closeModalSpanCategories = document.createElement("span");
  modalCategories.appendChild(modalContent);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(closeModalSpanCategories);

  modalCategories.id = "editCategoriesModal";
  modalCategories.className = "modal";
  modalCategories.style.display = "none";
  modalContent.className = "modal-content";
  modalTitle.textContent = "Categories";
  closeModalSpanCategories.id = "closeModalSpan";
  closeModalSpanCategories.textContent = "X";
  closeModalSpanCategories.style.position = "absolute";
  closeModalSpanCategories.style.top = "0";
  closeModalSpanCategories.style.right = "0";
  closeModalSpanCategories.style.cursor = "pointer";

  // Criar o botão para adicionar uma categoria
  const addCategoryButton = document.createElement("button");
  addCategoryButton.id = "addCategoryButton";
  addCategoryButton.textContent = "Add Category";

  addCategoryButton.addEventListener("click", function () {
    createAddCategoryModal();
  });
  modalContent.appendChild(addCategoryButton);
  modalCategories.style.display = "block";
  document.body.appendChild(modalCategories);
  displayCategoriesInModal();
closeModalSpanCategories.addEventListener("click", function () {
  fillCategoryFilter();
  fillTaskCategory();
  modalCategories.remove();
});

}

const editButton = document.getElementById("editCategoriesButton");
editButton.addEventListener("click", function () {
  createCategoryModal();
});

function createAddCategoryModal() {
  const addCategoryModal = document.createElement("div");
  const addCategoryModalContent = document.createElement("div");
  const addCategoryModalTitle = document.createElement("h2");
  const addCategoryCloseModalSpan = document.createElement("span");
  const addCategorySaveButton = document.createElement("button");
  const addCategoryNameInput = document.createElement("input");

  addCategoryModal.id = "addCategoryModal";
  addCategoryModal.className = "modal";
  addCategoryModal.style.display = "none";
  addCategoryModalContent.className = "modal-content";
  addCategoryModalTitle.textContent = "Add Category";
  addCategoryCloseModalSpan.textContent = "X";
  addCategoryCloseModalSpan.style.position = "absolute";
  addCategoryCloseModalSpan.style.top = "0";
  addCategoryCloseModalSpan.style.right = "0";
  addCategoryCloseModalSpan.style.cursor = "pointer";
  addCategorySaveButton.textContent = "Save";
  addCategoryNameInput.placeholder = "Category name";
  addCategoryNameInput.className = "add-category-input";
  // Adicionar os elementos ao modal de adicionar categoria
  addCategoryModalContent.appendChild(addCategoryModalTitle);
  addCategoryModalContent.appendChild(addCategoryCloseModalSpan);
  addCategoryModalContent.appendChild(addCategoryNameInput);
  addCategoryModalContent.appendChild(addCategorySaveButton);
  addCategoryModal.appendChild(addCategoryModalContent);
  document.body.appendChild(addCategoryModal);
  addCategoryModal.style.zIndex = "1000";
  addCategoryModal.style.display = "block";

  addCategorySaveButton.addEventListener("click", function () {
    addCategoryModal.style.display = "block";
  });

  addCategoryCloseModalSpan.addEventListener("click", function () {
    addCategoryModal.style.display = "none";
  });
  // Event listener quando se clica no botão de salvar no modal de adicionar categoria
  addCategorySaveButton.addEventListener("click", async function () {
    const categoryName = addCategoryNameInput.value;
    await addCategory(categoryName);
    await displayCategoriesInModal();
    addCategoryModal.style.display = "none";
    
  });
}

async function displayCategoriesInModal() {
  const categories = await getCategories();
  const modalContent = document.querySelector(
    "#editCategoriesModal .modal-content"
  );
  let tableContainer = document.querySelector(".table-container");
  

  if (!tableContainer) {
    tableContainer = document.createElement("div");
    tableContainer.className = "table-container";
    modalContent.appendChild(tableContainer);
  } else {
    tableContainer.innerHTML = "";
  }

  const table = document.createElement("table");

  for (let i = 0; i < categories.length; i++) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const nameLabel = document.createElement("label");
    nameLabel.textContent = categories[i].name;
    nameLabel.className = "categoryNameLabel";
    nameLabel.style.fontWeight = "bold";
    nameLabel.style.color = "black";
    nameCell.appendChild(nameLabel);

    row.appendChild(nameCell);

    const buttonsCell = document.createElement("td");
    buttonsCell.style.textAlign = "right";

    const editButton = document.createElement("button");
    editButton.innerHTML = "&#9998;";
    editButton.style.marginRight = "10px";
    editButton.style.cursor = "pointer";
    editButton.style.color = "black";
    editButton.addEventListener("click", function () {
      // Create the edit category modal and its elements
      var editCategoryModal = document.createElement("div");
      var editCategoryContent = document.createElement("div");
      var editCategoryTitle = document.createElement("h2");
      var categoryLabel = document.createElement("label");
      var categoryInput = document.createElement("input");
      var saveButton = document.createElement("button");
      var cancelButton = document.createElement("button");

      editCategoryModal.id = "editCategoryModal";
      editCategoryModal.className = "modal";
      editCategoryModal.style.display = "block";

      editCategoryContent.className = "modal-content";

      editCategoryTitle.textContent = "Edit Category";
      categoryLabel.textContent = categories[i].name;
      categoryInput.type = "text";
      categoryInput.id = categories[i].id;
      categoryInput.placeholder = "New category name";

      saveButton.textContent = "Save";
      cancelButton.textContent = "Cancel";

      // Add click events to the buttons
      saveButton.addEventListener("click",async function () {
        category ={
          id: categoryInput.id,
          name: categoryInput.value
        }
        await updateCategory(category);
        clearModalCategories();
        await displayCategoriesInModal();
        editCategoryModal.style.display = "none";
      });
      cancelButton.addEventListener("click", function () {
        editCategoryModal.style.display = "none";
      });

      // Add the elements to the content
      editCategoryContent.appendChild(editCategoryTitle);
      editCategoryContent.appendChild(categoryLabel);
      editCategoryContent.appendChild(categoryInput);
      editCategoryContent.appendChild(saveButton);
      editCategoryContent.appendChild(cancelButton);

      editCategoryModal.appendChild(editCategoryContent);
      document.body.appendChild(editCategoryModal);
    });
    buttonsCell.appendChild(editButton);
    createdeleteCategoryButton(buttonsCell, i, categories);
    row.appendChild(buttonsCell);
    table.appendChild(row);
  }
  tableContainer.appendChild(table);
}
function createdeleteCategoryButton(buttonsCell, i, categories){
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "&#128465;";
  deleteButton.style.cursor = "pointer";
  deleteButton.style.color = "black";
  deleteButton.id = "deleteCategoryButton99";
  deleteButton.addEventListener("click", async function () { // Add 'async' keyword here
    var showModal = confirmationModal(
      "Do you want to delete the category?",
      async function () { // Add 'async' keyword here
        await deleteCategory(categories[i].name);
        clearModalCategories();
        displayCategoriesInModal();
      },
    );
    showModal();
  });
  buttonsCell.appendChild(deleteButton);
}


//função para apagar categoria
async function deleteCategory(name) {
  console.log(name);
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/deleteCategory/${name}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      alert("Category deleted");
    } else if (response.status === 404) {
      alert("Category not found");
    } else if (response.status === 401) {
      alert("Unauthorized");
    }else if (response.status === 409) {
      alert("Category has tasks");
    } else {
      // Handle other response status codes
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error deleting Category:", error);
    // Handle fetch errors
    alert("Error deleting Category. Please try again.");
  }
}

function clearModalCategories() {
  const tableContainer = document.querySelector(
    "#editCategoriesModal .table-container"
  );
  if (tableContainer) {
    tableContainer.innerHTML = "";
  }
}

//função para adicionar categoria
async function addCategory(name) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/createCategory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ name: name }),
      }
    );

    if (response.status === 201) {
      alert("Category added");
    } else if (response.status === 404) {
      alert("Category not found");
    } else if (response.status === 401) {
      alert("Unauthorized");
    } else {
      // Handle other response status codes
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error adding Category:", error);
    // Handle fetch errors
    alert("Error adding Category. Please try again.");
  }
}
//função para fazer update da categoria
async function updateCategory(category) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/updateCategory`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(category),
      }
    );

    if (response.status === 200) {
      alert("Category updated");
    } else if (response.status === 404) {
      alert("Category not found");
    } else if (response.status === 401) {
      alert("Unauthorized");
    } else {
      // Handle other response status codes
      console.error("Unexpected response:", response.status);
    }
  } catch (error) {
    console.error("Error updating Category:", error);
    // Handle fetch errors
    alert("Error updating Category. Please try again.");
  }
}

function confirmationModal(message, confirmCallback) {
  // Create the confirmation modal and its elements
  var confirmationModal = document.createElement("div");
  var confirmationContent = document.createElement("div");
  var confirmationMessage = document.createElement("p");
  var confirmButton = document.createElement("button");
  var cancelButton = document.createElement("button");

  confirmationModal.id = "confirmationModal";
  confirmationModal.className = "modal";
  confirmationModal.style.display = "none";
  confirmationContent.className = "modal-content";
  confirmationContent.style.padding = "10px";
  confirmationContent.style.width = "30%";
  confirmationContent.style.height = "30%";
  confirmationContent.style.margin = "0 auto";
  confirmationContent.style.display = "flex";
  confirmationContent.style.flexDirection = "column";
  confirmationContent.style.justifyContent = "space-between";
  confirmationMessage.textContent = message;
  confirmationMessage.style.textAlign = "center";
  confirmationMessage.style.marginTop = "70px";

  var buttonsContainer = document.createElement("div");
  buttonsContainer.style.display = "flex";
  buttonsContainer.style.flexDirection = "row";
  buttonsContainer.style.justifyContent = "space-between";

  confirmButton.textContent = "Confirm";
  cancelButton.textContent = "Cancel";

  // Add click events to the buttons
  confirmButton.addEventListener("click", function () {
    confirmCallback();
    confirmationModal.style.display = "none";
  });
  cancelButton.addEventListener("click", function () {
    confirmationModal.style.display = "none";
  });

  // Add the buttons to the buttons container
  buttonsContainer.appendChild(cancelButton);
  buttonsContainer.appendChild(confirmButton);
  cancelButton.style.marginRight = "100px";

  // Add the message and the buttons container to the content
  confirmationContent.appendChild(confirmationMessage);
  confirmationContent.appendChild(buttonsContainer);

  confirmationModal.appendChild(confirmationContent);
  document.body.appendChild(confirmationModal);

  function showModal() {
    confirmationModal.style.display = "block";
  }

  return showModal;
}
