/**
 * Blog search and filter module.
 * Handles searching blog posts by text and filtering by tags.
 * Dispatches custom events to notify pagination when content changes.
 */
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const searchInput = document.getElementById("blog-search-input");
  const searchBtn = document.getElementById("blog-search-btn");
  const searchResults = document.getElementById("search-results");
  const blogItems = document.querySelectorAll(".blog-item");

  // State variables
  let currentTerm = "";
  let currentResults = Array.from(blogItems);

  const tagButtons = document.querySelectorAll(".blog-filters .tech-tags .tag");
  const activeTags = new Set();

  /**
   * Dispatches a custom event to notify pagination that content has been updated.
   */
  const notifyPaginationUpdate = () => {
    document.dispatchEvent(new CustomEvent("blogContentUpdated"));
  };

  /**
   * Checks if a blog post matches the search term.
   * @param {HTMLElement} post - The blog post element to check.
   * @param {string} term - The search term to match against.
   * @returns {boolean} True if the post title or excerpt contains the search term.
   */
  const doesPostMatchSearch = (post, term) => {
    const title = post.querySelector("h2").textContent.toLocaleLowerCase();
    const excerpt = post.querySelector(".excerpt").textContent.toLocaleLowerCase();

    return title.includes(term) || excerpt.includes(term);
  };

  /**
   * Filters current results based on active tag selections.
   * Only shows posts that have ALL active tags.
   */
  const filterByTags = () => {
    currentResults = currentResults.filter((post) => {
      const postTags = post.dataset.tags?.split(",").map((tag) => tag.trim().toLowerCase()) || [];
      const matchesTags =
        activeTags.size === 0 ? true : !postTags.some((tag) => !activeTags.has(tag));

      return matchesTags;
    });
  };

  /**
   * Performs a search based on the input value.
   * Filters posts by search term and active tags, then displays results.
   */
  const performSearch = () => {
    currentTerm = searchInput.value.toLowerCase().trim();

    // If search is empty, clear results and show all posts
    if (currentTerm === "") {
      searchResults.innerHTML = "";
      document.querySelector(".blog-list").style.display = "block";
      return;
    }

    // Filter posts by search term
    currentResults = Array.from(blogItems).filter((post) => doesPostMatchSearch(post, currentTerm));

    filterByTags();
    displaySearchResults();
  };

  /**
   * Displays search results in the search results container.
   */
  const displaySearchResults = () => {
    const resultsLength = currentResults.length;
    document.querySelector(".blog-list").style.display = "none";

    if (resultsLength === 0) {
      const activeTagsString = Array.from(activeTags).join(", ");
      searchResults.innerHTML = `<p> No results found for "${currentTerm}"${activeTagsString ? ` and ${activeTagsString} tags` : ""}</p>`;
      return;
    }

    searchResults.innerHTML = `<p> Found ${resultsLength} results for "${currentTerm}" </p>`;

    const resultsList = document.createElement("div");
    resultsList.className = "search-results-list";

    currentResults.forEach((post) => {
      resultsList.appendChild(post.cloneNode(true));
    });

    searchResults.appendChild(resultsList);

    notifyPaginationUpdate();
  };

  // Event listeners
  searchBtn.addEventListener("click", performSearch);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Tag filter buttons - toggle active state and update visibility
  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;

      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove("active");
      } else {
        activeTags.add(tag);
        btn.classList.add("active");
      }

      displaySearchResults();
    });
  });
});
