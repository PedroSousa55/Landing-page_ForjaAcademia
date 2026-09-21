const cabecalho = document.querySelector(".cabecalho");
const botaoMenu = document.querySelector(".botao-menu");
const menu = document.querySelector(".menu");
const perguntas = document.querySelectorAll(".faq-pergunta");
const elementosAnimados = document.querySelectorAll(".animar");
const botoesWhatsApp = document.querySelectorAll(".botao-whatsapp");

// Para um cliente real, informe somente os números com DDI + DDD.
// Exemplo: 5511999999999. Se ficar vazio, o WhatsApp abre com a mensagem pronta.
const numeroWhatsApp = "";

function criarLinkWhatsApp(mensagem) {
  const texto = encodeURIComponent(mensagem);
  return numeroWhatsApp
    ? `https://wa.me/${numeroWhatsApp}?text=${texto}`
    : `https://wa.me/?text=${texto}`;
}

botoesWhatsApp.forEach((botao) => {
  const mensagem = botao.dataset.mensagem || "Olá! Quero saber mais.";
  botao.href = criarLinkWhatsApp(mensagem);
  botao.target = "_blank";
  botao.rel = "noopener";
});

botaoMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", String(aberto));
});

document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  cabecalho.classList.toggle("rolado", window.scrollY > 24);
});

perguntas.forEach((pergunta) => {
  pergunta.addEventListener("click", () => {
    const item = pergunta.closest(".faq-item");
    const resposta = item.querySelector(".faq-resposta");
    const aberto = item.classList.toggle("aberto");

    pergunta.setAttribute("aria-expanded", String(aberto));
    resposta.style.maxHeight = aberto ? `${resposta.scrollHeight}px` : "0px";
  });
});

const observador = new IntersectionObserver(
  (entradas, observer) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observer.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.14 },
);

elementosAnimados.forEach((elemento) => observador.observe(elemento));

document.getElementById("ano-atual").textContent = new Date().getFullYear();
