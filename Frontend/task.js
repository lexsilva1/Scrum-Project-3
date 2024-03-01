
window.onload =async function () {
  const user = await getUserDTO();
  const task = await getTaskDTO();
  let names = user.name.split(" ");
  var categories = await getCategories();
  console.log(categories);
  document.getElementById('profileImageEditTask').src = user.userPhoto;
  document.getElementById('usernameTask').innerHTML = names[0];

    const taskCreator = await getTaskCreator();
    sessionStorage.setItem('taskCreator', taskCreator.username);
    sessionStorage.setItem('role', user.role);
    sessionStorage.setItem('username', user.username);
    document.getElementById('usernameTask').textContent = names[0];
    let username = user.username; // Obter o user da session storage
    let descricao = task.description
    let titulo = task.title
    let taskid = sessionStorage.getItem("taskid"); // Obter o id da task da session storage
    let startdate = task.startDate
    let enddate = task.endDate
    let category = task.category
    if (username) {
      document.getElementById('taskCreator').textContent = 'Task Creator: ' +taskCreator.name;
      document.getElementById('tasktitle').textContent = titulo;
        document.getElementById('descricao-task').textContent = descricao; // Colocar a descrição na text area
        document.getElementById('titulo-task').innerHTML = titulo; // Colocar o título no título da página
        document.getElementById("startdateEditTask").value = startdate; // Colocar a data de início no input startdate
        if(enddate !== "2199-12-31"){
        document.getElementById("enddateEditTask").value = enddate; // Colocar a data de fim no input enddate
        document.getElementById('categoryEditTask').value = category; // Colocar a categoria no input category
    }
       
        console.log(categories);
        var select = document.getElementById('categoryEditTask');
    
        // Limpa opções existentes
        select.innerHTML = '';
    
        // Cria uma nova opção para cada categoria e adiciona à combobox
        for (var i = 0; i < categories.length; i++) {
          var option = document.createElement('option');
          option.value = categories[i].name;
          option.text = categories[i].name;
          select.appendChild(option);
        }
        if(category !== null){
          select.value = category;
        }
    }
    if( sessionStorage.getItem('role') !== 'developer' || taskCreator.username === user.username){
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
          document.getElementById('save-button').remove();
          document.getElementById('cancel-button').remove();
          document.getElementById('descricao-task').disabled = true;
          document.getElementById('titulo-task').disabled = true;
          document.getElementById('startdateEditTask').disabled=true;
          document.getElementById('enddateEditTask').disabled=true;
          document.getElementById('categoryEditTask').disabled=true;
      }
    }





document.getElementById('link-bc').addEventListener('click', function() {
  sessionStorage.removeItem("taskDescription");
  sessionStorage.removeItem("taskTitle");
  sessionStorage.removeItem("taskid");
  sessionStorage.removeItem("taskStatus");
  sessionStorage.removeItem("taskPriority");
  sessionStorage.removeItem("taskStartDate");
  sessionStorage.removeItem("taskEndDate");
  sessionStorage.removeItem("taskCreator");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("taskCategory");
  window.location.href = 'home.html';
});

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
// Event listener para o botão de guardar
const savebutton = document.getElementById("save-button");
savebutton.addEventListener("click", () => {
  console.log('save button clicked');
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
        let enddate = document.getElementById('enddate').value;
        if(enddate === ""){
            document.getElementById('enddate').value = "2199-12-31";
        }
        console.log('updateTask');
        updateTask();
        // Limpa mensagem de erro
        document.getElementById('warningMessage3').innerText = '';

    sessionStorage.removeItem("taskDescription");
    sessionStorage.removeItem("taskTitle");
    sessionStorage.removeItem("taskid");
    sessionStorage.removeItem("taskStatus");
    sessionStorage.removeItem("taskPriority");
    sessionStorage.removeItem("taskStartDate");
    sessionStorage.removeItem("taskEndDate");
    sessionStorage.removeItem("taskCreator");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("taskCategory");
    window.location.href = 'home.html';
    }
});

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
        sessionStorage.removeItem("taskStartDate");
        sessionStorage.removeItem("taskEndDate");
        sessionStorage.removeItem("taskCreator");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("taskCategory");
        window.location.href = 'home.html';    
    });
    cancelModal.style.display = "grid";
});


// Event listeners para os botões priority





// funçaõ de update das tasks
async function updateTask() {
  console.log('updateTask');
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
         endDate: document.getElementById('enddate').value,
         category	: document.getElementById('category').value
        };
   
     try {
       const response = await fetch('http://localhost:8080/Scrum-Project-3/rest/task/update', {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
           'token': sessionStorage.getItem('token'),
           
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

  async function getCategories() {
    try {
      const response = await fetch('http://localhost:8080/Scrum-Project-3/rest/task/allCategories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': sessionStorage.getItem('token')
        }
      });
  
      if (response.status === 200) {
        const categoriesArray = await response.json();
        console.log(categoriesArray);
        if(categoriesArray.length === 0){
          alert('Categories not found');
        } else {
          const Array = [];
          for (var i = 0; i < categoriesArray.length; i++) {
            Array.push(categoriesArray[i]);
          }
          return Array;
        }
      
      } else if (response.status === 404) {
        alert('Categories not found');
      }
    } catch (error) {
      console.error('Something went wrong:', error);
      throw error;
    }
  }

async function getTaskDTO() {
  try {
    const response = await fetch(`http://localhost:8080/Scrum-Project-3/rest/task/${sessionStorage.getItem('taskid')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': sessionStorage.getItem('token')
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch task data');
    }
    const obj = await response.json();
    return obj;
  } catch (error) {
    console.error('Something went wrong:', error);
    throw error;
  }
}
