document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const currentTheme = localStorage.getItem("theme") || "dark";

  // Apply saved theme and icon
  document.documentElement.classList.toggle("light-mode", currentTheme === "light");
  themeIcon.classList.toggle("fa-moon", currentTheme === "dark");
  themeIcon.classList.toggle("fa-sun", currentTheme === "light");

  function changeGiscusTheme (theme) {
    function sendMessage(message) {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (!iframe) return;
      iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }

    sendMessage({
      setConfig: {
        theme: theme
      }
    });
  }

  // Toggle theme on button click
  toggleButton.addEventListener("click", () => {
    const isLightMode = document.documentElement.classList.toggle("light-mode");
    const newTheme = isLightMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);

    themeIcon.classList.toggle("fa-moon", !isLightMode);
    themeIcon.classList.toggle("fa-sun", isLightMode);

    // Update Giscus theme
    changeGiscusTheme(newTheme);
  });
});
