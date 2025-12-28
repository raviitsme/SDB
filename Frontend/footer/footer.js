document.addEventListener("DOMContentLoaded", () => {
  fetch("../footer/footer.html")
    .then(res => res.text())
    .then(html => {
      const footerPlaceholder = document.createElement("div");
      footerPlaceholder.innerHTML = html;
      document.body.appendChild(footerPlaceholder);

      // Load footer CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../footer/footer.css";
      document.head.appendChild(link);
    })
    .catch(err => console.error("Failed to load footer:", err));
});
