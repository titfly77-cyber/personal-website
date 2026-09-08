import { ui, projects, skills, experiences, tr } from './data.js';

const languages = ['en', 'zh-Hans', 'zh-Hant'];
let language = 'en';
let currentRoute;
let languagePosition;
let renderVersion = 0;
const main = document.querySelector('#main');
const toggle = document.querySelector('#language-toggle');
const options = document.querySelector('#language-options');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const text = value => typeof value === 'object' && !Array.isArray(value) ? value[language] ?? value.en : value;
const u = key => esc(text(ui[key]));
const route = (path = '', lang = language) => `#/${lang}${path ? `/${path}` : ''}`;
const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
const link = (href, label, extra = '') => `<a class="text-link ${extra}" href="${esc(href)}"${href.endsWith('.pdf') ? ' download' : ''}>${label}${arrow}</a>`;
const external = (href, label) => `<a class="text-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${label}${arrow}</a>`;
const paragraphs = value => esc(text(value)).replace(/\n/g, '<br>');
const tags = project => `<div class="tags">${text(project.tags).map(tag => `<span>${esc(tag)}</span>`).join('')}</div>`;

function diagram() {
  return `<div class="diagram" role="img" aria-label="${u('diagram')}: PID, PWM, ${u('feedback')}">
    <div class="diagram-label">${u('diagram')}</div>
    <div class="diagram-flow"><div class="diagram-node">PID</div><span aria-hidden="true">→</span><div class="diagram-node">PWM</div><span aria-hidden="true">→</span><div class="diagram-node">${esc(text(tr('Motor','电机','馬達')))}</div></div>
    <div class="diagram-loop"><span>${u('feedback')}</span></div>
    <div class="diagram-footer">STM32F103C8</div>
  </div>`;
}

function visual(project, detail = false) {
  if (project.image) return `<img src="./assets/images/${project.image}" alt="${esc(text(project.caption))}" loading="${detail ? 'eager' : 'lazy'}" decoding="async">`;
  if (project.kind === 'control') return diagram();
  const label = { adrc:'ADRC', tobacco:'AGRI.', vision:'VISION', competition:'CONTROL' }[project.kind] || 'SYSTEM';
  return `<div class="text-visual"><strong>${label}</strong><span>${esc(text(project.tags)[0])}</span></div>`;
}

function card(project) {
  return `<a class="project-card" href="${route(`projects/${project.id}`)}">
    <div class="card-media ${project.kind}-media">${visual(project)}<span class="card-corner" aria-hidden="true">↗</span></div>
    <div class="project-number">${project.index} / ${u('projectLabel')}</div>
    <h3>${esc(text(project.title))}</h3><p>${esc(text(project.short))}</p>${tags(project)}
  </a>`;
}

function footer() {
  return `<section class="contact-section" id="contact"><div class="container contact-grid">
    <div><p class="eyebrow">${u('contactLabel')}</p><h2>${paragraphs(ui.contactTitle).replace('<br>', '<br><em>')}${text(ui.contactTitle).includes('\n') ? '</em>' : ''}</h2><p>${u('contactBody')}</p></div>
    <div class="contact-links"><a class="text-link email-link" href="mailto:tfly58526@gmail.com">tfly58526@gmail.com ${arrow}</a>
      <div class="contact-minor">${external('https://github.com/titfly77-cyber','GitHub')}${link(`./assets/resumes/resume-${language}.pdf`,u('cv'))}</div>
      <a class="text-link secondary-link" href="./assets/resumes/resume-trilingual.pdf" download>${u('combined')}${arrow}</a>
    </div></div></section>
    <div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${u('name')} · ${u('portfolio')}</span><a href="${route('projects')}?section=other-work">${u('other')}</a><a href="${route()}" data-top>${u('top')}</a></div>`;
}

function home() {
  const name = language === 'en' ? 'Tenghui<span>Tu<em>.</em></span>' : `${u('name')}<em>。</em>`;
  return `<section class="hero container" id="introduction">
    <div class="hero-copy"><p class="eyebrow">${u('field')}</p><h1>${name}</h1><p class="hero-direction">${paragraphs(ui.direction)}</p><p class="hero-description">${u('intro')}</p>
      <div class="hero-links"><a class="text-link" href="${route()}?section=selected-work" data-scroll="selected-work">${u('projectsLink')}${arrow}</a>${link(`./assets/resumes/resume-${language}.pdf`,u('cv'),'secondary-link')}</div>
    </div>
    <div class="portrait-wrap"><figure class="portrait-frame"><img src="./assets/images/portrait.jpg" alt="${u('portrait')}" width="3480" height="3480" fetchpriority="high"><figcaption class="portrait-caption"><span><i class="small-dot" aria-hidden="true"></i>${u('student')}</span><span>01 — 09</span></figcaption></figure><span class="hero-index" aria-hidden="true">SOFTWARE / HARDWARE / INTEGRATION</span></div>
  </section>
  <div class="container technical-strip" aria-label="${u('skillsTitle')}"><span>STM32 & ESP32</span><i aria-hidden="true"></i><span>FreeRTOS</span><i aria-hidden="true"></i><span>PID & ADRC</span><i aria-hidden="true"></i><span>${esc(text(tr('Computer Vision','机器视觉','機器視覺')))}</span><i aria-hidden="true"></i><span>${esc(text(tr('System Integration','系统集成','系統整合')))}</span></div>
  <section class="section container" id="selected-work"><div class="section-head"><div><p class="eyebrow">${u('selectedLabel')}</p><h2>${u('selected')}</h2></div>${link(route('projects'),u('all'))}</div><div class="work-grid">${projects.slice(0,3).map(card).join('')}</div></section>
  <section class="section skills-section" id="skills"><div class="container skills-layout"><div class="skills-intro"><p class="eyebrow">${u('skillsLabel')}</p><h2>${paragraphs(ui.skillsTitle)}</h2><p>${u('skillsIntro')}</p></div><div class="skills-list">${skills.map((skill,index)=>`<div class="skill-row"><span class="micro">0${index+1}</span><div><h3>${esc(text(skill.title))}</h3><p>${esc(text(skill.body))}</p><a href="${skill.project ? route(`projects/${skill.project}`) : `${route()}?section=${skill.section}`}" ${skill.section ? `data-scroll="${skill.section}"` : ''}>${u('viewCase')}</a>${index===1 ? `<span aria-hidden="true"> · </span><a href="${route('projects/bed-cleaning-robot')}">ADRC ↗</a>`:''}</div></div>`).join('')}</div></div></section>
  <section class="section container" id="experience"><div class="section-head"><div><p class="eyebrow">${u('experienceLabel')}</p><h2>${u('experience')}</h2></div><p>${u('experienceIntro')}</p></div><div class="experience-list">${experiences.map(item=>`<article class="experience-row"><div class="experience-date">${esc(text(item.date))}</div><div><h3>${esc(text(item.company))}</h3><p class="experience-role">${esc(text(item.role))}</p></div><p>${esc(text(item.body))}</p></article>`).join('')}</div></section>
  <section class="section leadership-section container" id="leadership"><div class="section-head"><div><p class="eyebrow">${u('leadershipLabel')}</p><h2>${u('leadership')}</h2></div></div><div class="leadership-grid"><article><h3>${u('leadershipOne')}</h3><p>${u('leadershipOneBody')}</p></article><article><h3>${u('leadershipTwo')}</h3><p>${u('leadershipTwoBody')}</p></article></div></section>`;
}

function archive() {
  return `<div class="container project-archive"><div class="page-intro"><a class="back-link" href="${route()}">${u('back')}</a><p class="eyebrow">${u('projectLabel')}</p><h1>${paragraphs(ui.archiveTitle)}</h1><p>${u('archiveIntro')}</p></div><div class="archive-grid">${projects.map(card).join('')}</div>
  <section class="other-work" id="other-work"><p class="eyebrow">${u('other')}</p><h2>${esc(text(tr('A different kind of making.','另一种创作。','另一種創作。')))}</h2><p>${u('otherIntro')}</p><div class="other-grid">${[['tea-harvesting','teaOne'],['tea-withering','teaTwo']].map(([file,label])=>`<figure><video controls playsinline preload="none" poster="./assets/images/${file}.jpg" aria-label="${u(label)}"><source src="./assets/videos/${file}.mp4" type="video/mp4"></video><figcaption>${u(label)}</figcaption></figure>`).join('')}</div></section></div>`;
}

function detail(project) {
  const hasMedia = project.video || project.gallery;
  const sectionLink = (id,label) => `<a href="${route(`projects/${project.id}`)}?section=${id}" data-scroll="${id}">${u(label)}</a>`;
  return `<article class="container"><div class="page-intro"><a class="back-link" href="${route('projects')}">${u('backProjects')}</a><p class="eyebrow">${project.index} / ${u('projectLabel')}</p><h1>${esc(text(project.title))}</h1><p>${esc(text(project.short))}</p></div>
    <div class="project-overview"><div><p class="micro">${u('contribution')}</p><p>${esc(text(project.role))}</p></div><div><p class="micro">${u('stack')}</p>${tags(project)}</div></div>
    <figure><div class="detail-hero">${visual(project,true)}</div><figcaption class="caption">${esc(text(project.caption))}</figcaption></figure>
    <div class="case-body"><aside class="case-aside"><p class="eyebrow">${u('contents')}</p>${sectionLink('context','context')}${sectionLink('contribution','contribution')}${sectionLink('implementation','implementation')}${hasMedia?sectionLink('evidence','evidence'):''}${project.source ? `<a href="${project.source}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`:''}</aside>
    <div class="case-content"><section class="case-section" id="context"><h2>${u('context')}</h2><p>${esc(text(project.context))}</p></section>
    <section class="case-section" id="contribution"><h2>${u('contribution')}</h2><ul>${project.contributions.map(item=>`<li>${esc(text(item))}</li>`).join('')}</ul></section>
    <section class="case-section" id="implementation"><h2>${u('implementation')}</h2><p>${esc(text(project.implementation))}</p>${project.source?external(project.source,u('source')):''}</section>
    ${hasMedia ? `<section class="case-section" id="evidence"><h2>${u('evidence')}</h2>${project.video ? `<figure><video class="case-video" controls playsinline preload="metadata" poster="./assets/images/${project.id==='robot-arm'?'robot-arm':project.id==='emotion-screen'?'badge-v1':'tabletop-v2'}.jpg" aria-label="${esc(text(project.videoCaption||ui.clip))}"><source src="./assets/videos/${project.video}" type="video/mp4"></video><figcaption class="caption">${esc(text(project.videoCaption||ui.clip))}</figcaption></figure>`:''}${project.gallery?`<div class="gallery">${project.gallery.map(([file,caption])=>`<figure><a href="./assets/images/${file}" target="_blank" rel="noopener noreferrer" aria-label="${u('openImage')}: ${esc(text(caption))}"><img src="./assets/images/${file}" alt="${esc(text(caption))}" loading="lazy" decoding="async"></a><figcaption>${esc(text(caption))}</figcaption></figure>`).join('')}</div>`:''}</section>`:''}
    ${project.outcome ? `<section class="case-section" id="outcome"><h2>${u('notes')}</h2><p>${esc(text(project.outcome))}</p></section>`:''}
    </div></div><section class="related"><h2>${u('related')}</h2><div class="related-links">${projects.filter(p=>p.id!==project.id).slice(0,2).map(p=>link(route(`projects/${p.id}`),esc(text(p.title)))).join('')}</div></section></article>`;
}

function parseLocation() {
  const raw = location.hash.slice(1);
  const [path, query] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  return { language: languages.includes(parts[0]) ? parts[0] : 'en', path:parts.slice(1).join('/'), section:new URLSearchParams(query).get('section'), valid:languages.includes(parts[0]) };
}

function closeLanguage(restoreFocus = false) {
  options.hidden = true;
  toggle.setAttribute('aria-expanded','false');
  if(restoreFocus) toggle.focus({preventScroll:true});
}

function render() {
  const version = ++renderVersion;
  const next = parseLocation();
  const hadRoute = Boolean(currentRoute);
  const wasLanguageChange = currentRoute && currentRoute.path === next.path && currentRoute.language !== next.language;
  language = next.language;
  document.documentElement.lang = language;
  try { localStorage.setItem('portfolio-language',language); } catch {}
  document.querySelector('#header-note').textContent = text(ui.portfolio);
  document.querySelector('.skip-link').textContent = text(ui.skip);
  document.querySelector('.wordmark').href = route();
  document.querySelector('.wordmark').setAttribute('aria-label',text(ui.name));
  toggle.innerHTML = `${{en:'EN','zh-Hans':'简','zh-Hant':'繁'}[language]} <span aria-hidden="true">⌄</span>`;
  toggle.setAttribute('aria-label',text(ui.choose));
  options.querySelectorAll('a').forEach(a=>{a.href=route(next.path,a.dataset.language);a.removeAttribute('aria-current');if(a.dataset.language===language)a.setAttribute('aria-current','true');});
  closeLanguage();
  const project = next.path.startsWith('projects/') ? projects.find(p=>p.id===next.path.slice(9)) : null;
  if(next.valid && !next.path) main.innerHTML = home();
  else if(next.valid && next.path==='projects') main.innerHTML = archive();
  else if(next.valid && project) main.innerHTML = detail(project);
  else main.innerHTML = `<section class="container empty-page"><h1>${u('notFound')}</h1><p>${u('notFoundBody')}</p>${link(route(),u('back'))}</section>`;
  document.querySelector('#footer').innerHTML = footer();
  document.title = `${project ? text(project.title) : text(ui.name)} — ${text(ui.portfolio)}`;
  document.querySelector('meta[name="description"]').content=text(project?project.short:ui.intro);
  const scrollState=languagePosition;
  languagePosition=undefined;
  currentRoute=next;
  requestAnimationFrame(async()=>{
    if(wasLanguageChange)await document.fonts.ready;
    if(version!==renderVersion)return;
    if(wasLanguageChange && scrollState){
      const target=document.getElementById(scrollState.id);
      window.scrollTo({top:target?target.getBoundingClientRect().top+scrollY-scrollState.offset:scrollState.y,behavior:'instant'});
    }else if(next.section && document.getElementById(next.section)) document.getElementById(next.section).scrollIntoView({behavior:'instant'});
    else window.scrollTo({top:0,behavior:'instant'});
    if(hadRoute && !wasLanguageChange)main.focus({preventScroll:true});
  });
}

toggle.addEventListener('click',()=>{
  const open=options.hidden;
  options.hidden=!open;
  toggle.setAttribute('aria-expanded',String(open));
});
toggle.addEventListener('keydown',event=>{
  if(event.key==='ArrowDown'){event.preventDefault();options.hidden=false;toggle.setAttribute('aria-expanded','true');options.querySelector('a').focus();}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!options.hidden)closeLanguage(true);});
document.addEventListener('click',event=>{
  const target=event.target.closest('a');
  if(target?.dataset.language){
    const sections=[...document.querySelectorAll('main section[id], .contact-section')];
    const headerBottom=document.querySelector('.site-header').getBoundingClientRect().bottom;
    const visible=sections.map(section=>({section,visible:Math.max(0,Math.min(innerHeight,section.getBoundingClientRect().bottom)-Math.max(headerBottom,section.getBoundingClientRect().top))})).sort((a,b)=>b.visible-a.visible)[0]?.section;
    languagePosition={id:visible?.id,offset:visible?.getBoundingClientRect().top,y:scrollY};
    closeLanguage(true);
  }else if(!event.target.closest('.language-picker'))closeLanguage();
  if(!target)return;
  if(target.classList.contains('skip-link')){event.preventDefault();main.focus();return;}
  if(target.hasAttribute('data-top')){event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});return;}
  const id=target.dataset.scroll;
  if(id&&document.getElementById(id)){
    event.preventDefault();
    history.replaceState(null,'',target.href);
    document.getElementById(id).scrollIntoView({behavior:'smooth'});
  }
});
window.addEventListener('hashchange',render);
if(!location.hash||location.hash==='#'){
  let saved;
  try{saved=localStorage.getItem('portfolio-language');}catch{}
  history.replaceState(null,'',route('',languages.includes(saved)?saved:'en'));
}
render();
