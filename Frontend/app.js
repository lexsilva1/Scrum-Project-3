window.onload = function() {
   sessionStorage.clear();
}

// ID do botão loginButton
document.getElementById('loginButton').addEventListener('click', function() {
    var loginValue = document.getElementById('login').value.trim();
    var passwordValue = document.getElementById('password').value.trim();
    if (loginValue === '' || passwordValue === '') {
        document.getElementById('warningMessage').innerText = 'Fill in your username and password';
    } else {
        // Limpa mensagem de erro
        document.getElementById('warningMessage').innerText = '';
        login(loginValue, passwordValue);
    }
});
document.getElementById('registerButton').addEventListener('click',()=>{
    window.location.href='registry.html';
})
async function login(loginValue, passwordValue) {
    // Send GET request with username and password as query parameters
    try {
        await fetch(`http://localhost:8080/Scrum-Project-3/rest/user/login`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                username: loginValue,
                password: passwordValue,
            }
        }).then(async function(response) {
            if (response.status === 200) {
                // User is logged in successfully
                const token = await response.text();
                
                // Store user data in sessionStorage
                sessionStorage.setItem('token', token);
                // Add other user properties as needed
                
                // Redirect to index.html after successful login
                window.location.href = 'home.html';
            } else if (response.status === 404) {
                // User not found
                alert('User not found');
            } else if (response.status === 403) {  
                // Something went wrong
                warningModal();
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }

}

function warningModal() {
    const modal = document.createElement("modal");
    modal.id = "acceptModal";
    modal.classList.add("modal");
    const modalcontent = document.createElement("div");
    modalcontent.classList.add("modal-content");
    modal.appendChild(modalcontent);
    const p = document.createElement("p");
    p.innerHTML = "<p>Your account as been deleted.</p><p>Please contact a system administrator</p><p>if you wish to recover your account.</p>";
    modalcontent.appendChild(p);

    var acceptButton = document.createElement("button");
    acceptButton.style.alignSelf = "center";
    acceptButton.innerHTML = "OK";
    modalcontent.appendChild(acceptButton)
    acceptButton.addEventListener('click', function() {
      modal.style.display = "none";
      modal.remove();
    });


    // Create close button
    var closeButton = document.createElement("span");
    closeButton.id = "closeButton";
    closeButton.innerHTML = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "0";
    closeButton.style.right = "0";
    closeButton.style.cursor = "pointer";
    modalcontent.appendChild(closeButton);

    document.body.appendChild(modal);
    modal.style.display = "block";
  
    closeButton = document.getElementById("closeButton");
    closeButton.onclick = function () {
      modal.style.display = "none";
      modal.remove();
    };
}