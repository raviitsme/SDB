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

    if (pageId === "admins") {
      loadAdmins();
    } else if (pageId === 'teachers') {
      loadTeachers();
    } else if (pageId === 'students') {
      loadStudents();
    }
  });
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

/* ================== Dashboard Data ================== */
async function getDashboardData() {
  try {
    const response = await fetch("https://sdb-21qd.onrender.com//management/getDashboardData");
    const data = await response.json();

    if(!data.success) {
      return;
    }

    document.getElementById('totalAdmins').innerText = data.counts.admins;
    document.getElementById('totalEmployees').innerText = data.counts.employees;
    document.getElementById('totalStudents').innerText = data.counts.students;

  } catch (err) {
    console.error("Failed to get dashboard count : ",err);
  }
};

getDashboardData();

/* ================== Load Admins ================== */

async function loadAdmins() {

  const tbody = document.getElementById("adminsTableBody");
  tbody.innerHTML = `<tr><td colspan="4">Loading admins...</td></tr>`;

  try {
    const res = await fetch("https://sdb-21qd.onrender.com//management/getAdmins");
    const result = await res.json();

    tbody.innerHTML = "";

    if (!result.success || result.admins.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">No admins found</td></tr>`;
      return;
    }

    result.admins.forEach(admin => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${admin.name}</td>
        <td>${admin.user_id}</td>
        <td>${admin.email}</td>
        <td>${admin.phone}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="deleteAdmin" data-id=${admin.id}>Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("ERROR FETCHING ADMINS:", err);
    tbody.innerHTML = `<tr><td colspan="4">Server error</td></tr>`;
  }
}

function logout() {
  window.location.href = '../login/index.html'
}


const modal = document.getElementById('addAdminModal');
const addBtn = document.getElementById('add-admin');

addBtn.addEventListener('click', () => {
  modal.classList.add('active');
  document.body.classList.add('modal-open');
})

function closeAddAdmin() {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");

  // Clear all input fields
  document.getElementById("adminID").value = "";
  document.getElementById("adminName").value = "";
  document.getElementById("adminPhone").value = "";
  document.getElementById("adminEmail").value = "";
}


/* ================== Delete Admins ================== */

document.addEventListener('click', async(e) => {
  if(e.target.classList.contains('deleteAdmin')) {
    const adminId = e.target.dataset.id

    const token = localStorage.getItem('token');

    if(!confirm("Are you sure you want to delete this admin?")) {
      return;
    }
    try{
      const response = await fetch(`https://sdb-21qd.onrender.com//management/deleteAdmins/${adminId}`, {
        method : "DELETE",
        credentials : true,
        headers : {
          'Content-Type' : "application/json",
          'Authorization' : `Bearer ${token}`
        },
        body : JSON.stringify({ id : adminId }) 
      });
      const data = await response.json();
      if(!response.ok) {
        console.error("Error : ", data);
        alert(data.message || 'Something went wrong');
        return; 
      }
      if(data.success) {
        e.target.closest('tr').remove();
        alert("Admin deleted successfully.");
      } else { 
        alert(data.message);
      }
   } catch (err) {
    console.error("Error : ", err);
    alert("Server Error occurred!");
   }
  } 
});

/* ================== Load Teachers ================== */

const loadTeachers = async () => {
  const tbody = document.getElementById('teachersTableBody');
  tbody.innerHTML = `<tr><td colspan=5>Loading Teachers...</td></tr>`;

  try {
    const response = await fetch('https://sdb-21qd.onrender.com//management/getEmployees');
    const result = await response.json();

    tbody.innerHTML = '';

    if(!result.success || result.employees.length === 0) {
      tbody.innerHTML = `<tr><td colspan='5'>No Employees found.</td></tr>`
      return;
    }

    result.employees.forEach(employee => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${employee.user_id}</td>
        <td>${employee.name}</td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="deleteEmp" data-id=${employee.id}>Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error : ", err);
    tbody.innerHTML = "Failed to load teachers."
  }
}

/* ================== Delete Teachers ================== */
document.addEventListener('click', async (e) => {
  if(e.target.classList.contains('deleteEmp')) {
    
    const empId = e.target.dataset.id;
    if(!confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      const response = await fetch(`https://sdb-21qd.onrender.com//management/deleteTeachers/${empId}`, {
        method : "DELETE",
        credentials : true,
        headers : {
          'Content-Type' : "application/json"
        }
      });
      const data = await response.json();

      if(!response.ok) {
        console.error("Error Occurred : ", data);
        alert(data.message || 'Something went wrong');
        return;
      }

      if(data.success) {
        e.target.closest('tr').remove();
        alert("Employee deleted successfully.")
      } else {
        alert("Error : ", data.message);
      }
    } catch (err) {
      console.error("Server error :", err);
      alert("Failed to delete Employee.");
    }
  }  
});

// ================== Load Students ===================
async function loadStudents() {
  const tbody = document.getElementById('studentsTableBody');
  tbody.innerHTML = `<tr><td colspan='5'>Loading Students...</td></tr>`

  try {
    const response = await fetch('https://sdb-21qd.onrender.com//management/getStudents');
    const result = await response.json();

    tbody.innerHTML = '';

    if(!result.success || result.students.length === 0) {
      tbody.innerHTML = `<tr><td colspan='5'>No students found.</td></tr>`
    }

    result.students.forEach(student => {
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td>${student.user_id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.phone}</td>
        <td>
          <button class='edit'>Edit</button>
          <button class="deleteStd" data-id=${student.id}>Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err){
    console.log("Error ", err)
    console.error(err)
      tbody.innerHTML = `<tr><td colspan='5'>Server Failure</td></tr>`
  }
}

/* ================== Delete Students ================== */

document.addEventListener('click', async(e) => {
  if(e.target.classList.contains('deleteStd')) {
    const stdId = e.target.dataset.id

    if(!confirm("Are you sure you want to delete this student?")) {
      return;
    }
    try{
      const response = await fetch(`https://sdb-21qd.onrender.com//management/deleteStudents/${stdId}`, {
        method : "DELETE",
        credentials : true,
        headers : {
          'Content-Type' : "application/json"
        }
      });
      const data = await response.json();
      if(!response.ok) {
        console.error("Error : ", data);
        alert(data.message || 'Something went wrong');
        return; 
      }
      if(data.success) {
        e.target.closest('tr').remove();
        alert("Student deleted successfully.");
      } else { 
        alert(data.message);
      }
   } catch (err) {
    console.error("Error : ", err);
    alert("Server Error occurred!");
   }
  } 
});
