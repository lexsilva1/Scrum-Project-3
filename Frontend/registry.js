//objecto user

//funcionalidade dos botoes
document.addEventListener('DOMContentLoaded',()=>{ 
document.getElementById('submitRegistryButton').addEventListener('click',(e)=>{
    e.preventDefault();
    let userImage = document.getElementById("userPhotoUrl");
    if (document.getElementById("userPhotoUrl").value.trim() === ''){
        userImage.value = 'https://media.istockphoto.com/id/1300845620/pt/vetorial/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=7TO9d1_F-zi74bCZGEUzpa-nXT1JbcVglYMk_4MSwdg=';
    } else{
        userImage.value = document.getElementById("userPhotoUrl").value.trim();
    }
    console.log(userImage);
    if (document.getElementById('userPassword').value.trim() != document.getElementById('userRewrittenPassword').value.trim()){
        createAlertModal('Passwords do not match');
    } else {
    let newUser = {
        id : 'user'+Math.floor(Math.random()*1000),
        username : document.getElementById('userUsername').value.trim(),
        name : document.getElementById('userFirstName').value.trim()+' '+document.getElementById('userLastName').value.trim(),
        email : document.getElementById('userEmail').value.trim(),
        password : document.getElementById('userPassword').value.trim(),
        contactNumber : document.getElementById('userNumber').value.trim(),
        userPhoto : userImage.value.trim()
        }
        //verificação frontend de credenciais
        const emptyFields = [];
        for (const [key,value] of Object.entries(newUser)){
            if (key !== 'userPhoto' && value.trim()===''){
                emptyFields.push(key);
            }
        }
        //password checks with rewritten password 
        const passwordCheck = newUser.password === document.getElementById('userRewrittenPassword').value;
        if (emptyFields.length === 0 && passwordCheck){
            createAlertModal('user can be created');
            postUser(newUser);
            window.location.href='index.html';
        } else {
            createAlertModal('please fill empty fields');
        }   
}
})
});
//função que cria novo utilizador
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
            if (response.status == 200) {
            createAlertModal('user is added successfully :)');
            } else {
            createAlertModal('something went wrong :(');
            console.log(response.status);
            }
            });
}
catch (error) {
    console.error('Error:', error);
}
}
//carregar cancel leva à pagina login
document.getElementById('cancelRegistryButton').addEventListener('click',()=>{
    window.location.href='index.html'
})

document.getElementById('userPhotoUrl').addEventListener('input', function() {
    document.getElementById('profileImage').src = this.value;
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



