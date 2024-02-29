window.onload = async function(){
    const user = await getUserDTO();
    const names = user.name.split(" ");
    document.getElementById('profileImageHomeReg').src = user.userPhoto;
    document.getElementById('loginReg').innerHTML = names[0];
    console.log(user);

    
    
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

    document.getElementById('buttonSubmitData').addEventListener('click',()=>{

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
        if(document.getElementById('editUserContact').value.trim() === "" || document.getElementById('editUserContact').value.trim() === user.contactNumber){
            document.getElementById('editUserContact').value = user.contactNumber;
        }
       //email
       if (document.getElementById('editUserEmail').value.trim() === "" || document.getElementById('editUserEmail').value.trim() ===user.email){
        document.getElementById('editUserEmail').value = user.email;
       }
       //photo input text
       if(document.getElementById('photoUpload').value.trim() === "" || document.getElementById('photoUpload').value.trim() === user.userPhoto){
        document.getElementById('photoUpload').value = user.userPhoto;
       }
       //photo input source
       if(document.getElementById('profileImage').src === "" || document.getElementById('profileImage').src === user.userPhoto){
        document.getElementById('profileImage').src = user.userPhoto;
       }
       //new password must match new password else if
       if(document.getElementById('editNewPassword').value === ''){
        document.getElementById('editNewPassword').value = user.password; 
        confirmationDialog.showModal();     
       } else if(document.getElementById('editNewPassword')!== ""){
            if (document.getElementById('editNewPassword').value === document.getElementById('rewritePasswordField').value){
                document.getElementById('editNewPassword').value = document.getElementById('rewritePasswordField').value; 
                confirmationDialog.showModal();            
            } else {
                alert('falhou na verificação da password');
            }
        }
    })

    document.getElementById('confirmChangesButton').addEventListener('click',()=>{
        user = {
            username : user.username,
            name : document.getElementById('editFirstName').value.trim()+' '+document.getElementById('editLastName').value.trim(),
            email: document.getElementById('editUserEmail').value.trim(),
            contactNumber : document.getElementById('editUserContact').value.trim(),
            userPhoto : document.getElementById("profileImage").src = document.getElementById('photoUpload').value.trim(),
            userRole : user.userRole
            }
            if(document.getElementById('editNewPassword').value !== user.password && document.getElementById('editNewPassword').value !== '' && document.getElementById('editNewPassword').value === document.getElementById('rewritePasswordField').value){
                password = {
                    password : document.getElementById('oldPassword').value,
                    newPassword : document.getElementById('editNewPassword').value
                }
                updatePassword(password);
            }
        confirmationDialog.close();
        updateUserData(user);
        window.location.href = 'home.html'
    })
    document.getElementById('declineChangesButton').addEventListener('click',()=>{
        confirmationDialog.close();
    })




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
            alert(response.status, 'username not found')
        } else if(response.status == 405){
            alert(response.status,'forbidden due to header params')
        } else if(response.status == 400){
            alert(response.status,'failed, user not updated')
        } else if(response.status == 200){
            sessionStorage.setItem('password',user.password);
            alert(response.status,'user updated sucessfully')
        }
    })
    } catch(error){
        console.error('error',error);
    }
}
async function updatePassword(password){//chama o user aqui
    try{
    await fetch(`http://localhost:8080/Scrum-Project-3/rest/user/updatePassword`,{
        method: 'PUT',
        headers:{
            'Accept':'*/*',
            'Content-Type':'application/json',
            'token':sessionStorage.getItem('token')
        },
        body:JSON.stringify(password),
    }).then(function(response){
        if (response.status ==404){
            alert(response.status, 'username not found')
        } else if(response.status == 403){
            alert(response.status,'forbidden due to header params')
        } else if(response.status == 400){
            alert(response.status,'failed, user not updated')
        } else if(response.status == 200){
            alert(response.status,'user updated sucessfully')
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

  document.getElementById('editUserPhotoUrl').addEventListener('input', function() {
    // Obtenha o novo URL do campo de entrada
    var newUrl = document.getElementById('editUserPhotoUrl').value;

    // Atualize a fonte da imagem para o novo URL
    document.getElementById('profileImageEdit').src = newUrl;
});