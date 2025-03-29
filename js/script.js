document.addEventListener('DOMContentLoaded', function () {
  // Modo escuro
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    body.classList.add('dark-mode');
    themeToggle.checked = true;
  }

  themeToggle.addEventListener('change', function () {
    if (this.checked) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });

  // Inicialização
  highlightCurrentSection();
  animateSkillBars();
  setupSmoothScrolling();
});

// Destaca a seção atual na navegação
function highlightCurrentSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 300;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Anima as barras de habilidades
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-level');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0%';
          
          setTimeout(() => {
            entry.target.style.width = width;
          }, 100);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

// Rolagem suave
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const targetPosition = targetElement.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition - 50;
      
      window.scrollTo({
        top: targetPosition - 50,
        behavior: 'smooth'
      });
    });
  });
}
