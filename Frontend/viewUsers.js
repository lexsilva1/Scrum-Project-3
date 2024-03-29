window.onload = async function () {
  if (
    sessionStorage.getItem("role") === "developer" ||
    sessionStorage.getItem("role") === "ScrumMaster"
  ) {
    document.getElementById("addUser").remove();
    document.getElementById("deleted").remove();
  }
  const user = await getUserDTO();
  let names = user.name.split(" ");
  document.getElementById("profileImageHome").src = user.userPhoto;
  document.getElementById("login-home").innerHTML = names[0];

  updateDate();
  showTime();
  displayUsers();
};

if (
  sessionStorage.getItem("token") === null ||
  sessionStorage.getItem("token") === ""
) {
  window.location.href = "index.html";
}

document.getElementById("login-home").addEventListener("click", () => {
  window.location.href = "profileEdition.html";
});


//função para ir buscar o userDto
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

    if (response.status === 403) {
      throw new Error("Unauthorized access");
    }
    else if (response.status === 200) {

    const obj = await response.json();
    return obj;
  }
  } catch (error) {
    console.error("Something went wrong:", error);
    // Re-throw the error or return a rejected promise
    throw error;
  }
}

//função para ir buscar todos os users
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
        createAlertModal("Users not found");
      } else {
        const Array = [];
        for (var i = 0; i < usersArray.length; i++) {
          Array.push(usersArray[i]);
        }
        return Array;
      }
    } else if (response.status === 403) {
      createAlertModal("Unauthorized access");
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    throw error;
  }
}

//função para criar um elemento user
function createUserElement(user) {
  const userElement = document.createElement("div");
  userElement.username = user.username;
  userElement.role = user.role;
  userElement.name = user.name;
  userElement.email = user.email;
  userElement.contactNumber = user.contactNumber;
  userElement.userPhoto = user.userPhoto;
  userElement.active = user.active;
  userElement.classList.add("user", "user-element"); 

  const img = document.createElement("img");
  img.src = user.userPhoto;
  img.classList.add("userPhoto");
  userElement.appendChild(img);

  const button = document.createElement("button");
  button.textContent = user.name;
  button.classList.add("userButton");
  button.addEventListener("click", () => {
    
    userModal(userElement);
  });
  userElement.appendChild(button);

  return userElement;
}

//função para adicionar botão de delete
function attachDeletebutton(div, username) {
  const deleteButton = document.createElement("button");
  const checkbox = document.getElementById("deleted");
  const modal = document.getElementById("myModalView");
  deleteButton.textContent = "Delete User";
  deleteButton.classList.add("delete");
  deleteButton.id = "delete-button";
  deleteButton.addEventListener("click", async () => {
    createAcceptModalDeleteUser(username);
    checkbox.classList.remove("selected");
    modal.style.display = "none";
    
  });
  div.appendChild(deleteButton);
}

//função para criar modal de aceitação de delete user
function createAcceptModalDeleteUser(username) {
  const modal = document.createElement("modal");
  modal.id = "acceptModal";
  modal.classList.add("modal");
  const modalcontent = document.createElement("div");
  modalcontent.classList.add("modal-content");
  modal.appendChild(modalcontent);
  const p = document.createElement("p");
  p.innerHTML = "Are you sure you want to delete this user?";
  modalcontent.appendChild(p);
  var acceptButton = document.createElement("button");
  acceptButton.id = "acceptButton";
  acceptButton.innerHTML = "Yes";
  modalcontent.appendChild(acceptButton);
  var cancelButton = document.createElement("button");
  cancelButton.id = "cancelButton";
  cancelButton.innerHTML = "No";
  modalcontent.appendChild(cancelButton);
  document.body.appendChild(modal);
  modal.style.display = "block";

  acceptButton = document.getElementById("acceptButton");
  acceptButton.onclick = async function () {
    deleteUser(username);
  
    
    modal.style.display = "none";
    modal.remove();
  };
  cancelButton = document.getElementById("cancelButton");
  cancelButton.onclick = function () {
    modal.style.display = "none";
    modal.remove();
  };
}

//função para adicionar botão de restore
function attachRestorebutton(div, username) {
  const restoreButton = document.createElement("button");
  const modal = document.getElementById("myModalView");
  const checkbox = document.getElementById("deleted");
  restoreButton.textContent = "Restore User";
  restoreButton.classList.add("restore");
  restoreButton.id = "restore-button";
  restoreButton.addEventListener("click", async () => {
    // Make the arrow function an async function
    await restoreUser(username);
    clearUsers();
    displayUsers();
    checkbox.classList.remove("selected");
    restoreButton.remove();
    modal.style.display = "none";
  });
  div.appendChild(restoreButton);
}

//função para restaurar user
async function restoreUser(username) {
  try {
    await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/user/restore/${username}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    ).then(function (response) {
      if (response.status === 200) {
        createAlertModal("User restored successfully");
      } else if (response.status === 404) {
        createAlertModal("User not found");
      } else if (response.status === 405) {
        createAlertModal("Forbidden due to header params");
      }
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    // Re-throw the error or return a rejected promise
    throw error;
  }
}

//função para criar o modal do perfil do user
function userModal(user) {
  let names = user.name.split(" ");
  var modal = document.getElementById("myModalView");
  var div = document.getElementById("modal-info");
  attachSavebutton(div, user);
  attachDeletebutton(div, user.username);
  attachDeleteAllTasksButton(div, user.username);

  if (user.active === false) {
    attachRestorebutton(div, user.username);
  } else if (
    user.active === true &&
    document.getElementById("restore-button") !== null
  ) {
    document.getElementById("delete-button").remove();
  }

  document.getElementById("nome").innerHTML = names[0] + " " + names[1];

  modal.style.display = "block";
  document.getElementById("firstNameViewUser").placeholder = names[0];
  document.getElementById("lastNameViewUser").placeholder = names[1];
  document.getElementById("usernameViewUser").placeholder = user.username;
  document.getElementById("usernameViewUser").disabled = true;
  document.getElementById("emailViewUser").placeholder = user.email;
  document.getElementById("contactViewUser").placeholder = user.contactNumber;
  document.getElementById("imageURLViewUser").placeholder = user.userPhoto;
  document.getElementById("roleViewUser").value = user.role;
  document.getElementById("userPhotoViewUser").src = user.userPhoto;

  if (sessionStorage.getItem("role") !== "Owner") {
    // Event listeners para os botões status
    document.getElementById("firstNameViewUser").disabled = true;
    document.getElementById("lastNameViewUser").disabled = true;
    document.getElementById("usernameViewUser").disabled = true;
    document.getElementById("emailViewUser").disabled = true;
    document.getElementById("contactViewUser").disabled = true;
    document.getElementById("imageURLViewUser").disabled = true;
    document.getElementById("roleViewUser").disabled = true;
    document.getElementById("userPhotoViewUser").disabled = true;
    document.getElementById("save-button").remove();
    document.getElementById("delete-button").remove();
    document.getElementById("delete-all-tasks-button").remove();
  }
  var closeButton = document.querySelector("#myModalView .close");

  // Quando o usuário clica no botão de fechar (a cruz), fecha o modal
  closeButton.onclick = function () {
    document.getElementById("firstNameViewUser").value = "";
    document.getElementById("lastNameViewUser").value = "";
    document.getElementById("emailViewUser").value = "";
    document.getElementById("contactViewUser").value = "";
    document.getElementById("imageURLViewUser").value = "";
    document.getElementById("roleViewUser").value = "";
    if (document.getElementById("restore-button") !== null) {
      document.getElementById("restore-button").remove();
    }
    if (document.getElementById("delete-all-tasks-button") !== null) {
      document.getElementById("delete-all-tasks-button").remove();
    }
    modal.style.display = "none";
    
  };
}

//função para apagar todas as tasks de um user
async function deleteAllTasks(username) {
  try {
    await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/task/deleteAll/${username}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    ).then(function (response) {
      if (response.status === 200) {
        createAlertModal("All tasks deleted successfully");
      } else if (response.status === 401) {
        createAlertModal("Unauthorized access");
      } else if (response.status === 400) {
        createAlertModal("Failed, tasks not deleted");
      }
    });
  } catch (error) {
    console.error("Something went wrong:", error);
    throw error;
  }
}

//função para adicionar botão de delete all tasks
function attachDeleteAllTasksButton(div, username) {
  const deleteAllTasksButton = document.createElement("button");
  deleteAllTasksButton.textContent = "Delete All Tasks";
  deleteAllTasksButton.classList.add("delete");
  deleteAllTasksButton.id = "delete-all-tasks-button";
  deleteAllTasksButton.addEventListener("click", async () => {
    createAcceptModal(username);
  });
  div.appendChild(deleteAllTasksButton);
}

//função para criar modal de aceitação de delete all tasks
function createAcceptModal(username) {
  const modal = document.createElement("modal");
  modal.id = "acceptModal";
  modal.classList.add("modal");
  const modalcontent = document.createElement("div");
  modalcontent.classList.add("modal-content");
  modal.appendChild(modalcontent);
  const p = document.createElement("p");
  p.innerHTML = "Are you sure you want to delete this user's tasks?";
  modalcontent.appendChild(p);
  var acceptButton = document.createElement("button");
  acceptButton.id = "acceptButton";
  acceptButton.innerHTML = "Yes";
  modalcontent.appendChild(acceptButton);
  var cancelButton = document.createElement("button");
  cancelButton.id = "cancelButton";
  cancelButton.innerHTML = "No";
  modalcontent.appendChild(cancelButton);
  document.body.appendChild(modal);
  modal.style.display = "block";

  acceptButton = document.getElementById("acceptButton");
  acceptButton.onclick = async function () {
    await deleteAllTasks(username);
    modal.style.display = "none";
    modal.remove();
  };
  cancelButton = document.getElementById("cancelButton");
  cancelButton.onclick = function () {
    modal.style.display = "none";
    modal.remove();
  };
}

//função para adicionar botão de save
function attachSavebutton(div, user) {
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("save");
  saveButton.id = "save-button";
  saveButton.addEventListener("click", () => {
    savebuttonHandler(user);
  });
  div.appendChild(saveButton);
}


//função para guardar as alterações do user
function savebuttonHandler(user) {
  const modal = document.getElementById("myModalView");
  let names = user.name.split(" ");
  if (document.getElementById("firstNameViewUser").value.trim() === "") {
    document.getElementById("firstNameViewUser").value = names[0];
  }
  if (document.getElementById("lastNameViewUser").value.trim() === "") {
    document.getElementById("lastNameViewUser").value = names[1];
  }
  if (document.getElementById("emailViewUser").value.trim() === "") {
    document.getElementById("emailViewUser").value = user.email;
  }
  if (document.getElementById("contactViewUser").value.trim() === "") {
    document.getElementById("contactViewUser").value = user.contactNumber;
  }
  if (document.getElementById("imageURLViewUser").value.trim() === "") {
    document.getElementById("imageURLViewUser").value = user.userPhoto;
  }
  if (document.getElementById("roleViewUser").value.trim() === "") {
    document.getElementById("roleViewUser").value = user.role;
  }
  const updatedUser = {
    username: user.username,
    name:
      document.getElementById("firstNameViewUser").value.trim() +
      " " +
      document.getElementById("lastNameViewUser").value.trim(),
    email: document.getElementById("emailViewUser").value.trim(),
    contactNumber: document.getElementById("contactViewUser").value.trim(),
    userPhoto: document.getElementById("imageURLViewUser").value.trim(),
    role: document.getElementById("roleViewUser").value.trim(),
  };

  saveUserProfileChanges(updatedUser).then(async () => {
    document.getElementById("firstNameViewUser").value = "";
    document.getElementById("lastNameViewUser").value = "";
    document.getElementById("emailViewUser").value = "";
    document.getElementById("contactViewUser").value = "";
    document.getElementById("imageURLViewUser").value = "";
    document.getElementById("roleViewUser").value = "";
    clearUsers();
    await displayUsers();
  });
  modal.style.display = "none";
}

function clearUsers() {
  const userElements = document.querySelectorAll(".user-element");
  userElements.forEach((userElement) => {
    userElement.remove();
  });
}

//função para mostrar os users
  async function displayUsers() {
    try {
      const users = await getUsers();
      users.forEach(user => {
        if(user.username !== "deleted" && user.username !== "admin"){
        const userElement = createUserElement(user);

        if (user.active === true) {
          // Determine a coluna correta para o usuário com base em seu role
          let column;
          switch (user.role) {
            case "developer":
              column = document.getElementById("developerColumn");
              break;
            case "ScrumMaster":
              column = document.getElementById("scrumMasterColumn");
              break;
            case "Owner":
              column = document.getElementById("productOwnerColumn");
              break;
            default:
              console.error("Unknown role:", user.role);
              return;
          }

          // Adicione o link à coluna apropriada
          column.appendChild(userElement);
        }
      }
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}

document.getElementById("logout").addEventListener("click", () => {
  logout();
});

//função para fazer logout
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
      createAlertModal("Unauthorized User");
    } else {
      // Something went wrong
      createAlertModal("Something went wrong :(");
      sessionStorage.clear();
      window.location.href = "index.html";
    }
  });
  sessionStorage.clear();
  window.location.href = "index.html";
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

var modal = document.getElementById("myModal");
var btn = document.getElementById("addUser");
var span = document.getElementById("adduserclose");
var usernameModal = document.getElementById("usernameModal");
var firstNameModal = document.getElementById("firstNameModal");
var lastNameModal = document.getElementById("lastNameModal");
var emailModal = document.getElementById("emailModal");
var passwordModal = document.getElementById("passwordModal");
var rePasswordModal = document.getElementById("rePasswordModal");
var contactModal = document.getElementById("contactModal");
var userPictureModal = document.getElementById("userPictureModal");
var role = document.getElementById("role");

btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  usernameModal.value = "";
  firstNameModal.value = "";
  lastNameModal.value = "";
  emailModal.value = "";
  passwordModal.value = "";
  rePasswordModal.value = "";
  contactModal.value = "";
  userPictureModal.value = "";
  role.value = "";
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const array = [
  {
    role: "Developer",
    value: "developer",
  },
  {
    role: "Scrum Master",
    value: "ScrumMaster",
  },
  {
    role: "Product Owner",
    value: "Owner",
  },
];

// Agora estamos usando await para esperar a promessa ser resolvida

var role = document.getElementById("role");

// Limpa opções existentes
role.innerHTML = "";

// Cria uma nova opção para cada categoria e adiciona à combobox
for (var i = 0; i < array.length; i++) {
  var option = document.createElement("option");
  option.value = array[i].value;
  option.text = array[i].role;
  role.appendChild(option);
}

document
  .getElementById("userPictureModal")
  .addEventListener("input", function (e) {
    document.getElementById("userPicturePreview").src = e.target.value;
  });

document.getElementById("newUser").addEventListener("click", () => {
  if (
    document.getElementById("usernameModal").value.trim() === "" ||
    document.getElementById("firstNameModal").value.trim() === "" ||
    document.getElementById("lastNameModal").value.trim() === "" ||
    document.getElementById("emailModal").value.trim() === "" ||
    document.getElementById("passwordModal").value.trim() === "" ||
    document.getElementById("contactModal").value.trim() === "" ||
    document.getElementById("userPictureModal").value.trim() === "" ||
    document.getElementById("role").value.trim() === ""
  ) {
    createAlertModal("Please fill all fields");
  } else if (
    document.getElementById("passwordModal").value.trim() !==
    document.getElementById("rePasswordModal").value.trim()
  ) {
    createAlertModal("Passwords do not match");
  } else {
    let newUser = {
      username: document.getElementById("usernameModal").value.trim(),
      name:
        document.getElementById("firstNameModal").value.trim() +
        " " +
        document.getElementById("lastNameModal").value.trim(),
      email: document.getElementById("emailModal").value.trim(),
      password: document.getElementById("passwordModal").value.trim(),
      contactNumber: document.getElementById("contactModal").value.trim(),
      userPhoto: document.getElementById("userPictureModal").value.trim(),
      role: document.getElementById("role").value.trim(),
    };
    postUser(newUser);
    createAlertModal("User created as a  "+ newUser.role);
    window.location.href = "viewUsers.html";
  }
});


//função para criar um novo user
async function postUser(newUser) {
  // Send POST request with newUser data
  try {
    await fetch("http://localhost:8080/Scrum-Project-3/rest/user/register", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }).then(function (response) {
      if (response.status == 201) {
        createAlertModal("user is added successfully :)");
      } else {
        console.log(response.status);
        createAlertModal("something went wrong :( " + response.status);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

//função para ir buscar um userDto
async function getAnotherUserDto(username) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/user/${username}`,
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
    createAlertModal("Something went wrong:", error);
    // Re-throw the error or return a rejected promise
    throw error;
  }
}

//função para salvar as alterações do user
async function saveUserProfileChanges(user) {
  try {
    await fetch(`http://localhost:8080/Scrum-Project-3/rest/user/update`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: sessionStorage.getItem("token"),
      },
      body: JSON.stringify(user),
    }).then(function (response) {
      if (response.status == 404) {
        createAlertModal("username not found");
      } else if (response.status == 405) {
        createAlertModal("forbidden due to header params");
      } else if (response.status == 400) {
        createAlertModal("failed, user not updated");
      } else if (response.status == 200) {
        createAlertModal( "user updated sucessfully");
      }
    });
  } catch (error) {
    console.error("error", error);
  }
}

const viewDeletedUsersBox = document.getElementById("deleted");
viewDeletedUsersBox.addEventListener("click", () => {
  if (!viewDeletedUsersBox.classList.contains("selected")) {
    clearUsers();
    displayDeletedUsers();
    viewDeletedUsersBox.classList.add("selected");
  } else {
    clearUsers();
    displayUsers();
    viewDeletedUsersBox.classList.remove("selected");
  }
});

//função para ir buscar os users eliminados
async function getDeletedUsers() {
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
      const userArray = await response.json();
      const deletedUsers = [];
      if (userArray.length > 0) {
        userArray.forEach((user) => {
          if (user.active === false) {
            deletedUsers.push(user);
          }
        });
      }
      return deletedUsers;
    } else if (response.status === 404) {
      createAlertModal("Users not found");
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    throw error;
  }
}

//função para mostrar os users eliminados
async function displayDeletedUsers() {
  try {
    const users = await getDeletedUsers();
    users.forEach((user) => {
      const userElement = createUserElement(user);

      // Determine a coluna correta para o usuário com base em seu role
      let column;
      switch (user.role) {
        case "developer":
          column = document.getElementById("developerColumn");
          break;
        case "ScrumMaster":
          column = document.getElementById("scrumMasterColumn");
          break;
        case "Owner":
          column = document.getElementById("productOwnerColumn");
          break;
        default:
          createAlertModal("Unknown role:", user.role);
          return;
      }
        userElement.classList.add("deleted");
        userElement.style.opacity = "0.5";
      // Adicione o link à coluna apropriada
      column.appendChild(userElement);
    });
  } catch (error) {
    createAlertModal("Something went wrong:", error);
  }
}

//função para apagar um user
async function deleteUser(username) {
  try {
    const response = await fetch(
      `http://localhost:8080/Scrum-Project-3/rest/user/delete/${username}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      createAlertModal("User deleted successfully");
      clearUsers();
      displayUsers();
    } else if (response.status === 404) {
      createAlertModal("User not found");
    } else if (response.status === 405) {
      createAlertModal("Forbidden due to header params");
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    throw error;
  }
}

//função para criar um modal de alerta
function createAlertModal(message) {
  var alertModal = document.createElement("div");
  var alertContent = document.createElement("div");
  var alertMessage = document.createElement("p");
  var closeButton = document.createElement("button");

  alertModal.id = "alertModal";
  alertModal.className = "modal";
  alertModal.style.display = "none";
  alertContent.className = "modal-content";
  alertContent.style.padding = "10px";
  alertContent.style.width = "30%";
  alertContent.style.height = "30%";
  alertContent.style.margin = "0 auto";
  alertContent.style.display = "flex";
  alertContent.style.flexDirection = "column";
  alertContent.style.justifyContent = "space-between";
  alertMessage.textContent = message;
  alertMessage.style.textAlign = "center";
  alertMessage.style.marginTop = "70px";
  closeButton.textContent = "Close";
  closeButton.style.marginRight = "160px";

  closeButton.addEventListener("click", function () {
    alertModal.style.display = "none";
  });

  alertContent.appendChild(alertMessage);
  alertContent.appendChild(closeButton);
  alertModal.appendChild(alertContent);
  document.body.appendChild(alertModal);

  alertModal.style.display = "block";
}
