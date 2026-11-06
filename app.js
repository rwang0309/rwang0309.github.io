(() => {
  const zh = document.documentElement.lang === 'zh-CN';
  const page = document.body.dataset.page;
  const legacyPages = ['research','publications','teaching','alumni'];
  const legacyPage = location.hash.slice(1);
  if (page === 'home' && legacyPage === 'about') {
    location.replace('index.html#biography');
    return;
  }
  if (page === 'home' && legacyPage === 'projects') {
    location.replace('index.html');
    return;
  }
  if (page === 'home' && legacyPages.includes(legacyPage)) {
    location.replace(`${legacyPage}.html`);
    return;
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label',zh?'展开导航':'Open navigation');
  }
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?(zh?'收起导航':'Close navigation'):(zh?'展开导航':'Open navigation'));
  });
  nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  document.addEventListener('click',event=>{if(!event.target.closest('.header-inner'))closeMenu();});

  if (page !== 'publications') return;
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const papers = [...document.querySelectorAll('.publication')];
  const languageLink = document.querySelector('.language-switch');
  const languageBase = languageLink.getAttribute('href');
  const emptyMessage = document.querySelector('.publications-empty');
  const filters = { topic: 'all', kind: 'all' };

  function readFilters() {
    const params = new URLSearchParams(location.search);
    for (const group of Object.keys(filters)) {
      const selected = params.get(group);
      const valid = buttons.some(button => button.dataset.filterGroup === group && button.dataset.filter === selected);
      filters[group] = valid ? selected : 'all';
    }
  }

  function filterPapers(updateURL) {
    buttons.forEach(button => {
      const active = button.dataset.filter === filters[button.dataset.filterGroup];
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    papers.forEach(paper => {
      paper.hidden = (filters.topic !== 'all' && paper.dataset.topic !== filters.topic)
        || (filters.kind !== 'all' && paper.dataset.kind !== filters.kind);
    });
    emptyMessage.hidden = papers.some(paper => !paper.hidden);
    const params = new URLSearchParams(location.search);
    for (const [group, value] of Object.entries(filters)) {
      if (value === 'all') params.delete(group);
      else params.set(group, value);
    }
    const query = params.toString() ? `?${params}` : '';
    languageLink.setAttribute('href', languageBase + query + location.hash);
    if (updateURL && location.protocol !== 'file:') {
      history.replaceState(null, '', location.pathname + query + location.hash);
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    filters[button.dataset.filterGroup] = button.dataset.filter;
    filterPapers(true);
  }));
  readFilters();
  filterPapers(false);
  window.addEventListener('popstate', () => {
    readFilters();
    filterPapers(false);
  });
})();
