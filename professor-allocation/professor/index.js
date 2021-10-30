const tableBody = document.getElementById("table-body");

async function createProfessor(event) {
  event.preventDefault();

  const professorModal = document.getElementById("professorModal");
  const modal = bootstrap.Modal.getInstance(professorModal);

  const name = document.getElementById("name");
  const cpf = document.getElementById("cpf");
  const department = document.getElementById("department");

  const professor = {
    name: name.value,
    cpf: cpf.value,
    departmentId: department.value,
  };

  const response = await fetch(
    "https://professor-allocation.herokuapp.com/professors",
    {
      method: "POST",
      body: JSON.stringify(professor),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) {
    await getProfessors();

    modal.hide();
  } else {
    const modalAlert = document.getElementById("modal-alert");

    modalAlert.classList.remove("d-none");
    modalAlert.innerText = "CPF já existe.";
  }
}

async function removeProfessor(professorId) {
  const response = await fetch(
    `https://professor-allocation.herokuapp.com/professors/${professorId}`,
    {
      method: "DELETE",
    }
  );

  if (response.ok) {
    await getProfessors();
  } else {
    alert("Oops... Error to delete Professor.");
  }
}

function setDepartmentOptionList(departments = []) {
  const department = document.getElementById("department");

  let body = "";

  departments.forEach(function (department) {
    body += `<option value="${department.id}">${department.name}</option>`;
  });

  department.innerHTML = body;
}

function setProfessorTableBody(professors = []) {
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
              <li onclick="removeProfessor(${professor.id})"><a class="dropdown-item">Remove</a></li>
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

  setProfessorTableBody(data);
}

async function getDepartments() {
  const response = await fetch(
    "https://professor-allocation.herokuapp.com/departments"
  );

  const data = await response.json();

  setDepartmentOptionList(data);
}

getProfessors();
getDepartments();
