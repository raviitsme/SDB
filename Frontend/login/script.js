const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];
let hue = 0;

const mouse = { x: null, y: null };

// Auto-spawn random particles permanently
setInterval(() => {
    hue++;
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        hue: hue,
        color: `hsl(${hue}, 100%, 50%)`,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2
    });
}, 30);

// Mouse-spawn particles
canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    for (let i = 0; i < 4; i++) {
        hue++;
        particles.push({
            x: mouse.x,
            y: mouse.y,
            size: 3,
            hue: hue,
            color: `hsl(${hue}, 100%, 50%)`,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5
        });
    }
});

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.size -= 0.02;

        if (p.size <= 0) {
            particles.splice(i, 2);
            i--;
            continue;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 50) {
                ctx.strokeStyle = particles[a].color;
                ctx.lineWidth = 0.2;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.11)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    handleParticles();
    connectParticles();
    requestAnimationFrame(animate);
}

animate();
function openForgot() {
    document.getElementById("forgotContainer").style.display = "flex";
}

function closeForgot() {
    document.getElementById("forgotContainer").style.display = "none";

    document.getElementById("stepUser-Id").style.display = "block";
    document.getElementById("stepOTP").style.display = "none";
    document.getElementById("stepPassword").style.display = "none";

    // optional: inputs reset
    document.getElementById("forgotEmail").value = "";
    document.getElementById("otpInput").value = "";
    document.getElementById("passwordInput").value = "";
    document.getElementById("confirmPasswordInput").value = "";
}


async function sendOTP() {
    const user_id = document.getElementById("forgotEmail").value;
    if (!user_id) return alert("Enter User ID");

    try {
        const response = await fetch("https://sdb-21qd.onrender.com/auth/forgotPassword", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id })
        });
        const data = await response.json({ user_id })

        if (!data.success) {
            alert(data.message);
            return;
        }

        alert("OTP sent to registerd email!");

        console.log("Send OTP to:", user_id);

        document.getElementById("stepUser-Id").style.display = "none";
        document.getElementById("stepOTP").style.display = "block";
    } catch (err) {
        console.error(err)
    }
}

async function verifyOTP() {
    const otp = document.getElementById("otpInput").value;
    const user_id = document.getElementById("forgotEmail").value;
    if (!otp) return alert("Enter OTP");

    const response = await fetch("https://sdb-21qd.onrender.com/auth/verifyOTP", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id, otp })
    });
    const result = await response.json();

    if (!result.success) {
        alert(result.message);
        return;
    }

    alert(result.message);

    console.log("Verify OTP:", otp);
    document.getElementById('stepOTP').style.display = 'none';
    document.getElementById('stepPassword').style.display= 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.password-field i').forEach(icon => {
        icon.addEventListener('click', () => {
            const inputs = icon.parentElement.querySelectorAll('input')

            if(!inputs) {
                return;
            }

            inputs.forEach(input => {
                icon.classList.add('pop')

                setTimeout(() => {
                    icon.classList.remove('pop')

                    if(input.type === 'password') {
                        input.type = 'text';
                        icon.classList.replace('fa-eye', 'fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.replace('fa-eye-slash', 'fa-eye');
                    }
                }, 120);
            });
        });
    });
});

async function resetPass() {
    const user_id = document.getElementById('forgotEmail').value;
    const newPass = document.getElementById('passwordInput').value;
    const confirmNewPass = document.getElementById('confirmPasswordInput').value;

    if(!newPass || newPass !== confirmNewPass) {
        alert("Invalid Inputs.")
        return;
    }

    try {
        
        const response = await fetch('https://sdb-21qd.onrender.com/auth/resetPass', {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ user_id, newPass })
        });

        const result = await response.json();

        if(!result.success) {
            alert(result.message);
        }
        
        alert(result.message);
        closeForgot();
    } catch (err) {
        console.error(err);
    }
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://sdb-21qd.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("Login response:", data);

        if (!data.success) {
            alert(data.message || 'Login failed');
            return;
        }

        localStorage.setItem('token', data.token);

        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', data.user.user_id);


        if (data.success) {
            alert(`Logged in as: ${data.role}`);

            if (data.role === "admin") {
                window.location.href = "../admin/index.html";
            } else if (data.role === "employee") {
                window.location.href = "../employee/index.html";
            } else if (data.role === "student") {
                window.location.href = "../student/index.html";
            } else if (data.role === 'SuperUser') {
                window.location.href = "../SuperUser/index.html";
            }
        } else {
            alert("Invalid Email or Password.");
        }
    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".input-group i").forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.parentElement.querySelector("input");
            if (!input) return;

            // pop animation
            icon.classList.add("pop");

            setTimeout(() => {
                icon.classList.remove("pop");

                if (input.type === "password") {
                    input.type = "text";
                    icon.classList.replace("fa-eye", "fa-eye-slash");
                } else {
                    input.type = "password";
                    icon.classList.replace("fa-eye-slash", "fa-eye");
                }
            }, 120);
        });
    });
});
