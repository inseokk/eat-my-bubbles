// left_bar.js

document.addEventListener("DOMContentLoaded", () => {
  // Get the left bar element from the HTML.
  const leftBar = document.querySelector(".left-bar");

  if (!leftBar) {
    console.warn("No element with the class 'left-bar' found in the HTML.");
    return;
  }

  // Updated functionality: Toggle an 'expanded' class when the left bar is clicked.
  leftBar.addEventListener("click", () => {
    leftBar.classList.toggle("expanded");
  });

  function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const toggleButton = document.getElementById("toggleButton");
    const mainContent = document.getElementById("main");

    if (sidebar.classList.contains("collapsed")) {
      sidebar.classList.remove("collapsed");
      toggleButton.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
      if (mainContent) {
        mainContent.style.marginLeft = sidebar.offsetWidth + "px";
      }
    } else {
      sidebar.classList.add("collapsed");
      toggleButton.innerHTML = '<span class="material-symbols-outlined">menu</span>';
      if (mainContent) {
        mainContent.style.marginLeft = "0";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById("mySidebar");
    const toggleButton = document.getElementById("toggleButton");
    const mainContent = document.getElementById("main");

    if (sidebar.classList.contains("collapsed")) {
      toggleButton.innerHTML = '<span class="material-symbols-outlined">menu</span>';
      if (mainContent) {
        mainContent.style.marginLeft = "0";
      }
    } else {
      toggleButton.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
      if (mainContent) {
        mainContent.style.marginLeft = sidebar.offsetWidth + "px";
      }
    }
  });
});