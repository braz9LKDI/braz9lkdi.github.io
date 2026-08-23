document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('blog-search-input');
  const searchBtn = document.getElementById('blog-search-btn');
  const searchStatus = document.getElementById('search-status');
  const blogList = document.querySelector('.blog-list');
  const tagButtons = document.querySelectorAll('.blog-filters .tech-tags .tag');
  const prevBtn = document.querySelector('.blog-pagination .pagination-btn:first-child');
  const nextBtn = document.querySelector('.blog-pagination .pagination-btn:last-child');
  const pageNumbers = document.querySelector('.page-numbers');

  const blogItems = Array.from(document.querySelectorAll('.blog-item'));
  const activeTags = new Set();
  const POSTS_PER_PAGE = 5;

  let visible = blogItems;
  let currentPage = 1;

  const totalPages = () => Math.ceil(visible.length / POSTS_PER_PAGE);

  /**
   * Tests whether a post matches the current search term.
   *
   * Only the title and excerpt are searched, not the post body, which is not present on the index
   * page. An empty term matches everything so that clearing the box restores the full list.
   *
   * @param {HTMLElement} post: a `.blog-item` article element.
   * @param {string} term: lowercase, trimmed search term.
   * @returns {boolean}: true when the post should stay visible.
   */
  const matchesSearch = (post, term) => {
    if (term === '') {
      return true;
    }

    const title = post.querySelector('h2').textContent.toLowerCase();
    const excerpt = post.querySelector('.excerpt').textContent.toLowerCase();
    return title.includes(term) || excerpt.includes(term);
  };

  /**
   * Tests whether a post carries every currently active tag.
   *
   * Selected tags combine with AND, not OR, so each additional tag narrows the list further. With
   * no tags selected every post matches.
   *
   * @param {HTMLElement} post: a `.blog-item` article element.
   * @returns {boolean}: true when the post should stay visible.
   */
  const matchesTags = (post) => {
    if (activeTags.size === 0) {
      return true;
    }

    const postTags = (post.dataset.tags || '').split(',').map((tag) => tag.trim().toLowerCase());
    return [...activeTags].every((tag) => postTags.includes(tag));
  };

  /**
   * Shows one page of the filtered posts and syncs the pagination controls.
   *
   * Hides every post before revealing the current slice, so posts dropped by the filter cannot
   * linger. The requested page is clamped into range, which lets callers pass `currentPage +- 1`
   * without bounds checks of their own. An empty result set resets to page one and disables both
   * arrows.
   *
   * Mutates `currentPage` and the DOM.
   *
   * @param {number} page: 1-based page to show; clamped to the available range.
   * @param {boolean} [shouldScroll=true]: whether to scroll the list into view, suppressed when a new filter has already reset the view.
   */
  const renderPage = (page, shouldScroll = true) => {
    blogItems.forEach((post) => {
      post.style.display = 'none';
    });

    if (totalPages() === 0) {
      currentPage = 1;
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    currentPage = Math.min(Math.max(page, 1), totalPages());

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    visible.slice(startIndex, endIndex).forEach((post) => {
      post.style.display = '';
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages();

    pageNumbers.querySelectorAll('.page-number').forEach((btn, index) => {
      btn.classList.toggle('active', index + 1 === currentPage);
    });

    if (shouldScroll) {
      blogList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Rebuilds the numbered page buttons for the current result set.
   *
   * Replaces the existing buttons outright, since the page count changes whenever the filter does.
   */
  const renderPagination = () => {
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages(); i++) {
      const pageBtn = document.createElement('button');

      pageBtn.type = 'button';
      pageBtn.className = 'page-number';
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => renderPage(i));

      pageNumbers.appendChild(pageBtn);
    }
  };

  /**
   * Recomputes the visible posts from the search term and active tags, then re-renders.
   *
   * Search and tags combine with AND. Always returns to page one, because the page the reader was
   * on rarely exists in the new result set. Updates the `search-status` live region so screen
   * readers hear the new count.
   *
   * Mutates `visible` and the DOM.
   */
  const applyFilters = () => {
    const term = searchInput.value.toLowerCase().trim();
    visible = blogItems.filter((post) => matchesSearch(post, term) && matchesTags(post));

    if (visible.length === 0) {
      searchStatus.textContent = 'No posts found';
    } else {
      searchStatus.textContent = `${visible.length} post${visible.length === 1 ? '' : 's'} found`;
    }

    renderPagination();
    renderPage(1, false);
  };

  searchBtn.addEventListener('click', applyFilters);
  searchInput.addEventListener('input', applyFilters);

  tagButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const willBeActive = !activeTags.has(btn.dataset.tag);

      if (willBeActive) {
        activeTags.add(btn.dataset.tag);
      } else {
        activeTags.delete(btn.dataset.tag);
      }

      btn.classList.toggle('active', willBeActive);
      btn.setAttribute('aria-pressed', String(willBeActive));
      applyFilters();
    });
  });

  prevBtn.addEventListener('click', () => renderPage(currentPage - 1));
  nextBtn.addEventListener('click', () => renderPage(currentPage + 1));

  applyFilters(); // Initial render
});
