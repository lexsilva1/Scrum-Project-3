window.onload = async function () {
    updateDate();
    showTime();
    displayUsers();
    const user = await getUserDTO();
    let names = user.name.split(" ");
    document.getElementById('profileImageHome').src = user.userPhoto;
    document.getElementById('login-home').innerHTML = names[0];
    if (user.role === 'developer' || user.role === 'ScrumMaster') {
        document.getElementById('addUser').remove();
    }
  };

  if(sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === ''){
    window.location.href = 'index.html';
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


  async function getUsers() {
    try {
      const response = await fetch('http://localhost:8080/Scrum-Project-3/rest/user/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': sessionStorage.getItem('token')
        }
      });
  
      if (response.status === 200) {
        const usersArray = await response.json();
        if(usersArray.length === 0){
          alert('Users not found');
        } else {
          const Array = [];
          for (var i = 0; i < usersArray.length; i++) {
            Array.push(usersArray[i]);
          }
          return Array;
        }
      
      } else if (response.status === 404) {
        alert('Users not found');
      }
    } catch (error) {
      console.error('Something went wrong:', error);
      throw error;
    }
  }
  function createUserElement(user) {
    const userElement = document.createElement('div');
    userElement.username=user.username;
    userElement.role=user.role;
    userElement.classList.add('user');

    // Crie um elemento de imagem para a foto do usuário
    const img = document.createElement('img');
    img.src = user.userPhoto; // Substitua 'user.userPhoto' pelo caminho correto para a foto do usuário
    img.classList.add('userPhoto');
    userElement.appendChild(img);

    const button = document.createElement('button');
    button.textContent = user.name;
    button.classList.add('userButton');
    button.addEventListener('click', () => {
        let names = user.name.split(" ");
        var modal = document.getElementById('myModalView');
        document.getElementById('nome').innerHTML = names[0]+' '+names[1];
        
        modal.style.display = "block";
        document.getElementById('firstNameViewUser').placeholder = names[0];
        document.getElementById('lastNameViewUser').placeholder = names[1];
        document.getElementById('usernameViewUser').placeholder = user.username;
        document.getElementById('emailViewUser').placeholder = user.email;
        document.getElementById('contactViewUser').placeholder = user.contactNumber;
        document.getElementById('roleViewUser').placeholder = user.role;
        document.getElementById('userPhotoViewUser').src = user.userPhoto;


        if (sessionStorage.getItem('role') !== 'Owner') {
            // Event listeners para os botões status
                document.getElementById('firstNameViewUser').disabled = true;
                document.getElementById('lastNameViewUser').disabled = true;
                document.getElementById('usernameViewUser').disabled = true;
                document.getElementById('emailViewUser').disabled = true;
                document.getElementById('contactViewUser').disabled = true;
                document.getElementById('roleViewUser').disabled = true;
                document.getElementById('userPhotoViewUser').disabled = true;
                document.getElementById('save-button').remove();
            }
        
        
        var closeButton = document.querySelector('#myModalView .close');
        
        // Quando o usuário clica no botão de fechar (a cruz), fecha o modal
        closeButton.onclick = function() {
          modal.style.display = "none";
        }
      
    });
    userElement.appendChild(button);
    return userElement;
  }

  async function displayUsers() {
    try {
      const users = await getUsers();
      users.forEach(user => {
        const userElement = createUserElement(user);
  
        // Determine a coluna correta para o usuário com base em seu role
        let column;
        switch(user.role) {
          case 'developer':
            column = document.getElementById('developerColumn');
            break;
          case 'ScrumMaster':
            column = document.getElementById('scrumMasterColumn');
            break;
          case 'Owner':
            column = document.getElementById('productOwnerColumn');
            break;
          default:
            console.error('Unknown role:', user.role);
            return;
        }
  
        // Adicione o link à coluna apropriada
        column.appendChild(userElement);
      });
    } catch (error) {
      console.error('Something went wrong:', error);
    }
  }


  document.getElementById('logout').addEventListener('click', () => {
    logout();
  });

  async function logout() {
    await fetch('http://localhost:8080/Scrum-Project-3/rest/user/logout', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      }
    }).then(function(response) {
      if (response.status === 200) {
        // User is logged in successfully
        alert('User is logged out successfully :)');  
       const tasks = document.querySelectorAll('.task');
       if (tasks.length > 0) {
          tasks.forEach(task => {
            updateTask(task);
          });
        }
        sessionStorage.clear();
        window.location.href = 'index.html';
      } else if (response.status === 405) {
        sessionStorage.clear();
        window.location.href = 'index.html';
        // User not found
        alert('Unauthorized User');
      } else {
        // Something went wrong
        alert('Something went wrong :(');
        sessionStorage.clear();
        window.location.href = 'index.html';
      }
    });
    sessionStorage.clear();
    window.location.href = 'index.html';
  }


     // Elemento html onde vai ser mostrada a hora
const displayTime = document.querySelector(".display-time");
function showTime() {
  let time = new Date();
  let timeString = time.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' });
  displayTime.innerText = timeString;
  setTimeout(showTime, 1000);
}

    function updateDate() { // Mostra a data atual
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
        for (let i = 0; i < IDCollection.length; i++) { // Percorre o array de IDs
          document.getElementById(IDCollection[i]).firstChild.nodeValue = val[i]; // Altera o valor do elemento html com o ID correspondente
        }
      }

      var modal = document.getElementById("myModal");
      var btn = document.getElementById("addUser");
      var span = document.getElementsByClassName("close")[0];
      
      btn.onclick = function() {
        modal.style.display = "block";
      }
      
      span.onclick = function() {
        modal.style.display = "none";
      }
      
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

    const array = [
        {
            role: 'Developer',
            value: 'developer'
        },
        {
            role: 'Scrum Master',
            value: 'ScrumMaster'
        },
        {
            role: 'Product Owner',
            value: 'Owner'
        }
    ];
   
          // Agora estamos usando await para esperar a promessa ser resolvida
          
          var role = document.getElementById('role');
      
          // Limpa opções existentes
          role.innerHTML = '';
      
          // Cria uma nova opção para cada categoria e adiciona à combobox
          for (var i = 0; i < array.length; i++) {
            var option = document.createElement('option');
            option.value = array[i].value;
            option.text = array[i].role;
            role.appendChild(option);
          }

    document.getElementById('userPictureModal').addEventListener('input', function(e) {
        document.getElementById('userPicturePreview').src = e.target.value;
    });

    document.getElementById('newUser').addEventListener('click', () => {
        if (
            document.getElementById('usernameModal').value.trim() === "" ||
            document.getElementById('firstNameModal').value.trim() === "" ||
            document.getElementById('lastNameModal').value.trim() === "" ||
            document.getElementById('emailModal').value.trim() === "" ||
            document.getElementById('passwordModal').value.trim() === "" ||
            document.getElementById('contactModal').value.trim() === "" ||
            document.getElementById('userPictureModal').value.trim() === "" ||
            document.getElementById('role').value.trim() === ""
        ) {
            alert('Please fill all fields');
        } else if (document.getElementById('passwordModal').value.trim() !== document.getElementById('rePasswordModal').value.trim()) {
            alert('Passwords do not match');
        } else {
            let newUser = {
                username: document.getElementById('usernameModal').value.trim(),
                name: document.getElementById('firstNameModal').value.trim() + ' ' + document.getElementById('lastNameModal').value.trim(),
                email: document.getElementById('emailModal').value.trim(),
                password: document.getElementById('passwordModal').value.trim(),
                contactNumber: document.getElementById('contactModal').value.trim(),
                userPhoto: document.getElementById('userPictureModal').value.trim(),
                role: document.getElementById('role').value.trim()
            };
            postUser(newUser);
            alert('user can be created' + newUser.username + newUser.role);
            //window.location.href='index.html';
        }
    });
    document.getElementById('userbutton').addEventListener('click', () => {
        sessionStorage.setItem('username', document.getElementById('userbutton').username);
        window.location.href = 'userProfile.html';
    });

      


      async function postUser(newUser){
        // Send POST request with newUser data
         try {
             await fetch('http://localhost:8080/Scrum-Project-3/rest/user/register',{
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            }).then(function (response) {
                if (response.status == 201) {
                alert('user is added successfully :)');
                } else {
                    console.log(response.status);
                alert('something went wrong :( '+response.status);
            
                }
                });
    }
    catch (error) {
        console.error('Error:', error);
    }
    }
        async function getAnotherUserDto(username){
      try {
        const response = await fetch(`http://localhost:8080/Scrum-Project-3/rest/user/${username}`, {
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
    
     

  
  