/* ===== MUS ===== */
const glow = document.getElementById('glow');
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = -100, my = -100, rx = -100, ry = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  glow.style.left = mx + 'px'; glow.style.top = my + 'px';
  cursor.style.transform = `translate(${mx}px, ${my}px)`;
});

// Ringen glider blødt efter prikken (0.15 = hastighed, højere = hurtigere)
(function follow() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  ring.style.transform = `translate(${rx}px, ${ry}px)`;
  requestAnimationFrame(follow);
})();

// Ringen vokser over links, knapper og kort
const hoverTargets = 'a, button, .tag, .stat-card, .skill-group, .exp-card, .ref-card, .proj-card';
document.addEventListener('mouseover', e => ring.classList.toggle('hover', !!e.target.closest(hoverTargets)));
document.addEventListener('mousedown', () => ring.classList.add('down'));
document.addEventListener('mouseup', () => ring.classList.remove('down'));
document.addEventListener('mouseleave', () => document.body.classList.add('cursor-hidden'));
document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-hidden'));

/* ===== SCROLL-REVEAL ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + 's';
  observer.observe(el);
});

/* ===== TERMINAL ===== */
const out = document.getElementById('termOutput');
const body = document.getElementById('termBody');
const input = document.getElementById('termInput');
const inputLine = document.getElementById('termInputLine');
const PROMPT = '<span class="t-prompt">majestic@portfolio</span>:<span class="t-path">~</span>$ ';
const sections = ['om', 'skills', 'erfaring', 'uddannelse', 'projekter', 'referencer', 'kontakt'];

// Små hjælpere, så teksten herunder bliver kortere
const k = t => `<span class="t-key">${t}</span>`;     // orange
const g = t => `<span class="t-green">${t}</span>`;   // gul/grøn
const m = t => `<span class="t-muted">${t}</span>`;   // grå
const list = arr => '[' + arr.map(v => `<span class="t-val">"${v}"</span>`).join(', ') + ']';

// Ret teksten her, hvis du vil ændre hvad terminalen svarer
const commands = {
  help: () => [
    m('Tilgængelige kommandoer:'),
    `  ${k('whoami')}       hvem er jeg?`,
    `  ${k('om')}           kort om mig`,
    `  ${k('skills')}       mine kompetencer`,
    `  ${k('erfaring')}     hvor jeg har arbejdet`,
    `  ${k('uddannelse')}   hvad jeg læser`,
    `  ${k('projekter')}    ting jeg har bygget`,
    `  ${k('projekter')}    ting jeg har bygget`,
    `  ${k('referencer')}   hvem du kan spørge`,
    `  ${k('kontakt')}      sådan fanger du mig`,
    `  ${k('ls')}           vis sektioner`,
    `  ${k('cd')} &lt;sektion&gt; hop til en sektion på siden`,
    `  ${k('clear')}        ryd terminalen`,
    m('Tip: brug Tab til at autoudfylde og ↑ for historik.')
  ],
  whoami: () => [
    g('Alexander Peter Wolfram') + ' ' + m('// aka Alex'),
    'Data og Kommunikation-studerende · Albertslund, DK',
    'På vej mod en karriere i IT'
  ],
  om: () => [
    'Bred baggrund – fra slagterbutikken over detailhandel til IT.',
    'Medstifter af Rezervera. Bygger hjemmesider i fritiden og',
    'nørder med, hvordan spil og digitale produkter er skruet sammen.'
  ],
  skills: () => [
    `${k('programmering')} = ${list(['C#/.NET', 'Python', 'HTML/CSS'])}`,
    `${k('it_support')}    = ${list(['Windows 10/11', 'Hardware', 'Active Directory', 'Netværk'])}`,
    `${k('platforme')}     = ${list(['Cisco', 'Ubuntu', 'Windows Server'])}`,
    `${k('soft_skills')}   = ${list(['Kommunikation', 'Kundeservice', 'Problemløsning'])}`
  ],
  erfaring: () => [
    `${g('[2026 – nu]')}  Tjener og oplæringsansvarlig ${m('@ Copoke sushibar')}`,
    `${g('[2024 – nu]')}  IT- og kundeansvarlig ${m('@ Rezervera')}`,
    `${g('[tidligere]')}  Sælger og kundesagsansvarlig ${m('@ Power')}`,
    `${g('[tidligere]')}  Slagter → stand-in slagtermester → teamkoordinator ${m('@ Føtex')}`,
    m('Skriv "cd erfaring" for detaljer.')
  ],
  uddannelse: () => [g('Data og Kommunikation') + ' ' + m('(igangværende)'), 'Fokus: C#, Python, operativsystemer og IT-infrastruktur'],
  projekter: () => [
    `${g('[netværk]')}  CCNA netværkslab ${m('· Cisco, OSPF, HSRP')}`,
    `${g('[server]')}   Active Directory-lab ${m('· Windows Server, PowerShell')}`,
    `${g('[linux]')}    Linux-servere bag firewall ${m('· Rocky Linux, pfSense')}`,
    `${g('[web]')}      Denne hjemmeside ${m('· HTML, CSS, JS')}`,
    m('Skriv "cd projekter" for at se dem.')
  ],
  referencer: () => ['Referencer fra Power, Føtex, Rezervera og MENY.', m('Skriv "cd referencer" for at se dem.')],
  kontakt: () => [
    `${k('email')}   <a href="mailto:wollejunior@live.dk">wollejunior@live.dk</a>`,
    `${k('telefon')} +45 42 39 58 88`,
    `${k('github')}  ${m('kommer snart')}`
  ],
  ls: () => [sections.map(s => `<span class="t-path">${s}/</span>`).join('  ')],
  pwd: () => ['/home/majestic/portfolio'],
  date: () => [new Date().toLocaleString('da-DK')],
  sudo: () => ['<span class="t-err">majestic is not in the sudoers file. This incident will be reported.</span> 😄'],
  hej: () => [`Hej! 👋 Skriv ${k('help')} for at se hvad jeg kan.`],
  clear: () => { out.innerHTML = ''; return []; }
};
commands.hello = commands.hej;

const history = [];
let histIndex = 0, typing = false;

const escapeHtml = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const scrollDown = () => body.scrollTop = body.scrollHeight;
function print(html) {
  const div = document.createElement('div');
  div.className = 'term-line';
  div.innerHTML = html;
  out.appendChild(div);
}

function run(raw) {
  const text = raw.trim();
  print(PROMPT + escapeHtml(text));
  if (!text) return scrollDown();

  const [cmd, ...args] = text.split(/\s+/);
  const name = cmd.toLowerCase();

  if (name === 'cd') {
    const target = (args[0] || '').replace(/\/$/, '').toLowerCase();
    if (!target || target === '~') print(m('Du er allerede hjemme.'));
    else if (sections.includes(target)) {
      print(m('Hopper til ' + target + '…'));
      document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
    } else print(`<span class="t-err">cd: ${escapeHtml(target)}: ingen sådan mappe</span>`);
  }
  else if (name === 'echo') print(escapeHtml(args.join(' ')));
  else if (commands[name]) commands[name]().forEach(print);
  else print(`<span class="t-err">command not found: ${escapeHtml(cmd)}</span> ` + m('– skriv "help"'));

  print('&nbsp;');
  scrollDown();
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (input.value.trim()) history.push(input.value);
    histIndex = history.length;
    run(input.value);
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIndex > 0) input.value = history[--histIndex];
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    histIndex = Math.min(histIndex + 1, history.length);
    input.value = history[histIndex] || '';
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const v = input.value.toLowerCase();
    const pool = v.startsWith('cd ') ? sections.map(s => 'cd ' + s) : [...Object.keys(commands), 'cd', 'echo'];
    const match = pool.filter(c => c.startsWith(v));
    if (match.length === 1) input.value = match[0];
    else if (match.length > 1) { print(PROMPT + escapeHtml(input.value)); print(m(match.join('  '))); scrollDown(); }
  }
});

// Klik i terminalen sætter fokus i inputfeltet
document.getElementById('terminal').addEventListener('click', () => {
  if (!window.getSelection().toString()) input.focus({ preventScroll: true });
});

// Skriver en kommando bogstav for bogstav (bruges til intro)
function typeCommand(cmd, done) {
  if (typing) return;
  typing = true;
  let i = 0;
  const tick = () => {
    input.value = cmd.slice(0, ++i);
    if (i < cmd.length) return setTimeout(tick, 55 + Math.random() * 50);
    setTimeout(() => {
      input.value = '';
      history.push(cmd); histIndex = history.length;
      run(cmd);
      typing = false;
      if (done) done();
    }, 250);
  };
  tick();
}

// Intro: skriver "whoami" automatisk ved load
setTimeout(() => {
  print(m('Velkommen til mit portfolio · v1.0'));
  print(m('Skriv en kommando for at komme i gang.'));
  print('&nbsp;');
  inputLine.style.display = 'flex';
  typeCommand('whoami', () => { print(m('→ Prøv ') + k('help') + m(' for at se flere kommandoer.')); scrollDown(); });
}, 1100);
