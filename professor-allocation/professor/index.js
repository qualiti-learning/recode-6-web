const tableBody = document.getElementById("table-body");

function createProfessor() {
  console.log("Professor criado");
}

function setTableBody(professors = []) {
  let body = "";

  professors.forEach(function (professor) {
    body += `
        <tr>
            <td>${professor.id}</td>
            <td>${professor.cpf}</td>
            <td>${professor.name}</td>
            <td>${professor.department.name}</td>
            <td> 
            <div class="dropdown">
            <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink-${professor.id}" data-bs-toggle="dropdown" aria-expanded="false">
                Actions
            </a>
          
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink-${professor.id}">
              <li><a class="dropdown-item" href="#">Edit</a></li>
              <li><a class="dropdown-item" href="#">Remove</a></li>
            </ul>
          </div> </td>
        </tr>
      `;
  });

  tableBody.innerHTML = body;
}

async function getProfessors() {
  const response = await fetch(
    "https://professor-allocation.herokuapp.com/professors"
  );

  const data = await response.json();

  setTableBody(data);
}

getProfessors();
