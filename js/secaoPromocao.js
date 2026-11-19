import { buscarOfertasPaginadas } from "./buscarJogos.js"
import { conversao, converterParaReal } from "./moeda.js"
import { marcarBotao, estaFavorito } from "./secaoFavoritos.js"

const divPromocao = document.querySelector(".divPromocao")

const navegacaoPaginas = document.querySelector(".paginacaoJogos")

let paginaAtual = 0
const paginasPorGrupo = 5


export async function mostrarJogos(parametros = "pageSize=60&onSale=1&pageNumber=0", destino = divPromocao){

    const cotacao = await conversao()
    const { jogos, totalPaginas } = await buscarOfertasPaginadas(parametros)

    // Limpa a lista antes de mostrar (evita cards repetidos a cada pesquisa)
    destino.innerHTML = ""

    if (jogos.length === 0) {
        destino.innerHTML = "<p>Nenhum jogo encontrado.</p>"
    }

    jogos.forEach(jogo => {
        
        const porcentagem = Number(jogo.savings).toFixed(0)
        
        const divCriada = document.createElement("div")
        const imagemCriada = document.createElement("img")
        const etiquetaCriada = document.createElement("span")
        const nomeCriado = document.createElement("h3")
        const precoAntigoCriado = document.createElement("p")
        const precoPromocaoCriado = document.createElement("p")
        const botaoCriado = document.createElement("a")
        const botaoFavorito = document.createElement("button")

        const precoAntigo = converterParaReal(jogo.normalPrice, cotacao)
        const precoAtual = converterParaReal(jogo.salePrice, cotacao)
        
        divCriada.className = "resultadoPromocaoJogo"
        divCriada.dataset.gameId = String(jogo.gameID)

        imagemCriada.className = "imagemCapaJogo"
        imagemCriada.src = jogo.thumb
        imagemCriada.alt = jogo.title
        etiquetaCriada.className = "etiquetaDesconto"
        nomeCriado.className = "nomeJogo"
        nomeCriado.textContent = jogo.title
        precoAntigoCriado.className = "precoAntigoJogo"
        precoPromocaoCriado.className = "precoAtualJogo"
        
        if (porcentagem === "0") {
            
            etiquetaCriada.style.display = "none"
            precoAntigoCriado.style.display = "none"
            
        } else {
            
            etiquetaCriada.style.display = "flex"
            etiquetaCriada.textContent = `${porcentagem}%`
            
            precoAntigoCriado.textContent = `R$ ${precoAntigo.toFixed(2).replace(".", ",")}`
            
        }
        
        precoPromocaoCriado.textContent = `R$ ${precoAtual.toFixed(2).replace(".", ",")}`
        
        botaoCriado.href = `paginaJogo.html?id=${jogo.gameID}`
        botaoCriado.className = "botaoSecundario"
        
        botaoCriado.textContent = "Ver oferta"

        botaoFavorito.className = "botaoFavorito"
        botaoFavorito.type = "button"
        botaoFavorito.setAttribute("aria-label", "Favoritar jogo")

        const favoritado = estaFavorito(jogo.gameID)
        botaoFavorito.classList.toggle("favoritoAtivo", favoritado)
        botaoFavorito.setAttribute("aria-pressed", String(favoritado))

        const icone = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        icone.classList.add("iconeBotaoFavorito")

        const use = document.createElementNS("http://www.w3.org/2000/svg", "use")
        use.setAttribute("href", "#iconeCoracao")
        icone.appendChild(use)
        botaoFavorito.appendChild(icone)

        botaoFavorito.onclick = () => {
            marcarBotao(botaoFavorito, jogo.gameID)
        }
        
        
        divCriada.appendChild(imagemCriada)
        divCriada.appendChild(etiquetaCriada)
        divCriada.appendChild(nomeCriado)
        divCriada.appendChild(precoAntigoCriado)
        divCriada.appendChild(precoPromocaoCriado)
        divCriada.appendChild(botaoCriado)
        divCriada.appendChild(botaoFavorito)
        
        destino.appendChild(divCriada)
        
        
    })

    if (destino === divPromocao) {
  renderizarPaginacao(totalPaginas)
}
}


// Pesquisa da seção de promoções (reaproveita o mostrarJogos)
const inputPromocao = document.querySelector(".secaoPromocao .inputBuscaJogo")
const botaoPromocao = document.querySelector(".secaoPromocao .pesquisarJogos")

const painelPesquisa = document.querySelector(".secaoPromocao .divPesquisaJogos")

// Mostra os jogos pesquisados no painel abaixo do campo (igual à pesquisa do topo)
function pesquisarPromocao(){

    const nome = inputPromocao.value.trim()

    if (nome === "") {
        painelPesquisa.style.display = "none"
        return
    }

    painelPesquisa.style.display = "flex"
    mostrarJogos(`title=${encodeURIComponent(nome)}&pageSize=8&onSale=1`, painelPesquisa)
}

botaoPromocao.addEventListener("click", pesquisarPromocao)

inputPromocao.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        pesquisarPromocao()
    }
})

// Ao limpar o campo, esconde o painel de resultados
inputPromocao.addEventListener("input", () => {
    if (inputPromocao.value === "") {
        pesquisarPromocao()
    }
})


// Botões de página (1, 2, 3...): cada um mostra outro grupo de promoções
function abrirPagina(pagina) {
  paginaAtual = pagina

  mostrarJogos(
    `pageSize=60&onSale=1&pageNumber=${pagina}`,
    divPromocao
  )

  window.scrollTo({ top: 0, behavior: "smooth" })
}

function criarBotaoPagina(texto, aoClicar, ativo = false) {
  const botao = document.createElement("button")

  botao.className = "botaoFiltro"
  botao.type = "button"
  botao.textContent = texto

  if (ativo) {
    botao.classList.add("botaoFiltroAtivo")
  }

  botao.addEventListener("click", aoClicar)

  return botao
}

function renderizarPaginacao(totalPaginas) {
  navegacaoPaginas.replaceChildren()

  const inicioGrupo =
    Math.floor(paginaAtual / paginasPorGrupo) * paginasPorGrupo

  const fimGrupo = Math.min(
    inicioGrupo + paginasPorGrupo,
    totalPaginas
  )

  if (inicioGrupo > 0) {
    const anterior = criarBotaoPagina("‹", () => {
      abrirPagina(inicioGrupo - paginasPorGrupo)
    })

    anterior.setAttribute("aria-label", "Grupo anterior")
    navegacaoPaginas.appendChild(anterior)
  }

  Array.from(
    { length: fimGrupo - inicioGrupo },
    (_, indice) => inicioGrupo + indice
  ).forEach((pagina) => {
    const botao = criarBotaoPagina(
      String(pagina + 1),
      () => abrirPagina(pagina),
      pagina === paginaAtual
    )

    navegacaoPaginas.appendChild(botao)
  })

  if (fimGrupo < totalPaginas) {
    const proximo = criarBotaoPagina("›", () => {
      abrirPagina(fimGrupo)
    })

    proximo.setAttribute("aria-label", "Próximo grupo")
    navegacaoPaginas.appendChild(proximo)
  }
}