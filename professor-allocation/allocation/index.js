const baseURL = "https://professor-allocation.herokuapp.com";
const tableBody = document.getElementById("table-body");

const dayOfWeek = document.getElementById("dayOfWeek");
const course = document.getElementById("course");
const professor = document.getElementById("professor");
const startHour = document.getElementById("startHour");
const endHour = document.getElementById("endHour");
const primaryKey = document.getElementById("primary-key");

function formatTime(time) {
  return time.split("+")[0];
}

async function doFetch(...params) {
  const response = await fetch(...params);

  const data = response.json();

  return data;
}

async function saveChanges(event) {
  event.preventDefault();

  const modalElement = document.getElementById("modal");
  const modal = bootstrap.Modal.getInstance(modalElement);

  const allocation = {
    professorId: professor.value,
    dayOfWeek: dayOfWeek.value,
    startHour: startHour.value + "+0000",
    endHour: endHour.value + "+0000",
    courseId: course.value,
  };

  let response;

  const options = {
    body: JSON.stringify(allocation),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  };

  if (primaryKey.value) {
    response = await fetch(`${baseURL}/allocations/${primaryKey.value}`, {
      ...options,
      method: "PUT",
    });
  } else {
    response = await fetch(`${baseURL}/allocations`, options);
  }

  if (response.ok) {
    await getAllocations();

    modal.hide();
  } else {
    const modalAlert = document.getElementById("modal-alert");

    modalAlert.classList.remove("d-none");
    modalAlert.innerText = "Erro ao salvar informações.";
  }
}

function openModal(title) {
  const modal = new bootstrap.Modal(document.getElementById("modal"));

  document.querySelector("h5.modal-title").innerHTML = title;

  primaryKey.value = "";

  modal.show();
}

async function openEditModal(allocationId) {
  openModal("Update Allocation");

  primaryKey.value = allocationId;

  const response = await fetch(`${baseURL}/allocations/${allocationId}`);

  const data = await response.json();

  dayOfWeek.value = data.dayOfWeek;
  startHour.value = formatTime(data.startHour);
  endHour.value = formatTime(data.endHour);
  professor.value = data.professor.id;
  course.value = data.course.id;
}

async function removeData(allocationId) {
  const response = await fetch(`${baseURL}/allocations/${allocationId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    await getAllocations();
  } else {
    alert("Oops... Error to delete Allocation.");
  }
}

function setOptionList(rows = [], elementId) {
  const element = document.getElementById(elementId);

  let body = "";

  rows.forEach(function (row) {
    body += `<option value="${row.id}">${row.name}</option>`;
  });

  element.innerHTML = body;
}

function setTableBody(rows = []) {
  let body = "";

  rows.forEach(function (row) {
    console.log({ row });
    body += `
        <tr>
            <td>${row.id}</td>
            <td>${row.dayOfWeek}</td>
            <td>${formatTime(row.startHour)}</td>
            <td>${formatTime(row.endHour)}</td>
            <td>${row.professor.name}</td>
            <td>${row.professor.department.name}</td>
            <td>${row.course.name}</td>
            <td> 
            <div class="dropdown">
            <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink-${
              row.id
            }" data-bs-toggle="dropdown" aria-expanded="false">
                Actions
            </a>
          
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink-${
              row.id
            }">
              <li onclick="openEditModal(${
                row.id
              })"><a class="dropdown-item" href="#">Edit</a></li>
              <li onclick="removeData(${
                row.id
              })"><a class="dropdown-item">Remove</a></li>
            </ul>
          </div> </td>
        </tr>
      `;
  });

  tableBody.innerHTML = body;
}

async function getAllocations() {
  const response = await doFetch(`${baseURL}/allocations`);

  setTableBody(response);
}

async function getProfessors() {
  const response = await doFetch(`${baseURL}/professors`);

  setOptionList(response, "professor");
}

async function getCourses() {
  const response = await doFetch(`${baseURL}/courses`);

  setOptionList(response, "course");
}

async function getInitialData() {
  await Promise.all([getAllocations(), getProfessors(), getCourses()]);
}

getInitialData();
