'use strict';

// Scene Notes: sample photo entries. Replace file paths and captions with your own work.
const galleries = {
  landscape: {
    name: 'Landscape', label: '風景', number: '01',
    intro: '旅先で出会った風景や、日常の中にある美しい景色。静かな光と空気を写した記録。',
    photos: [
      { src: './assets/landscape.webp', title: '山のふもとの湖', alt: '森に囲まれた湖と山並み' },
      { src: './assets/landscape-wide.webp', title: '朝の静けさ', alt: '朝もやが漂う山岳湖' },
      { src: './assets/landscape-02.webp', title: '遠くの山影', alt: '淡い光に包まれた山と湖' },
      { src: './assets/landscape-03.webp', title: '山を映す水辺', alt: '湖畔から望む雪山' }
    ]
  },
  wildlife: {
    name: 'Wildlife', label: '野生動物', number: '02',
    intro: '野生の動物たちが見せてくれる、かけがえのない瞬間。そっと距離を置いて見つめた風景。',
    photos: [
      { src: './assets/wildlife.webp', title: '草原のシカ', alt: '柔らかな光の中に佇むシカ' },
      { src: './assets/wildlife-02.webp', title: '森での出会い', alt: '林の中に立つ角のあるシカ' },
      { src: './assets/wildlife-03.webp', title: '野生のまなざし', alt: '岩場に佇むキツネ' }
    ]
  },
  objects: {
    name: 'Objects', label: 'ものたち', number: '03',
    intro: '日常の中で出会う、心に残るものたち。小さな物語のある静物を集めました。',
    photos: [
      { src: './assets/objects.webp', title: '窓辺のカメラ', alt: '木の机の上に置かれたフィルムカメラ' },
      { src: './assets/objects-02.webp', title: '午後の机', alt: 'カメラとマグカップのある静物' },
      { src: './assets/objects-03.webp', title: '何気ない時間', alt: '窓からの光に照らされたカメラ' }
    ]
  }
};

const home = document.getElementById('page-home');
const inner = document.getElementById('page-inner');
const innerContent = document.getElementById('inner-content');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const backdrop = document.getElementById('mobile-backdrop');
const themeToggles = [...document.querySelectorAll('[data-theme-toggle]')];
const photoDialog = document.getElementById('photo-dialog');
const dialogImage = document.getElementById('dialog-image');
let activePhotos = [];
let photoIndex = 0;

function setTheme(theme) {
  const selected = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = selected;
  themeToggles.forEach(toggle => toggle.setAttribute('aria-label', selected === 'dark' ? 'ライトモードに切り替える' : 'ダークモードに切り替える'));
  document.querySelector('meta[name="theme-color"]').content = selected === 'dark' ? '#181e21' : '#f6f3ee';
  try { localStorage.setItem('scene-notes-theme', selected); } catch (e) { /* private window */ }
}
setTheme(document.documentElement.dataset.theme);
themeToggles.forEach(toggle => toggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')));

function setMenuOpen(open) {
  const isOpen = !!open;
  sidebar.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  backdrop.hidden = !isOpen;
  document.body.classList.toggle('menu-open', isOpen);
}
menuToggle.addEventListener('click', () => setMenuOpen(!sidebar.classList.contains('is-open')));
backdrop.addEventListener('click', () => setMenuOpen(false));
sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenuOpen(false)));
window.addEventListener('resize', () => { if (window.innerWidth > 800) setMenuOpen(false); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sidebar.classList.contains('is-open')) { setMenuOpen(false); menuToggle.focus(); }
  if (photoDialog.open && e.key === 'ArrowLeft') showPhoto(photoIndex - 1);
  if (photoDialog.open && e.key === 'ArrowRight') showPhoto(photoIndex + 1);
});

function getRoute() {
  return (location.hash.match(/^#\/([a-z-]+)\/?$/) || [])[1] || 'home';
}
const backLink = '<a class="back-link" href="#/home"><svg class="icon" aria-hidden="true"><use href="#i-arrow-left"/></svg>Back to Home</a>';

function renderGallery(category) {
  const group = galleries[category];
  const photos = group.photos;
  innerContent.innerHTML = `
    <header class="inner-head">
      <span class="eyebrow">NOTEBOOK / ${group.number}</span>
      <h1>${group.name}</h1>
      <p>${group.intro}</p>
    </header>
    <div class="inner-divider"></div>
    <div class="gallery-grid" aria-label="${group.name} の写真一覧">
      ${photos.map((photo,index) => `
        <button type="button" class="gallery-tile" data-index="${index}" aria-label="${photo.title} を拡大表示">
          <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
          <span class="tile-title"><span>${photo.title}</span><span class="tile-n">${String(index+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}</span></span>
        </button>`).join('')}
    </div>${backLink}`;
  activePhotos = photos;
}

function renderAbout() {
  innerContent.innerHTML = `
    <header class="inner-head"><span class="eyebrow">ABOUT / SCENE NOTES</span><h1>About</h1><p>A journal of the moments I want to remember.</p></header>
    <div class="inner-divider"></div>
    <div class="about-layout">
      <div class="about-photo"><img src="./assets/landscape-wide.webp" alt="穏やかな朝の山並みと湖" loading="lazy"></div>
      <div class="about-copy"><h2>心に残った景色を、<br>そっと記録する。</h2><p>Scene Notes は、風景、野生動物、日常のものたちを写真で綴る小さなノートです。<br>ページをめくるように、気になったカテゴリーからゆっくり眺めてください。</p><p>このサイトの写真と文章はサンプルです。公開するときに、ご自身の作品や紹介文に差し替えられます。</p></div>
    </div>${backLink}`;
}

function renderRoute() {
  let route = getRoute();
  if (!['home','about',...Object.keys(galleries)].includes(route)) route = 'home';
  const isHome = route === 'home';
  home.hidden = !isHome;
  inner.hidden = isHome;
  if (!isHome) {
    if (galleries[route]) renderGallery(route);
    else if (route === 'about') renderAbout();
  }
  navLinks.forEach(link => {
    const selected = link.dataset.route === route;
    link.classList.toggle('is-current', selected);
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = (isHome ? 'Scene Notes' : `${galleries[route]?.name || 'About'} | Scene Notes`) + ' — A photography notebook';
  setMenuOpen(false);
  window.scrollTo({ top: 0, behavior:'instant' });
}
window.addEventListener('hashchange', renderRoute);
renderRoute();

document.querySelectorAll('[data-year]').forEach(year => { year.textContent = new Date().getFullYear(); });
innerContent.addEventListener('click', e => {
  const tile = e.target.closest('.gallery-tile');
  if (tile) {
    photoIndex = Number(tile.dataset.index);
    showPhoto(photoIndex);
    if (!photoDialog.open) photoDialog.showModal();
  }
});
function showPhoto(index) {
  if (!activePhotos.length) return;
  photoIndex = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[photoIndex];
  dialogImage.src = photo.src;
  dialogImage.alt = photo.alt;
  document.getElementById('dialog-title').textContent = photo.title;
  document.getElementById('dialog-counter').textContent = `${String(photoIndex+1).padStart(2,'0')} / ${String(activePhotos.length).padStart(2,'0')}`;
}
document.getElementById('dialog-close').addEventListener('click', () => photoDialog.close());
document.getElementById('photo-prev').addEventListener('click', () => showPhoto(photoIndex-1));
document.getElementById('photo-next').addEventListener('click', () => showPhoto(photoIndex+1));
photoDialog.addEventListener('click', e => { if (e.target === photoDialog) photoDialog.close(); });
