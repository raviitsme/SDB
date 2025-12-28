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
    } else if (pageId === 'attendance') {
      getAttendance();
    }
  });
});


async function getProfile() {

  const tbody = document.getElementById('myProfileBody');
  const rows = tbody.querySelectorAll('.failed')

  rows.forEach(row => {
    row.innerText = 'Fetching data...'
  })

  try {
    const token = localStorage.getItem('token');
    console.log("API")
    const response = await fetch("http://localhost:3000/student/me", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();

    if (!result.success || result.data.length === 0) {
      rows.forEach(row => {
        row.innerText = 'Failed to retrieve information.'
      })
    }
    document.getElementById('std_name').innerText = result.data.name;
    document.getElementById('std_id').innerText = result.data.user_id;
    document.getElementById('std_class').innerText = result.data.std_class;
    document.getElementById('std_email').innerText = result.data.email;
    document.getElementById('std_phone').innerText = result.data.phone;

  } catch (err) {
    console.error("Error:", err);
    rows.forEach(row => row.innerText = 'Failed to retrieve details.');
  }
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user_id')
  window.location.href = '../login/index.html';
}

async function getAttendance() {
  const tbody = document.getElementById('attendanceBody');
  tbody.innerHTML = `<tr><td colspan='4'>Fetching attendance...</td></tr>`

  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log("No token found.");
      return;
    }

    const response = await fetch('http://localhost:3000/student/myAttendance', {
      method : 'GET',
      headers : {
        'Content-Type' : "application/json",
        "Authorization" : ` Bearer ${token}`
      }
    });

    const result = await response.json();

    tbody.innerHTML = '';

    if(!result.success || result.attendances.length === 0) {
      tbody.innerHTML = `<tr><td colspan='4'>Failed to fetch attendance</td></tr>`
    }

    result.attendances.forEach(attendance => {
      const percentage = ((attendance.present/attendance.total)*100)
      const tr = document.createElement('tr')
      tr.innerHTML = `
      <td>${attendance.subject}</td>
      <td>${attendance.present}</td>
      <td>${attendance.total}</td>
      <td>${percentage}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error : ", err);
    tbody.innerHTML = `<tr><td colspan='4'>Server Error.</td></tr>`
  }

}