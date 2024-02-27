window.onload = async function () {
    updateDate();
    showTime();
    displayUsers();
    const user = await getUserDTO();
    let names = user.name.split(" ");
    document.getElementById('profileImageHome').src = user.userPhoto;
    document.getElementById('login-home').innerHTML = names[0];
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
    const button = document.createElement('button');
    button.textContent = user.name;
    button.classList.add('userButton');
    button.addEventListener('click', () => {
      sessionStorage.setItem('username', user.username);
      window.location.href = 'userProfile.html';
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
    
    
     

  
  