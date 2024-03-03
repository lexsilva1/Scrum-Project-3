window.onload = async function(){
    const user = await getUserDTO();
    
    const names = user.name.split(" ");
    document.getElementById('profileImageHomeReg').src = user.userPhoto;
    document.getElementById('loginReg').innerHTML = names[0];
    document.getElementById('editFirstName').placeholder = names[0];
    document.getElementById('editLastName').placeholder = names[1];
    document.getElementById('profileImageEdit').src = user.userPhoto;
    document.getElementById('editUserPhotoUrl').placeholder = user.userPhoto;
    document.getElementById('editUserEmail').placeholder = user.email;
    document.getElementById('editUserContact').placeholder= user.contactNumber;
    document.getElementById('username').placeholder = user.username;

}



if(sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === ''){
    window.location.href = 'index.html';
}

    document.getElementById('buttonSubmitData').addEventListener('click',async ()=>{
        const userData = await getUserDTO();
        sessionStorage.setItem('username',userData.username);  
        const names = userData.name.split(" ");

        const confirmationDialog = document.getElementById('confirmChanges');
        //primeiro nome
        if(document.getElementById('editFirstName').value.trim() === "" || document.getElementById('editFirstName').value.trim() === names[0]){
            document.getElementById('editFirstName').value = names[0];
        }
        //ultimo nome
        if (document.getElementById('editLastName').value.trim() === "" || document.getElementById('editLastName').value.trim() === names[1]){
            document.getElementById('editLastName').value = names[1];
        }
        //contacto
        if(document.getElementById('editUserContact').value.trim() === "" || document.getElementById('editUserContact').value.trim() === null){
            document.getElementById('editUserContact').value = userData.contactNumber;
        }
       //email
       if (document.getElementById('editUserEmail').value.trim() === "" || document.getElementById('editUserEmail').value.trim() ===null){
        document.getElementById('editUserEmail').value = userData.email;
       }
       //photo input text
       if(document.getElementById('editUserPhotoUrl').value.trim() === "" || document.getElementById('editUserPhotoUrl').value.trim() === null){
        document.getElementById('editUserPhotoUrl').value = userData.userPhoto;
       }
        confirmationDialog.showModal();     
        if(document.getElementById('editNewPassword')!== ""){
            if (document.getElementById('editNewPassword').value === document.getElementById('rewritePasswordField').value){
                document.getElementById('editNewPassword').value = document.getElementById('rewritePasswordField').value; 
                confirmationDialog.showModal();            
            } else {
                createAlertModal('falhou na verificação da password');
            }
        }
    })

    document.getElementById('confirmChangesButton').addEventListener('click',()=>{
        user = {
            username : sessionStorage.getItem('username'),
            name : document.getElementById('editFirstName').value.trim()+' '+document.getElementById('editLastName').value.trim(),
            email: document.getElementById('editUserEmail').value.trim(),
            contactNumber : document.getElementById('editUserContact').value.trim(),
            userPhoto : document.getElementById('editUserPhotoUrl').value.trim(),
            userRole : sessionStorage.getItem('role'),
            }

        const confirmationDialog = document.getElementById('confirmChanges');
        confirmationDialog.close();
        updateUserData(user);
        if(document.getElementById('editNewPassword').value !== user.password && document.getElementById('editNewPassword').value !== '' && document.getElementById('editNewPassword').value === document.getElementById('rewritePasswordField').value){
            password = {
                password : document.getElementById('oldPassword').value,
                newPassword : document.getElementById('editNewPassword').value
            }
            updatePassword(password);
        }
        window.location.href = 'home.html'
    })
    document.getElementById('declineChangesButton').addEventListener('click',()=>{
        confirmationDialog.close();
    })



//função que atualiza utilizador
async function updateUserData(user){//chama o user aqui
    try{
    await fetch(`http://localhost:8080/Scrum-Project-3/rest/user/update`,{
        method: 'PUT',
        headers:{
            'Accept':'*/*',
            'Content-Type':'application/json',
            'token':sessionStorage.getItem('token')
        },
        body:JSON.stringify(user),
    }).then(function(response){
        if (response.status ==404){
            createAlertModal(response.status, 'username not found')
        } else if(response.status == 406){
            createAlertModal(response.status,'failed, all fields must be filled')
        } else if(response.status == 400){
            createAlertModal(response.status,'failed, user not updated')
        } else if(response.status == 200){
            sessionStorage.setItem('password',user.password);
            createAlertModal(response.status,'user updated sucessfully')
        }
    })
    } catch(error){
        console.error('error',error);
    }
}

//função que atualiza password
async function updatePassword(password){//chama o user aqui
    try{
    await fetch(`http://localhost:8080/Scrum-Project-3/rest/user/updatePassword`,{
        method: 'PATCH',
        headers:{
            'Accept':'*/*',
            'Content-Type':'application/json',
            'token':sessionStorage.getItem('token')
        },
        body:JSON.stringify(password),
    }).then(function(response){
        if (response.status ==404){
            createAlertModal(response.status, 'username not found')
        } else if(response.status == 403){
            createAlertModal(response.status,'forbidden due to header params')
        } else if(response.status == 400){
            createAlertModal(response.status,'failed, user not updated')
        } else if(response.status == 200){
            createAlertModal(response.status,'user updated sucessfully')
        } else if(response.status == 406){
            createAlertModal(response.status,'invalid password format')
        }
    })
    } catch(error){
        console.error('error',error);
    }
}

//abrir modal para confirmar alterações 
document.getElementById('buttonCancelEdition').addEventListener('click',()=>{
    window.location.href='home.html';
})

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
  
      if (response.status === 403) {
        alert('unauthorized access');
        sessionStorage.clear();
        window.location.href = 'index.html';
      } else if (response.status === 200) {
      const obj = await response.json();
      return obj;
    }
      
    } catch (error) {
      console.error('Something went wrong:', error);
      // Re-throw the error or return a rejected promise
      throw error;
    }
  }

  document.getElementById('editUserPhotoUrl').addEventListener('input', function() {
    // Obtenha o novo URL do campo de entrada
    var newUrl = document.getElementById('editUserPhotoUrl').value;

    // Atualize a fonte da imagem para o novo URL
    document.getElementById('profileImageEdit').src = newUrl;
});

//função que cria modal de alerta
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
    closeButton.style.marginRight = "100px";
  
    closeButton.addEventListener("click", function () {
      alertModal.style.display = "none";
    });
  
    alertContent.appendChild(alertMessage);
    alertContent.appendChild(closeButton);
    alertModal.appendChild(alertContent);
    document.body.appendChild(alertModal);
  
    alertModal.style.display = "block";
  }