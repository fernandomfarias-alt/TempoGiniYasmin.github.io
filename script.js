// Data de início: 12 de julho de 2025 (meia-noite, hora local)
const startDate = new Date(2025, 6, 12, 0, 0, 0);

function pad(n){return String(n).padStart(2,'0')}

function updateCounter(){
  const now = new Date();
  let delta = Math.floor((now - startDate) / 1000);
  if(delta < 0) delta = 0;

  const days = Math.floor(delta / 86400);
  delta %= 86400;
  const hours = Math.floor(delta / 3600);
  delta %= 3600;
  const minutes = Math.floor(delta / 60);
  const seconds = delta % 60;

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}

setInterval(updateCounter, 1000);
updateCounter();

// Fotos: upload, preview e persistência em localStorage
const photos = document.querySelectorAll('.photo');

function loadPhotos(){
  photos.forEach((el, i)=>{
    const key = 'photo' + (i+1);
    const data = localStorage.getItem(key);
    const img = el.querySelector('img.preview');
    const placeholder = el.querySelector('.placeholder');
    const defaultSrc = `images/photo${i+1}.svg`;
    if(data){
      img.src = data;
      img.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      img.src = defaultSrc;
      img.style.display = 'block';
      placeholder.style.display = 'none';
    }
  });
}

photos.forEach((el, i)=>{
  const input = el.querySelector('.file-input');
  const img = el.querySelector('img.preview');
  const placeholder = el.querySelector('.placeholder');

  input.addEventListener('change', e=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      img.src = dataUrl;
      img.style.display = 'block';
      placeholder.style.display = 'none';
      localStorage.setItem('photo' + (i+1), dataUrl);
    };
    reader.readAsDataURL(file);
  });
});

const resetBtn = document.getElementById('reset');
if(resetBtn){
  resetBtn.addEventListener('click', ()=>{
    for(let i=1;i<=4;i++) localStorage.removeItem('photo'+i);
    loadPhotos();
  });
}

loadPhotos();

// --- Animação de corações ---
let heartsContainer = document.querySelector('.hearts');
if(!heartsContainer){
  heartsContainer = document.createElement('div');
  heartsContainer.className = 'hearts';
  document.body.appendChild(heartsContainer);
}

const heartColors = ['#FF7AA2','#FFB3D1','#FFD1E6','#FFA8C9'];

function spawnHeart(options = {}){
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = '❤';
  
  // Estilos base para garantir que apareçam
  h.style.position = 'fixed';
  h.style.top = '-50px';
  h.style.zIndex = '9999';
  h.style.pointerEvents = 'none';
  h.style.left = (options.left ?? Math.random() * 100) + 'vw';
  h.style.color = options.color ?? heartColors[Math.floor(Math.random()*heartColors.length)];
  h.style.fontSize = (options.size ?? (Math.floor(Math.random()*28)+18)) + 'px';

  // Criando a animação via JS para não depender do CSS externo
  const fallDuration = (options.duration ?? (10 + Math.random() * 5)) * 1000;
  
  const animation = h.animate([
    { transform: 'translateY(0) rotate(0deg)', opacity: 0.9 },
    { transform: `translateY(110vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
  ], {
    duration: fallDuration,
    easing: 'linear'
  });

  heartsContainer.appendChild(h);
  animation.onfinish = () => h.remove();
}

// Spawn contínuo (fundo)
function scheduleHearts(){
  if(heartsContainer.children.length < 50){
     spawnHeart();
  }
  setTimeout(scheduleHearts, 500 + Math.random() * 1000);
}
scheduleHearts();

// --- Chuva de corações ao clicar ---
function spawnRain(intensity = 50){
  for(let i = 0; i < intensity; i++){
    setTimeout(() => {
      spawnHeart({
        duration: 2 + Math.random() * 3, // Bem mais rápido para o clique
        size: 15 + Math.random() * 30
      });
    }, i * 20); // Cria um efeito de rajada
  }
}

const loveBtn = document.getElementById('love-btn');
if(loveBtn){
  loveBtn.addEventListener('click', () => {
    loveBtn.style.transform = "scale(0.95)";
    setTimeout(() => loveBtn.style.transform = "scale(1)", 100);
    spawnRain(60); 
  });
}