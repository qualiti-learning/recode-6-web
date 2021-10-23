function getUserName() {
  const name = prompt("Qual seu nome?");
  const isYourName = confirm(`Seu nome é mesmo ${name} ?`);

  if (isYourName) {
    const paragraph = document.getElementById("paragrafo");

    paragraph.innerText += name;
  } else {
    getUserName();
  }
}

function setUsersInPage(users) {
  const div = document.getElementById("list-users");

  let elements = "";

  users.forEach((user) => {
    elements += `<div class="card mr-4" style="width: 18rem">
      <div class="card-body">
        <h5 class="card-title">${user.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${user.email}</h6>
        <p class="card-text">
          ${user.company.catchPhrase}
        </p>
      </div>
    </div>`;
  });

  div.innerHTML = elements;
}

async function getUsersFromAPI() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();

  setUsersInPage(data);
}

getUsersFromAPI();
