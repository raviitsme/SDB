const menuItems = document.querySelectorAll(".menu li[data-page]");
const pages = document.querySelectorAll(".page");
const title = document.getElementById("pageTitle");

menuItems.forEach(item => {
  item.addEventListener("click", () => {

    // Active menu
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const pageId = item.dataset.page;
    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");

    title.innerText = item.innerText.trim();

    if (pageId === 'profile') {
      getProfile();
    } else if (pageId === 'students') {
      getMyStudents();
    }

  });
});

const modal = document.getElementById("addStudentModal");
const addBtn = document.getElementById("add-std");

addBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.classList.add("modal-open");
});

function closeAddStudent() {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");

  // Clear all input fields
  document.getElementById("studentID").value = "";
  document.getElementById("studentName").value = "";
  document.getElementById("studentPhone").value = "";
  document.getElementById("studentEmail").value = "";
  document.getElementById("studentClass").value = "";
}

async function getProfile() {
  const tbody = document.getElementById('myProfileBody');
  const rows = tbody.querySelectorAll('.failed');

  rows.forEach(row => {
    row.innerText = "Fetching details..."
  })

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Invalid user.");
      return;
    }
    const response = await fetch('http://localhost:3000/employee/me', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!result.success || result.data.length === 0) {
      rows.forEach(row => {
        row.innerText = "Failed to get details."
      })
    }

    rows.forEach(row => {
      row.innerText = '';
    })
    document.getElementById('greet').innerText = `Welcome, ${result.data.name}`;
    document.getElementById('emp_name').innerText = result.data.name;
    document.getElementById('emp_id').innerText = result.data.user_id;
    document.getElementById('emp_email').innerText = result.data.email;
    document.getElementById('emp_phone').innerText = result.data.phone;

  } catch (err) {
    console.error(err);
  }

}
getProfile();

async function getMyStudents() {
  const tbody = document.getElementById('myStudentsBody');

  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:3000/employee/myStudents', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!result.success || result.students.length === 0) {
      tbody.innerHTML = `<tr><td colspan='3'>Failed to fetch details.</td></tr>`
    }

    tbody.innerHTML = '';

    result.students.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${student.name}</td>
        <td>${student.std_class}</td>
        <td>${student.user_id}</td>
        <td>${student.phone}</td>
        <td>${student.email}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error : ", err);
  }
}

async function addStudent() {
  const user_id = document.getElementById("studentID").value
  const name = document.getElementById("studentName").value
  const phone = document.getElementById("studentPhone").value
  const email = document.getElementById("studentEmail").value
  const std_class = document.getElementById("studentClass").value

  try {
    const token = localStorage.getItem('token');
  
    const response = await fetch('http://localhost:3000/employee/addStudent', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id, name, phone, email, std_class })
    });

    const result = await response.json();

    if (result.success) {
      alert(result.message);
      closeAddStudent();
      getMyStudents();
    } else {
      alert(result.message);
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }

}