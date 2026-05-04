/**
 * Blog Pagination Module
 * Handles pagination for both the main blog list and search results.
 * Listens for "blogContentUpdated" events to refresh when content changes.
 */
addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const blogListHtml = document.querySelector(".blog-list");

  let blogList;
  const prevBtn = document.querySelector(".blog-pagination .pagination-btn:first-child");
  const nextBtn = document.querySelector(".blog-pagination .pagination-btn:last-child");
  const pageNumbersContainer = document.querySelector(".page-numbers");

  // Pagination state
  let posts;
  const postsPerPage = 5;
  let totalPages;

  let currentPage = 1;

  /**
   * Updates pagination variables based on the active container
   * Detects whether to paginate the main blog list or search results
   */
  const updateVariables = () => {
    let parentContainer;

    // Check which container is visible and update accordingly
    if (blogListHtml.style.display === "none") {
      parentContainer = "#search-results";
      blogList = document.getElementById("search-results");
    } else {
      parentContainer = ".blog-list";
      blogList = blogListHtml;
    }

    posts = Array.from(document.querySelectorAll(`${parentContainer} .blog-item`));
    totalPages = Math.ceil(posts.length / postsPerPage);
  };

  /**
   * Renders a specific page of blog posts
   * @param {number} page - The page number to render (1-indexed)
   */
  const renderPage = (page) => {
    let pageToRender = page;

    // Ensure page is within valid range
    if (pageToRender < 1) {
      pageToRender = 1;
    } else if (pageToRender > totalPages) {
      pageToRender = totalPages;
    }

    currentPage = pageToRender;

    // Hide all posts
    posts.forEach((post) => (post.style.display = "none"));

    // Show posts for the current page
    const startIndex = (pageToRender - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    posts.slice(startIndex, endIndex).forEach((post) => (post.style.display = ""));

    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Update active page number
    document.querySelectorAll(".page-number").forEach((btn, index) => {
      btn.classList.toggle("active", index + 1 === currentPage);
    });

    // Scroll to top ob the blog list
    blogList.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /**
   * Initializes pagination controls by creating page number buttons
   * Clears existing buttons and generates new ones based on total_pages
   */
  const initializePagination = () => {
    // Clear existing page numbers
    pageNumbersContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.classList.add("page-number");
      pageBtn.textContent = i;

      if (i === 1) {
        pageBtn.classList.add("active");
      }

      pageBtn.addEventListener("click", () => renderPage(i));
      pageNumbersContainer.appendChild(pageBtn);
    }
  };

  /**
   * Refreshes the entire pagination system
   * Updates variables, reinitializes controls, and renders the first page
   */
  const refreshPagination = () => {
    updateVariables();
    initializePagination();
    renderPage(1);
  };

  // Listen for content updates from search/filter module
  document.addEventListener("blogContentUpdated", refreshPagination);

  // Navigation button event listeners
  prevBtn.addEventListener("click", () => renderPage(currentPage - 1));
  nextBtn.addEventListener("click", () => renderPage(currentPage + 1));

  refreshPagination();
});
