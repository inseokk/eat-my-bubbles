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

  let searchInput = null; // Will hold the search input overlay element

  // Function to create (or return if already created) the search input overlay.
  function createSearchInput() {
    if (!searchInput) {
      searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.placeholder = "Search PDF...";

      // Style the search input overlay.
      searchInput.style.position = "fixed";
      searchInput.style.top = "20px";
      searchInput.style.right = "20px";
      searchInput.style.zIndex = "1000";
      searchInput.style.padding = "8px";
      searchInput.style.fontSize = "16px";
      searchInput.style.border = "1px solid #ccc";
      searchInput.style.borderRadius = "4px";

      // Append the search input to the document body.
      document.body.appendChild(searchInput);

      // Listen for input events to perform the search as the user types.
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value;
        searchPDF(query);
      });
    }
    return searchInput;
  }

  // Function to show and focus the search input.
  function showSearchInput() {
    const input = createSearchInput();
    input.style.display = "block";
    input.focus();
  }

  // Function to hide the search input and clear any highlights.
  function hideSearchInput() {
    if (searchInput) {
      searchInput.style.display = "none";
      clearHighlights();
    }
  }

  // Listen for clicks on the search button.
  const searchButton = document.querySelector(".search-button");
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      // Toggle the visibility of the search input.
      if (!searchInput || searchInput.style.display === "none") {
        showSearchInput();
      } else {
        hideSearchInput();
      }
    });
  } else {
    console.warn("No element with the class 'search-button' was found.");
  }

  // Listen for global keydown events to catch CMD+F / CTRL+F.
  document.addEventListener("keydown", (e) => {
    // Check if CTRL or CMD is pressed along with the "f" key.
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
      e.preventDefault(); // Prevent the browser's default find action.
      showSearchInput();
    }
  });

  // Function to search for query text in PDF text layers.
  function searchPDF(query) {
    // Clear any previous highlights.
    clearHighlights();
    if (!query) return;

    // Query all spans inside elements with the class "textLayer".
    const textSpans = document.querySelectorAll(".textLayer span");
    textSpans.forEach((span) => {
      // Check if the span's text contains the search query (case-insensitive).
      if (span.innerText.toLowerCase().includes(query.toLowerCase())) {
        span.classList.add("highlight");
      }
    });
  }

  // Function to remove the highlight class from all spans.
  function clearHighlights() {
    const highlighted = document.querySelectorAll(".highlight");
    highlighted.forEach((span) => {
      span.classList.remove("highlight");
    });
  }

  // --- COLLAPSE BUTTON FUNCTIONALITY ---

  // Attempt to find an existing collapse button.
  let collapseButton = document.querySelector(".collapse-button");

  // If it doesn't exist, create it.
  if (!collapseButton) {
    collapseButton = document.createElement("button");
    collapseButton.classList.add("collapse-button");
    // Using a Material Symbol for the collapse icon.
    collapseButton.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    // Style the collapse button if not handled by CSS.
    collapseButton.style.position = "absolute";
    collapseButton.style.top = "10px";
    collapseButton.style.right = "10px";
    collapseButton.style.zIndex = "1100";
    collapseButton.style.backgroundColor = "#00374A";
    collapseButton.style.color = "#ffffff";
    collapseButton.style.border = "none";
    collapseButton.style.padding = "4px 8px";
    collapseButton.style.borderRadius = "4px";
    collapseButton.style.cursor = "pointer";
    leftBar.appendChild(collapseButton);
  }

  // Attach the event listener to the collapse button.
  collapseButton.addEventListener("click", () => {
    // Toggle collapsed state: if collapsed, expand it; otherwise, collapse it.
    if (leftBar.classList.contains("collapsed")) {
      // Expand the left bar.
      leftBar.style.width = "80px";  // Normal width; adjust as needed.
      leftBar.classList.remove("collapsed");
    } else {
      // Collapse the left bar.
      leftBar.style.width = "40px";   // Collapsed width; adjust as needed.
      leftBar.classList.add("collapsed");
    }
  });
});