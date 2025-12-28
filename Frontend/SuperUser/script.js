const roleSelect = document.getElementById('role')
const classMenu = document.getElementById('std_class')

function toggleDropDown() {
  if(roleSelect.value === 'student'){
    classMenu.style.display = 'block'
  } else {
    classMenu.style.display = 'none'
  }
}

toggleDropDown()
roleSelect.addEventListener('change', toggleDropDown);

function showPage(pageId, el) {

  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  document.getElementById(pageId).classList.add('active');

  document.querySelectorAll('.side-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  el.classList.add('active');

  const titles = {
    dashboard: "Dashboard Overview",
    addUser: "Add New User",
    students: "Students",
    employees: "Employees"
  };
  if(pageId === 'employees') {
    getEmployees();
  } else if (pageId === 'students') {
    getStudents();
  }
  document.getElementById("pageTitle").innerText = titles[pageId];
}

function logout() {
  window.location.href = '../login/index.html';
} 

async function addUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const std_class = document.getElementById('std_class').value;
    const status = document.getElementById('status');
    console.log("Add user function called");
    console.log({ name, email, role, std_class });

    const token = localStorage.getItem('token');

    if (!name || !email) {
        status.textContent = 'Fill all fields';
        status.style.color = 'red';
        return;
    }
    try {
        const response = await fetch("http://localhost:3000/auth/createUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, role, std_class })
        });
        const data = await response.json();
        console.log("Create user response : ", data);

        if (!response.ok) {
            console.error("Server error:", data);
            alert(data.message || "Something went wrong");
            return;
        } 
        
        if (data.success) {
            status.textContent = `${role.toUpperCase()} created, email is sent and user id is : ${data.user_id}`;
            status.style.color = '#070707ff';
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById('std_class').value = "01";
            document.getElementById("role").value = "student";
        } else {
            status.textContent = data.message;
            status.style.color = "red";
        }
    } catch (err) {
        console.error("Server Error : ", err);
        status.textContent = "Server not reachable";
        status.style.color = "red";
    }
}

// ================== Fetch Employees ===================
async function getEmployees() {
  const tbody = document.getElementById('employeesTableBody');
  tbody.innerHTML = `<tr><td colspan='5'>Loading employees...</td></tr>`

  try {
    const response = await fetch('http://localhost:3000/superUser/getEmployees');
    const result = await response.json();

    tbody.innerHTML = '';

    if(!result.success || result.employees.length === 0) {
      tbody.innerHTML = `<tr><td colspan='5'>No employees found.</td></tr>`
    }

    result.employees.forEach(employee => {
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td>${employee.user_id}</td>
        <td>${employee.name}</td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>
          <button class='edit'>Edit</button>
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

// ================== Fetch Students ===================
async function getStudents() {
  const tbody = document.getElementById('studentsTableBody');
  tbody.innerHTML = `<tr><td colspan='5'>Loading Students...</td></tr>`

  try {
    const response = await fetch('http://localhost:3000/superUser/getStudents');
    const result = await response.json();

    tbody.innerHTML = '';

    if(!result.success || result.students.length === 0) {
      tbody.innerHTML = `<tr><td colspan='5'>Failed to get students.</td></tr>`
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