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
});