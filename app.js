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
  const topics = buttons.map(button=>button.dataset.filter);
  function filterPapers(topic, updateURL) {
    if(!topics.includes(topic)) topic='all';
    buttons.forEach(button=>{
      const active=button.dataset.filter===topic;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    papers.forEach(paper=>{paper.hidden=topic!=='all'&&paper.dataset.topic!==topic;});
    const query=topic==='all'?'':`?topic=${encodeURIComponent(topic)}`;
    languageLink.setAttribute('href',languageBase+query);
    if(updateURL && location.protocol!=='file:') history.replaceState(null,'',location.pathname+query);
  }
  buttons.forEach(button=>button.addEventListener('click',()=>filterPapers(button.dataset.filter,true)));
  const selectedTopic=()=>new URLSearchParams(location.search).get('topic')||'all';
  filterPapers(selectedTopic(),false);
  window.addEventListener('popstate',()=>filterPapers(selectedTopic(),false));
})();
