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

function togglePassword(id) {
    const input = document.getElementById(id);
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
}


document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Clear previous errors
    const errorFields = document.querySelectorAll(".error");
    errorFields.forEach(err => err.textContent = "");

    const user_id = document.getElementById("user_id").value.trim();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const cpassword = document.getElementById("cpassword").value;

    // REGEX PATTERNS
    const emailRegExp = /^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const nameRegExp = /^[a-zA-Z ]+$/;
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const phoneRegExp = /^[0-9]{10}$/;

    let valid = true;

    if (!user_id) {
        document.getElementById("user_id_error").textContent = "School ID is required.";
        valid = false;
    }

    if (!nameRegExp.test(name)) {
        document.getElementById("name_error").textContent = "Name should contain only letters and spaces.";
        valid = false;
    }

    if (!emailRegExp.test(email)) {
        document.getElementById("email_error").textContent = "Invalid email format.";
        valid = false;
    }

    if (!phoneRegExp.test(phone)) {
        document.getElementById("phone_error").textContent = "Phone number must be 10 digits.";
        valid = false;
    }

    if (!passwordRegExp.test(password)) {
        document.getElementById("password_error").textContent = "Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and be at least 6 characters long.";
        valid = false;
    }

    if (password !== cpassword) {
        document.getElementById("cpassword_error").textContent = "Passwords do not match.";
        valid = false;
    }

    if (!valid) return;

    // Send data to backend if valid
    try {
        const response = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_id, name, phone, email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert("You are registered, login now.");
            window.location.href = '../login/index.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
});
