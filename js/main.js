import {jogosSelecionados, JogosMelhoresOfertas, JogosPopularesOfertas} from "./buscarJogos.js";
import { mostrarJogos } from "./secaoPromocao.js";
import "./secaoAlertas.js"

async function iniciarSite() {
  await jogosSelecionados();
  await mostrarJogos();
}

iniciarSite();

const botoesFiltro = document.querySelectorAll(".botaoFiltro");

botoesFiltro.forEach((botaoFiltroSelecionado) => {
  botaoFiltroSelecionado.addEventListener("click", () => {
    botoesFiltro.forEach((botao) => {
      botao.classList.remove("botaoFiltroAtivo");
    });

    botaoFiltroSelecionado.classList.add("botaoFiltroAtivo");

    const filtro = botaoFiltroSelecionado.textContent.trim();

    if (filtro === "Todos") {
      jogosSelecionados();
    } else if (filtro === "Em promoção") {
      JogosMelhoresOfertas();
    } else {
      JogosPopularesOfertas();
    }
  });
});

const itemNavegacao = document.querySelectorAll(".itemNavegacao");
const secaoPromocao = document.querySelector(".secaoPromocao");
const secaoFavoritos = document.querySelector(".secaoFavoritos");
const secaoAlertas = document.querySelector(".secaoAlertas");
const secaoSobre = document.querySelector(".secaoSobre");

function removerClasses() {
  secaoPromocao?.classList.remove("mostrar");
  secaoFavoritos?.classList.remove("mostrar");
  secaoAlertas?.classList.remove("mostrar");
  secaoSobre?.classList.remove("mostrar");
}

itemNavegacao.forEach((botaoNavegacao) => {
  botaoNavegacao.addEventListener("click", (evento) => {
    evento.preventDefault()

    itemNavegacao.forEach((selecionado) => {
      selecionado.classList.remove("itemNavegacaoAtivo");
    });

    botaoNavegacao.classList.add("itemNavegacaoAtivo");

    const destino = botaoNavegacao.textContent.trim();

    removerClasses();

    if (destino === "Promoções") {
      secaoPromocao?.classList.add("mostrar");
    } else if (destino === "Favoritos") {
      secaoFavoritos?.classList.add("mostrar");
    } else if (destino === "Alertas") {
      secaoAlertas?.classList.add("mostrar");
    } else if (destino !== "Início") {
      secaoSobre?.classList.add("mostrar");
    }
  });
});

const botaoAlerta = document.querySelector("#botaoAlerta");

const navegacaoAlertas = [...itemNavegacao].find(
  (item) => item.textContent.trim() === "Alertas"
);

botaoAlerta?.addEventListener("click", () => {
  itemNavegacao.forEach((item) => {
    item.classList.remove("itemNavegacaoAtivo");
  });

  removerClasses();

  navegacaoAlertas?.classList.add("itemNavegacaoAtivo");
  secaoAlertas?.classList.add("mostrar");
});
