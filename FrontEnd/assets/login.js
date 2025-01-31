let form = document.getElementById("form");
let email = document.getElementById("email");
let password = document.getElementById("password");
let error = document.querySelector(".error-message");
error.innerText = "";

function goHome() {
  document.location.href = "./index.html";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let user = {
    email: email.value,
    password: password.value,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user), 
  })

    .then((response) => {

      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        console.log("Unauthorized");
        error.innerText = "Error in username and/or password";
      } else if (response.status === 404) {
        console.log("User not found");
        error.innerText = "Unknown user";
      }
    })

    .then((data) => {
      sessionStorage.setItem("token", data.token);
      goHome();
    })
    .catch((error) => {
      console.log(error);
    });
});