const baseURL = "https://professor-allocation.herokuapp.com";
const tableBody = document.getElementById("table-body");

const cpf = document.getElementById("cpf");
const department = document.getElementById("department");
const name = document.getElementById("name");
const primaryKey = document.getElementById("primary-key");

async function saveProfessor(event) {
  event.preventDefault();

  const professorModal = document.getElementById("professorModal");
  const modal = bootstrap.Modal.getInstance(professorModal);

  const professor = {
    name: name.value,
    cpf: cpf.value,
    departmentId: department.value,
  };

  let response;

  const options = {
    body: JSON.stringify(professor),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  };

  if (primaryKey.value) {
    response = await fetch(`${baseURL}/professors/${primaryKey.value}`, {
      ...options,
      method: "PUT",
    });
  } else {
    response = await fetch(`${baseURL}/professors`, options);
  }

  if (response.ok) {
    await getProfessors();

    modal.hide();
  } else {
    const modalAlert = document.getElementById("modal-alert");

    modalAlert.classList.remove("d-none");
    modalAlert.innerText = "CPF já existe.";
  }
}

function openModal(title) {
  const modal = new bootstrap.Modal(document.getElementById("professorModal"));

  document.querySelector("h5.modal-title").innerHTML = title;

  primaryKey.value = "";

  modal.show();
}

async function openModalEditProfessor(professorId) {
  openModal("Update Professor");

  primaryKey.value = professorId;

  const response = await fetch(`${baseURL}/professors/${professorId}`);

  const data = await response.json();

  name.value = data.name;
  cpf.value = data.cpf;
  department.value = data.department.id;
}

async function removeProfessor(professorId) {
  const response = await fetch(`${baseURL}/professors/${professorId}`, {
    method: "DELETE",
  });

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
              <li onclick="openModalEditProfessor(${professor.id})"><a class="dropdown-item" href="#">Edit</a></li>
              <li onclick="removeProfessor(${professor.id})"><a class="dropdown-item">Remove</a></li>
            </ul>
          </div> </td>
        </tr>
      `;
  });

  tableBody.innerHTML = body;
}

async function getProfessors() {
  const response = await fetch(`${baseURL}/professors`);

  const data = await response.json();

  setProfessorTableBody(data);
}

async function getDepartments() {
  const response = await fetch(`${baseURL}/departments`);

  const data = await response.json();

  setDepartmentOptionList(data);
}

getProfessors();
getDepartments();
