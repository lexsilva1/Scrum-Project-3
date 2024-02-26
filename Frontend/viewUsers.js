window.onload = async function () {
    updateDate();
    showTime();
    showUsers();
    const user = await getUserDTO();
    const names = user.name.split(" ");
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
  async function showUsers() {

    await fetch('http://localhost:8080/Scrum-Project-3/rest/user/all', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       'token': sessionStorage.getItem('token')
     }
   }).then(async function(response){
     if (response.role === 'Developer') {
        document.getElementById('Developer');
        developerColumn.innerHTML += '<p>' + user.name + '</p>';
        } else if (response.role === 'Scrum Master') {
        document.getElementById('Scrum Master');
        scrumMasterColumn.innerHTML += '<p>' + user.name + '</p>';
        } else if (response.role === 'Product Owner') {
        document.getElementById('Product Owner');
        productOwnerColumn.innerHTML += '<p>' + user.name + '</p>';
        }
    });
    }
    
    
     

  
  