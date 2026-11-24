const htmlEl = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function terapkanTema(tema) {
  if (tema === 'dark') {
    htmlEl.classList.add('dark');
    if (themeBtn) themeBtn.textContent = '☀️ Light';
  } else {
    htmlEl.classList.remove('dark');
    if (themeBtn) themeBtn.textContent = '🌙 Dark';
  }
}

const temaTersimpan = localStorage.getItem('tema_pentaskampus') || 'dark';
terapkanTema(temaTersimpan);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const temaBaru = htmlEl.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('tema_pentaskampus', temaBaru);
    terapkanTema(temaBaru);
  });
}