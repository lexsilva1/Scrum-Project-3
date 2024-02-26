
window.onload =async function () {
  const user = await getUserDTO();
  let names = user.name.split(" ");
  document.getElementById('profileImageHome').src = user.userPhoto;
  document.getElementById('usernameTask').innerHTML = names[0];

    const taskCreator = await getTaskCreator();
    sessionStorage.setItem('taskCreator', taskCreator.username);
    document.getElementById('usernameTask').textContent = names[0];
    let username = sessionStorage.getItem("username"); // Obter o user da session storage
    let descricao = sessionStorage.getItem("taskDescription"); // Obter a descrição da session storage
    let titulo = sessionStorage.getItem("taskTitle"); // Obter o título da session storage
    let taskid = sessionStorage.getItem("taskid"); // Obter o id da task da session storage
    let startdate = sessionStorage.getItem("taskStartDate"); // Obter a data de início da session storage
    let enddate = sessionStorage.getItem("taskEndDate"); // Obter a data de fim da session storage
    if (username) {
        document.getElementById('titulo-task').textContent = titulo; // Colocar o título no input title
        document.getElementById('descricao-task').textContent = descricao; // Colocar a descrição na text area
        document.getElementById('tasktitle').innerHTML = titulo; // Colocar o título no título da página
        document.getElementById("task-bc").textContent = titulo; // Colocar o título no breadcrumb
        document.getElementById("startdate").value = startdate; // Colocar a data de início no input startdate
        if(enddate !== "2199-12-31"){
        document.getElementById("enddate").value = enddate; // Colocar a data de fim no input enddate
    }
    }
};


// Definir os botões de status
const todoButton = document.getElementById("todo-button"); // Atribuir o elemento respetivo à variável todoButton
const doingButton = document.getElementById("doing-button"); // Atribuir o elemento respetivo à variável doingButton
const doneButton = document.getElementById("done-button"); // Atribuir o elemento respetivo à variável doneButton


// Definir os botões de priority
const lowButton = document.getElementById("low-button");
const mediumButton = document.getElementById("medium-button");
const highButton = document.getElementById("high-button");

// Definir o botão To Do como default
var taskStatus = sessionStorage.getItem("taskStatus");
if(taskStatus == "todo"){
todoButton.classList.add("selected");
} else if( taskStatus == "doing"){
doingButton.classList.add("selected");
} else if(taskStatus == "done"){
doneButton.classList.add("selected");
}

// Definir o botão Low como default
var taskPriority = sessionStorage.getItem("taskPriority");
if(taskPriority == 100){
    lowButton.classList.add("selected");
} else if( taskPriority == 200){
    mediumButton.classList.add("selected");
} else if(taskPriority == 300){
    highButton.classList.add("selected");
}
// Função para definir o estado no grupo de botões status
function setStatusButtonSelected(button, status) {
    const buttons = [todoButton, doingButton, doneButton];
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    sessionStorage.setItem("taskStatus", status);
}

// Função para definir o estado no grupo de botões priority
function setPriorityButtonSelected(button, priority) {
    const buttons = [lowButton, mediumButton, highButton];
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    sessionStorage.setItem("taskPriority", priority);
}
if (sessionStorage.getItem('taskCreator') === sessionStorage.getItem('username') || !sessionStorage.getItem('role') === 'Developer') {
// Event listeners para os botões status
todoButton.addEventListener("click", () => setStatusButtonSelected(todoButton, "todo"));
doingButton.addEventListener("click", () => setStatusButtonSelected(doingButton, "doing"));
doneButton.addEventListener("click", () => setStatusButtonSelected(doneButton, "done"));

// Event listeners para os botões priority
lowButton.addEventListener("click", () => setPriorityButtonSelected(lowButton, 100));
mediumButton.addEventListener("click", () => setPriorityButtonSelected(mediumButton, 200));
highButton.addEventListener("click", () => setPriorityButtonSelected(highButton, 300));
} else {
    todoButton.disabled = true;
    doingButton.disabled = true;
    doneButton.disabled = true;
    lowButton.disabled = true;
    mediumButton.disabled = true;
    highButton.disabled = true;
    document.getElementById('save-button').disabled = true;
}


const cancelbutton = document.getElementById("cancel-button");
cancelbutton.addEventListener("click", () => {
    // Abrir o modal de cancel
    const cancelModal = document.getElementById("cancel-modal");
    cancelModal.style.display = "block";


    const cancelButton = document.getElementById("continue-editing-button");
    cancelButton.addEventListener("click", () => {
        window.location.href = 'task.html';
    });

    // Event listener para o botão de confirmação
    const confirmButton = document.getElementById("confirm-cancel-button");
    confirmButton.addEventListener("click", () => {
        sessionStorage.removeItem("taskDescription");
        sessionStorage.removeItem("taskTitle");
        sessionStorage.removeItem("taskid");
        sessionStorage.removeItem("taskStatus");
        sessionStorage.removeItem("taskPriority");
        sessionStorage.removeItem("taskStartdate");
        sessionStorage.removeItem("taskEnddate");
        window.location.href = 'home.html';    
    });
    cancelModal.style.display = "grid";
});

// funçaõ de update das tasks
async function updateTask() {
    let taskElementstatus=sessionStorage.getItem("taskStatus");

    if(taskElementstatus === "todo"){
      taskElementstatus = 10
    }else if(taskElementstatus === "doing"){
      taskElementstatus = 20
    }else if(taskElementstatus === "done"){
      taskElementstatus = 30
    }
     let task = {
         id: sessionStorage.getItem("taskid"),
         title: document.getElementById("titulo-task").value.trim(),
         description: document.getElementById("descricao-task").value.trim(),
         status: taskElementstatus,
         priority: sessionStorage.getItem("taskPriority"),
         startDate: document.getElementById('startdate').value,
         endDate: document.getElementById('enddate').value
        };
   
     try {
       const response = await fetch('http://localhost:8080/Scrum-Project-3/rest/user/updatetask', {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
           'username': sessionStorage.getItem('username'),
           'password': sessionStorage.getItem('password')
         },
         body: JSON.stringify(task)
       });
   
       if (response.ok) {
         console.log('Task updated');
       } else if (response.status === 404) {
         console.log('Task not found');
       } else if (response.status === 401) {
         console.log('Unauthorized');
       } else {
         // Handle other response status codes
         console.error('Unexpected response:', response.status);
       }
     } catch (error) {
       console.error('Error updating task:', error);
       // Handle fetch errors
       alert('Error updating task. Please try again.');
     }
   }
// Event listener para o botão save
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", () => {
    let taskDescription = document.getElementById("descricao-task").value.trim();
    let taskTitle = document.getElementById("titulo-task").value.trim();
    
    if (taskDescription === "" || taskTitle === "") {
        document.getElementById('warningMessage3').innerText = 'Your task must have a title and a description';
            return;
    } else if (document.getElementById('startdate').value === "" ) {
        document.getElementById('warningMessage3').innerText = 'Your task must have a start date';
            return;
    }else if (document.getElementById('enddate').value !== "") {
            if(document.getElementById('startdate').value > document.getElementById('enddate').value){
            document.getElementById('warningMessage3').innerText = 'The start date must be before the end date';
            return;
    } 
    }
    else {
        let enddate = document.getElementById('enddate').value;
        if(enddate === ""){
            document.getElementById('enddate').value = "2199-12-31";
        }
        updateTask();
        // Limpa mensagem de erro
        document.getElementById('warningMessage3').innerText = '';

    sessionStorage.removeItem("taskDescription");
    sessionStorage.removeItem("taskTitle");
    sessionStorage.removeItem("taskid");
    sessionStorage.removeItem("taskStatus");
    sessionStorage.removeItem("taskPriority");
    sessionStorage.removeItem("taskStartdate");
    sessionStorage.removeItem("taskEnddate");
    window.location.href = 'home.html';
    }
});
async function getUserDTO(){
  try {
    const response = await fetch('http://localhost:8080/Scrum-Project-3/rest/user/myUserDto', {
    method: 'GET',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'token': sessionStorage.getItem('token')
    }
  });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const obj = await response.json();
    return obj;
    
  } catch (error) {
    console.error('Something went wrong:', error);
    // Re-throw the error or return a rejected promise
    throw error;
  }
}
  async function getTaskCreator(){
    try{
        const response = await fetch(`http://localhost:8080/Scrum-Project-3/rest/task/creator/${sessionStorage.getItem('taskid')}`, {
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'token': sessionStorage.getItem('token')
          }
        });
        if (!response.ok){
        throw new Error ('failed to fetch task data');
        }
        const obj = await response.json();
        return obj;
    } catch (error){
        console.error('something went wrong', error);
        throw error;
    }
  }
