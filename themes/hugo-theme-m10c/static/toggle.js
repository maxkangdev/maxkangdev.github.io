document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const currentTheme = localStorage.getItem("theme") || "dark";

  // Apply saved theme and icon
  document.documentElement.classList.toggle("light-mode", currentTheme === "light");
  themeIcon.classList.toggle("fa-moon", currentTheme === "dark");
  themeIcon.classList.toggle("fa-sun", currentTheme === "light");

  toggleButton.addEventListener("click", () => {
    const isLightMode = document.documentElement.classList.toggle("light-mode");
    const newTheme = isLightMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);

    themeIcon.classList.toggle("fa-moon", !isLightMode);
    themeIcon.classList.toggle("fa-sun", isLightMode);
  });
});
