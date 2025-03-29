document.addEventListener('DOMContentLoaded', function () {
  // MODO ESCURO - Este bloco controla a alternância entre modo claro e escuro
  const themeToggle = document.getElementById('theme-toggle'); // Pegando o checkbox que controla o tema
  const body = document.body;

  // Verificando se o usuário prefere modo escuro no sistema operacional
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // Verificando se salvamos uma preferência anteriormente no localStorage
  const savedTheme = localStorage.getItem('theme');

  // Se tiver um tema salvo como 'dark' OU se não tiver salvo nada E o usuário prefere dark no sistema
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    body.classList.add('dark-mode'); // Adiciona a classe que ativa o modo escuro
    themeToggle.checked = true;      // Marca o checkbox como ativado
  }

  // EVENTO DE MUDANÇA - Quando o usuário clica no toggle de tema
  themeToggle.addEventListener('change', function () {
    if (this.checked) {
      body.classList.add('dark-mode');        // Ativa o modo escuro
      localStorage.setItem('theme', 'dark');  // Salva a preferência
    } else {
      body.classList.remove('dark-mode');     // Remove o modo escuro (volta ao claro)
      localStorage.setItem('theme', 'light'); // Salva a preferência
    }
  });

  // Inicializando todas as funções principais do site
  highlightCurrentSection(); // Destaca a seção atual na navegação
  animateSkillBars();        // Anima as barras de habilidades
  setupSmoothScrolling();    // Configura o scroll suave ao clicar nos links
  initializeAnimations();    // Inicializa outras animações do site
});

// FUNÇÃO: Destaca a seção atual na barra de navegação conforme o usuário rola a página
function highlightCurrentSection() {
  // Selecionando todas as seções que têm ID e todos os links da navegação
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');

  // EVENTO DE SCROLL - Monitora quando o usuário rola a página
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 300; // Posição atual + offset para melhor experiência

    // Para cada seção, verifica se estamos dentro dela durante o scroll
    sections.forEach(section => {
      const sectionTop = section.offsetTop;     // Posição do topo da seção
      const sectionHeight = section.offsetHeight; // Altura da seção

      // Se a posição de scroll estiver dentro desta seção
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id'); // Guarda o ID da seção atual
      }
    });

    // Atualiza a classe 'active' nos links da navegação
    navLinks.forEach(link => {
      link.classList.remove('active'); // Remove a classe 'active' de todos os links
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active'); // Adiciona 'active' apenas ao link da seção atual
      }
    });
  });
}

// FUNÇÃO: Anima as barras de habilidades quando elas aparecem na tela
function animateSkillBars() {
  // Seleciona todas as barras de habilidades
  const skillBars = document.querySelectorAll('.skill-level');

  // Cria um observador de intersecção - monitora quando elementos entram na tela
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Quando uma barra de habilidade entra na tela
        if (entry.isIntersecting) {
          const width = entry.target.style.width; // Guarda a largura final (porcentagem da habilidade)

          entry.target.style.width = '0%'; // Reseta para 0% antes de animar

          // Pequeno atraso para criar efeito de animação suave
          setTimeout(() => {
            entry.target.style.width = width; // Anima para o valor correto
          }, 100);

          observer.unobserve(entry.target); // Para de observar este elemento (animação só acontece uma vez)
        }
      });
    },
    {
      threshold: 0.1, // Aciona quando pelo menos 10% do elemento está visível
    }
  );

  // Configura o observador para cada barra de habilidade
  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

// FUNÇÃO: Configura rolagem suave ao clicar nos links de navegação
function setupSmoothScrolling() {
  // Seleciona todos os links que apontam para âncoras (#)
  const navLinks = document.querySelectorAll('a[href^="#"]');

  // Para cada link, adiciona um evento de clique
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault(); // Impede o comportamento padrão do navegador

      const targetId = this.getAttribute('href'); // Pega o ID do alvo (#sobre, #contato, etc)

      if (targetId === '#') return; // Se for apenas #, não faz nada

      const targetElement = document.querySelector(targetId); // Encontra o elemento alvo

      if (!targetElement) return; // Se não encontrar o elemento, não faz nada

      // Calcula a distância de rolagem
      const targetPosition = targetElement.offsetTop;   // Posição do elemento alvo
      const startPosition = window.pageYOffset;         // Posição atual do scroll
      const distance = targetPosition - startPosition - 50; // Distância a percorrer (com ajuste para nav fixa)
      const duration = 800; // Duração da animação em milissegundos
      let startTime = null;

      // Função de animação recursiva usando requestAnimationFrame
      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollY = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, scrollY); // Rolando para a posição calculada

        // Se não terminou a duração, continua a animação
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      // Função de easing (suavização) - faz a rolagem parecer mais natural
      // t: tempo atual, b: posição inicial, c: distância total, d: duração
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      // Inicia a animação
      requestAnimationFrame(animation);
    });
  });
}

// FUNÇÃO: Inicializa animações diversas em elementos do site
function initializeAnimations() {
  // Animações para cards de projetos
  const projectCards = document.querySelectorAll('.project-card');
  const courseItems = document.querySelectorAll('.course-item');

  // Adiciona efeito hover nos cards de projetos
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)'; // Levanta o card ao passar o mouse
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(-5px)'; // Retorna parcialmente à posição original
    });
  });

  // Adiciona efeito hover nos itens de cursos
  courseItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-10px)'; // Levanta o item ao passar o mouse
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(-5px)'; // Retorna parcialmente à posição original
    });
  });

  // Anima itens de experiência um por um quando entram na tela
  const experienceItems = document.querySelectorAll('.experience-item');

  // Cria um observador de intersecção para os itens de experiência
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Animação com atraso para criar efeito cascata (um após o outro)
          setTimeout(() => {
            entry.target.style.opacity = '1'; // Torna o item visível
            entry.target.style.transform = 'translateY(0)'; // Move para posição final
          }, index * 200); // Atraso baseado no índice (200ms entre cada item)

          observer.unobserve(entry.target); // Para de observar este elemento
        }
      });
    },
    {
      threshold: 0.1, // Aciona quando pelo menos 10% do elemento está visível
    }
  );

  // Configura cada item de experiência para a animação
  experienceItems.forEach(item => {
    item.style.opacity = '0'; // Começa invisível
    item.style.transform = 'translateY(20px)'; // Começa um pouco abaixo da posição final
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Transição suave
    observer.observe(item); // Adiciona ao observador
  });
}
