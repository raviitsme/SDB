document.addEventListener("DOMContentLoaded", () => {

  // Example: Update page title dynamically
  window.updatePageTitle = (title) => {
    const pageTitle = document.querySelector(".site-title");
    if (pageTitle) pageTitle.innerText = title;
  }

});

document.addEventListener("DOMContentLoaded", () => {
  fetch("../header/header.html")
    .then(res => res.text())
    .then(html => {
      const headerPlaceholder = document.createElement("div");
      headerPlaceholder.innerHTML = html;

      // add header at TOP
      document.body.prepend(headerPlaceholder);

      // load header CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../header/header.css";
      document.head.appendChild(link);
    })
    .catch(err => console.error("Failed to load header:", err));
});
