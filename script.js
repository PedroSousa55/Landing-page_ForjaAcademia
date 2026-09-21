const cabecalho = document.querySelector('.cabecalho');
const botaoMenu = document.querySelector('.botao-menu');
const menu = document.querySelector('.menu');
const perguntas = document.querySelectorAll('.faq-pergunta');
const elementosAnimados = document.querySelectorAll('.animar');
const botoesWhatsApp = document.querySelectorAll('.botao-whatsapp');

// Para um cliente real, informe somente os números com DDI + DDD.
// Exemplo: 5511999999999. Se ficar vazio, o WhatsApp abre com a mensagem pronta.
const numeroWhatsApp = '';

function criarLinkWhatsApp(mensagem) {
  const texto = encodeURIComponent(mensagem);
  return numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=${texto}`
    : `https://wa.me/?text=${texto}`;
}

botoesWhatsApp.forEach((botao) => {
  const mensagem = botao.dataset.mensagem || 'Olá! Quero saber mais.';
  botao.href = criarLinkWhatsApp(mensagem);
  botao.target = '_blank';
  botao.rel = 'noopener';
});

botaoMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', String(aberto));
});

document.querySelectorAll('.menu a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  cabecalho.classList.toggle('rolado', window.scrollY > 24);
});

perguntas.forEach((pergunta) => {
  pergunta.addEventListener('click', () => {
    const item = pergunta.closest('.faq-item');
    const resposta = item.querySelector('.faq-resposta');
    const aberto = item.classList.toggle('aberto');

    pergunta.setAttribute('aria-expanded', String(aberto));
    resposta.style.maxHeight = aberto ? `${resposta.scrollHeight}px` : '0px';
  });
});

const observador = new IntersectionObserver((entradas, observer) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      observer.unobserve(entrada.target);
    }
  });
}, { threshold: 0.14 });

elementosAnimados.forEach((elemento) => observador.observe(elemento));

document.getElementById('ano-atual').textContent = new Date().getFullYear();


// =========================================================
// MOVIMENTO PREMIUM
// Camada visual extra sem bibliotecas externas.
// =========================================================
(() => {
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Barra de progresso no topo.
  const barra = document.createElement('div');
  barra.className = 'barra-progresso-scroll';
  barra.setAttribute('aria-hidden', 'true');
  document.body.appendChild(barra);

  // Stagger: elementos próximos entram em sequência, não todos de uma vez.
  const grupos = [
    '.grade-cards',
    '.grade-planos',
    '.grade-profissionais',
    '.linha-etapas',
    '.grade-procedimentos',
    '.grade-etapas',
    '.galeria',
    '.grade-numeros',
    '.grade-dados',
    '.grade-beneficios'
  ];

  grupos.forEach((seletor) => {
    document.querySelectorAll(seletor).forEach((grupo) => {
      const itens = [...grupo.children].filter((item) => item.classList.contains('animar'));
      itens.forEach((item, indice) => {
        item.style.setProperty('--atraso', `${Math.min(indice * 85, 340)}ms`);
      });
    });
  });

  // Blocos lado a lado entram por direções opostas.
  [
    '.grade-sobre',
    '.grade-localizacao',
    '.grade-hero'
  ].forEach((seletor) => {
    document.querySelectorAll(seletor).forEach((grupo) => {
      const itens = [...grupo.children].filter((item) => item.classList.contains('animar'));
      itens.forEach((item, indice) => {
        item.classList.add(indice % 2 === 0 ? 'animar-esquerda' : 'animar-direita');
      });
    });
  });

  // Pequeno contador apenas quando o texto contém um único número.
  const alvosNumericos = document.querySelectorAll('.numero-card strong, .grade-dados strong');
  const observadorNumeros = new IntersectionObserver((entradas, observer) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      const elemento = entrada.target;
      const textoOriginal = elemento.textContent.trim();
      const resultado = textoOriginal.match(/^(\D*)(\d+)(\D*)$/);

      if (!resultado || movimentoReduzido) {
        observer.unobserve(elemento);
        return;
      }

      const [, prefixo, numeroTexto, sufixo] = resultado;
      const alvo = Number(numeroTexto);
      const inicio = performance.now();
      const duracao = 900;

      function atualizar(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const suavizado = 1 - Math.pow(1 - progresso, 3);
        const valor = Math.round(alvo * suavizado);
        elemento.textContent = `${prefixo}${valor}${sufixo}`;
        if (progresso < 1) requestAnimationFrame(atualizar);
      }

      requestAnimationFrame(atualizar);
      observer.unobserve(elemento);
    });
  }, { threshold: .6 });

  alvosNumericos.forEach((elemento) => observadorNumeros.observe(elemento));

  // Atualizações de scroll agrupadas em requestAnimationFrame para evitar travamentos.
  let aguardandoFrame = false;

  function atualizarScroll() {
    const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = alturaRolavel > 0 ? window.scrollY / alturaRolavel : 0;
    barra.style.transform = `scaleX(${Math.min(Math.max(progresso, 0), 1)})`;

    if (!movimentoReduzido) {
      const deslocamento = Math.min(window.scrollY * .08, 32);
      const heroAcademia = document.querySelector('.hero');
      const candidatosHero = [...document.querySelectorAll('.hero-imagem')];
      const fundoHero = candidatosHero.find((item) => !item.querySelector('img')) || null;
      const imagemHero = document.querySelector('.hero-imagem img');

      if (heroAcademia && getComputedStyle(heroAcademia).backgroundImage !== 'none') {
        heroAcademia.style.backgroundPosition = `center calc(50% + ${deslocamento}px)`;
      }
      if (fundoHero) {
        fundoHero.style.backgroundPosition = `center calc(50% + ${deslocamento}px)`;
      }
      if (imagemHero) {
        imagemHero.style.transform = `translate3d(0, ${deslocamento * .45}px, 0) scale(1.015)`;
      }
    }

    aguardandoFrame = false;
  }

  window.addEventListener('scroll', () => {
    if (!aguardandoFrame) {
      aguardandoFrame = true;
      requestAnimationFrame(atualizarScroll);
    }
  }, { passive: true });

  atualizarScroll();
})();
