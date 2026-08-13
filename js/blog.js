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

  const matchesSearch = (post, term) => {
    if (term === '') {
      return true;
    }

    const title = post.querySelector('h2').textContent.toLowerCase();
    const excerpt = post.querySelector('.excerpt').textContent.toLowerCase();
    return title.includes(term) || excerpt.includes(term);
  };

  const matchesTags = (post) => {
    if (activeTags.size === 0) {
      return true;
    }

    const postTags = (post.dataset.tags || '').split(',').map((tag) => tag.trim().toLowerCase());
    return [...activeTags].every((tag) => postTags.includes(tag));
  };

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
