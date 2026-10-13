/* =========================================================
   CONTATOS DA MANOVELLA
   Preencha aqui e todo o site se atualiza sozinho.
   whatsapp: só números, com 55 + DDD + número. Ex.: "5554999998888"
   email:    ex.: "contato@manovella.com.br"
   ========================================================= */
const CONTATO = {
  whatsapp: "",
  email: ""
};

const MENSAGEM_PADRAO = "Olá! Vim pelo site da Manovella e gostaria de conversar.";

(function () {
  const numero = (CONTATO.whatsapp || "").replace(/\D/g, "");
  const temWhatsApp = numero.length >= 12;

  function linkWhatsApp(texto) {
    return "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto);
  }

  function formatarTelefone(n) {
    const local = n.startsWith("55") ? n.slice(2) : n;
    if (local.length === 11) return "(" + local.slice(0, 2) + ") " + local.slice(2, 7) + "-" + local.slice(7);
    if (local.length === 10) return "(" + local.slice(0, 2) + ") " + local.slice(2, 6) + "-" + local.slice(6);
    return "+" + n;
  }

  /* Contatos exibidos na página */
  if (temWhatsApp) {
    document.querySelectorAll('[data-contato="whatsapp"]').forEach(function (el) {
      const a = document.createElement("a");
      a.href = linkWhatsApp(MENSAGEM_PADRAO);
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = formatarTelefone(numero);
      el.replaceWith(a);
    });
    document.querySelectorAll("[data-whatsapp-link]").forEach(function (a) {
      if (a.id === "confirmacao-whatsapp") return;
      a.href = linkWhatsApp(MENSAGEM_PADRAO);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
  if (CONTATO.email) {
    document.querySelectorAll('[data-contato="email"]').forEach(function (el) {
      const a = document.createElement("a");
      a.href = "mailto:" + CONTATO.email;
      a.textContent = CONTATO.email;
      el.replaceWith(a);
    });
  }

  /* Menu no celular */
  const corpo = document.body;
  const botaoMenu = document.querySelector(".botao-menu-celular");
  const menu = document.getElementById("menu");

  const corTema = document.querySelector('meta[name="theme-color"]');
  function ajustarCorTema(menuAberto) {
    if (corTema) corTema.setAttribute("content", menuAberto ? "#1F3A4A" : "#F5F1EA");
  }

  function fecharMenu() {
    ajustarCorTema(false);
    corpo.classList.remove("menu-aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
  }
  botaoMenu.addEventListener("click", function () {
    const abrir = !corpo.classList.contains("menu-aberto");
    corpo.classList.toggle("menu-aberto", abrir);
    ajustarCorTema(abrir);
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  });
  menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", fecharMenu); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && corpo.classList.contains("menu-aberto")) { fecharMenu(); botaoMenu.focus(); }
  });
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (m) { if (m.matches) fecharMenu(); });

  /* Filtro de exemplos */
  const filtros = document.querySelectorAll(".filtro");
  const exemplos = document.querySelectorAll(".exemplo");
  const contagem = document.querySelector(".contagem");
  filtros.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const setor = botao.dataset.filtro;
      let visiveis = 0;
      filtros.forEach(function (b) { b.setAttribute("aria-pressed", String(b === botao)); });
      exemplos.forEach(function (ex) {
        const mostrar = setor === "todos" || ex.dataset.setor === setor;
        ex.hidden = !mostrar;
        if (mostrar) visiveis++;
      });
      contagem.textContent = visiveis === 1 ? "1 exemplo" : visiveis + " exemplos";
    });
  });

  /* Formulário de contato */
  const form = document.getElementById("formulario");
  const aviso = document.getElementById("aviso-erro");
  const confirmacao = document.getElementById("confirmacao");
  const confirmacaoTexto = document.getElementById("confirmacao-texto");
  const confirmacaoWhatsApp = document.getElementById("confirmacao-whatsapp");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const empresa = form.empresa.value.trim();
    const setor = form.setor.value;
    const tarefa = form.tarefa.value.trim();

    form.nome.setAttribute("aria-invalid", String(!nome));
    form.tarefa.setAttribute("aria-invalid", String(!tarefa));
    if (!nome || !tarefa) {
      aviso.hidden = false;
      (nome ? form.tarefa : form.nome).focus();
      return;
    }
    aviso.hidden = true;

    let texto = "Olá! Vim pelo site da Manovella.\n\nNome: " + nome;
    if (empresa) texto += "\nEmpresa: " + empresa;
    if (setor) texto += "\nSetor: " + setor;
    texto += "\n\nTarefa que mais toma tempo da equipe:\n" + tarefa;

    if (temWhatsApp) {
      const url = linkWhatsApp(texto);
      confirmacaoWhatsApp.href = url;
      confirmacaoWhatsApp.target = "_blank";
      confirmacaoWhatsApp.rel = "noopener";
      confirmacaoWhatsApp.hidden = false;
      confirmacaoTexto.textContent = "Abrimos o WhatsApp com a sua mensagem pronta. É só tocar em enviar. Se ele não abriu, use o botão abaixo.";
      window.open(url, "_blank", "noopener");
    } else {
      confirmacaoWhatsApp.hidden = true;
      confirmacaoTexto.textContent = "Site em fase de testes: assim que o número de WhatsApp for configurado, este formulário abrirá a conversa com a sua mensagem pronta.";
    }
    form.hidden = true;
    confirmacao.hidden = false;
    confirmacao.focus();
  });

  document.getElementById("nova-mensagem").addEventListener("click", function () {
    form.reset();
    confirmacao.hidden = true;
    form.hidden = false;
    form.nome.focus();
  });

  /* Barra de ação no celular: some quando o contato está na tela */
  const barra = document.getElementById("barra-acao");
  const contato = document.getElementById("contato");
  if ("IntersectionObserver" in window && barra && contato) {
    new IntersectionObserver(function (entradas) {
      barra.classList.toggle("escondida", entradas[0].isIntersecting);
    }, { threshold: 0.15 }).observe(contato);
  }
})();
