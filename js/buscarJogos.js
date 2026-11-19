import { conversao, converterParaReal } from "./moeda.js"
import { mostrarAviso } from "./aviso.js"
import { marcarBotao, estaFavorito } from "./secaoFavoritos.js"

const API_CHEAPSHARK = "https://www.cheapshark.com/api/1.0"

let dadosJogo = []

const converter = await conversao()
const lojasBloqueadas = new Set(["23"])

const gradeJogos = document.querySelector(".gradeJogos")

const capaJogo = gradeJogos.querySelectorAll(".imagemCapaJogo")
const cartaoJogo = gradeJogos.querySelectorAll(".cartaoJogo")
const etiquetaDesconto = gradeJogos.querySelectorAll(".etiquetaDesconto")
const nomeJogo = gradeJogos.querySelectorAll(".nomeJogo")
const precoAntigoJogo = gradeJogos.querySelectorAll(".precoAntigoJogo")
const precoPromocaoJogo = gradeJogos.querySelectorAll(".precoAtualJogo")
const botaoJogo = gradeJogos.querySelectorAll(".botaoSecundario")

const imagemBanner = document.querySelector(".imagemBanner")
const tituloBannerDestaque = document.querySelector(".tituloBannerDestaque")
const precoAntigoBannerDestaque = document.querySelector(
  ".precoAntigoBannerDestaque"
)
const precoAtualBannerDestaque = document.querySelector(
  ".precoAtualBannerDestaque"
)
const botaoPrimario = document.querySelector(".botaoPrimario")

const inputBuscaJogo = document.querySelector(".inputBuscaJogo")
const botaoBuscarJogos = document.querySelector(".pesquisarJogos")
const divPesquisaJogos = document.querySelector(".divPesquisaJogos")

export async function buscarOfertas(parametros) {
  try {
    const resposta = await fetch(`${API_CHEAPSHARK}/deals?${parametros}`)

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`)
    }

    const dados = await resposta.json()

    return dados.filter(
      (jogo) => !lojasBloqueadas.has(String(jogo.storeID))
    )
  } catch (erro) {
    console.error("Erro ao buscar ofertas:", erro)
    mostrarAviso("Não foi possível buscar os jogos agora.")
    return []
  }
}

function mostrarJogos(dados, cotacao) {
  const quantidadeCards = Math.min(
    dados.length,
    capaJogo.length,
    cartaoJogo.length,
    etiquetaDesconto.length,
    nomeJogo.length,
    precoAntigoJogo.length,
    precoPromocaoJogo.length,
    botaoJogo.length
  )

  dados.slice(0, quantidadeCards).forEach((jogo, indice) => {
    const porcentagem = Number(jogo.savings).toFixed(0)

    const precoAntigo = converterParaReal(jogo.normalPrice, cotacao)
    const precoAtual = converterParaReal(jogo.salePrice, cotacao)

    cartaoJogo[indice].dataset.gameId = String(jogo.gameID)
    cartaoJogo[indice].style.display = ""

    capaJogo[indice].src = jogo.thumb.replace(
      "capsule_sm_120",
      "header"
    )
    capaJogo[indice].alt = jogo.title

    if (porcentagem === "0") {
      etiquetaDesconto[indice].style.display = "none"
      precoAntigoJogo[indice].style.display = "none"
    } else {
      etiquetaDesconto[indice].style.display = "flex"
      etiquetaDesconto[indice].textContent = `-${porcentagem}%`

      precoAntigoJogo[indice].style.display = "block"
      precoAntigoJogo[indice].textContent =
        `R$ ${precoAntigo.toFixed(2).replace(".", ",")}`
    }

    nomeJogo[indice].textContent = jogo.title
    precoPromocaoJogo[indice].textContent =
      `R$ ${precoAtual.toFixed(2).replace(".", ",")}`

    botaoJogo[indice].href =
      `paginaJogo.html?id=${jogo.gameID}`

    const botaoFavorito =
      cartaoJogo[indice].querySelector(".botaoFavorito")

    if (botaoFavorito) {
      const favoritado = estaFavorito(jogo.gameID)

      botaoFavorito.classList.toggle("favoritoAtivo", favoritado)
      botaoFavorito.setAttribute("aria-pressed", String(favoritado))

      botaoFavorito.onclick = () => {
        marcarBotao(botaoFavorito, jogo.gameID)
      }
    }
  })

  cartaoJogo.forEach((card, indice) => {
    if (indice >= quantidadeCards) {
      card.style.display = "none"
    }
  })
}

export async function buscarOfertasPaginadas(parametros) {
  const resposta = await fetch(`${API_CHEAPSHARK}/deals?${parametros}`)

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}`)
  }

  const totalPaginas =
    Number(resposta.headers.get("X-Total-Page-Count")) || 1

  const dados = await resposta.json()

  const jogos = dados.filter(
    (jogo) => !lojasBloqueadas.has(String(jogo.storeID))
  )

  return { jogos, totalPaginas }
}

export async function jogosSelecionados() {
  try {
    const nomesJogosSelecionados = [
      "black myth wukong",
      "cyberpunk 2077",
      "elden ring",
      "marvel spider man 2",
      "DRAGON BALL: Sparking! ZERO",
      "ea fc 27",
      "Baldur's Gate 3",
      "Hogwarts Legacy",
      "assassin's creed shadow",
      "assassin's creed valhalla"
    ]

    const resultados = await Promise.all(
      nomesJogosSelecionados.map((nome) =>
        buscarOfertas(
          `title=${encodeURIComponent(nome)}&pageSize=1`
        )
      )
    )

    dadosJogo = resultados.flat()
    mostrarJogos(dadosJogo, converter)

    const jogos = await buscarOfertas(
      "pageSize=60&onSale=1&sortBy=Price&desc=0"
    )

    const melhorPromocao = jogos[0]

    if (melhorPromocao && imagemBanner && tituloBannerDestaque) {
      const precoAntigoBanner = converterParaReal(
        melhorPromocao.normalPrice,
        converter
      )

      const precoAtualBanner = converterParaReal(
        melhorPromocao.salePrice,
        converter
      )

      imagemBanner.src = melhorPromocao.thumb.replace(
        "capsule_sm_120",
        "header"
      )
      imagemBanner.alt = melhorPromocao.title
      tituloBannerDestaque.textContent = melhorPromocao.title

      if (precoAntigoBannerDestaque) {
        precoAntigoBannerDestaque.textContent =
          `R$ ${precoAntigoBanner.toFixed(2).replace(".", ",")}`
      }

      if (precoAtualBannerDestaque) {
        precoAtualBannerDestaque.textContent =
          `R$ ${precoAtualBanner.toFixed(2).replace(".", ",")}`
      }

      if (botaoPrimario) {
        botaoPrimario.href =
          `paginaJogo.html?id=${melhorPromocao.gameID}`
      }
    }
  } catch (erro) {
    console.error(
      "Erro ao carregar os jogos da página inicial:",
      erro
    )
    mostrarAviso("Não foi possível carregar os jogos da página inicial.")
  }
}

export async function JogosMelhoresOfertas() {
  const dados = await buscarOfertas(
    "pageSize=12&sortBy=Savings&onSale=1"
  )

  mostrarJogos(dados, converter)
}

export async function JogosPopularesOfertas() {
  const dadosPopulares = await buscarOfertas(
    "pageSize=50&sortBy=ReviewCount&desc=1&onSale=1"
  )

  const idsVistos = new Set()

  const jogosUnicos = dadosPopulares.filter((jogo) => {
    if (idsVistos.has(jogo.gameID)) {
      return false
    }

    idsVistos.add(jogo.gameID)
    return true
  })

  mostrarJogos(jogosUnicos.slice(0, 6), converter)
}

export async function pesquisarJogo() {
  if (!inputBuscaJogo || !divPesquisaJogos) {
    return
  }

  const valorInput = inputBuscaJogo.value.trim()

  if (valorInput === "") {
    mostrarAviso("Digite o nome de um jogo para pesquisar.")
    return
  }

  const resultado = await buscarJogosPorNome(valorInput)

  divPesquisaJogos.innerHTML = ""
  divPesquisaJogos.style.display = "flex"

  if (resultado.length === 0) {
    const mensagem = document.createElement("p")
    mensagem.textContent = "Nenhum jogo encontrado."
    divPesquisaJogos.appendChild(mensagem)
    return
  }

  resultado.forEach((jogo) => {
    const porcentagem = Number(jogo.savings).toFixed(0)
    const precoAntigo = converterParaReal(jogo.normalPrice, converter)
    const precoAtual = converterParaReal(jogo.salePrice, converter)

    const card = document.createElement("div")
    const imagem = document.createElement("img")
    const etiqueta = document.createElement("span")
    const nome = document.createElement("h3")
    const precoAntigoElemento = document.createElement("p")
    const precoAtualElemento = document.createElement("p")
    const botao = document.createElement("a")

    card.className = "resultadoBuscaJogo"
    card.dataset.gameId = String(jogo.gameID)

    imagem.className = "imagemCapaJogo"
    imagem.src = jogo.thumb
    imagem.alt = jogo.title
    etiqueta.className = "etiquetaDesconto"
    nome.className = "nomeJogo"
    nome.textContent = jogo.title
    precoAntigoElemento.className = "precoAntigoJogo"
    precoAtualElemento.className = "precoAtualJogo"

    if (porcentagem === "0") {
      etiqueta.style.display = "none"
      precoAntigoElemento.style.display = "none"
    } else {
      etiqueta.style.display = "flex"
      etiqueta.textContent = `-${porcentagem}%`
      precoAntigoElemento.textContent =
        `R$ ${precoAntigo.toFixed(2).replace(".", ",")}`
    }

    precoAtualElemento.textContent =
      `R$ ${precoAtual.toFixed(2).replace(".", ",")}`

    botao.className = "botaoSecundario"
    botao.href = `paginaJogo.html?id=${jogo.gameID}`
    botao.textContent = "Ver oferta"

    const botaoFavorito = document.createElement("button")
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

    card.append(
      imagem,
      etiqueta,
      nome,
      precoAntigoElemento,
      precoAtualElemento,
      botao,
      botaoFavorito
    )

    divPesquisaJogos.appendChild(card)
  })
}

export async function buscarJogosPorNome(nome, quantidade = 8) {
  const nomeLimpo = nome.trim()

  if (nomeLimpo === "") {
    return []
  }

  return buscarOfertas(
    `title=${encodeURIComponent(nomeLimpo)}&pageSize=${quantidade}`
  )
}

botaoBuscarJogos?.addEventListener("click", pesquisarJogo)

inputBuscaJogo?.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    pesquisarJogo()
  }
})

inputBuscaJogo?.addEventListener("search", () => {
  divPesquisaJogos.innerHTML = ""
  divPesquisaJogos.style.display = "none"
})
