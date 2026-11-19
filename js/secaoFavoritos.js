const CHAVE_FAVORITOS = "radarGamerFavoritos"

function carregarFavoritos() {
  try {
    const dadosSalvos = JSON.parse(
      localStorage.getItem(CHAVE_FAVORITOS) || "[]"
    )

    return new Map(
      dadosSalvos.map((jogo) => [String(jogo.id), jogo])
    )
  } catch (erro) {
    console.error("Não foi possível carregar os favoritos:", erro)
    return new Map()
  }
}

const jogosFavoritos = carregarFavoritos()

function salvarFavoritos() {
  localStorage.setItem(
    CHAVE_FAVORITOS,
    JSON.stringify([...jogosFavoritos.values()])
  )
}

export function estaFavorito(id) {
  return jogosFavoritos.has(String(id))
}

function criarCardFavorito(jogo) {
  const card = document.createElement("div")
  card.className = "cartaoFavorito"
  card.dataset.gameId = String(jogo.id)

  const imagem = document.createElement("img")
  imagem.className = "imagemCapaJogo"
  imagem.src = jogo.imagem
  imagem.alt = jogo.nome

  const desconto = document.createElement("span")
  desconto.className = "etiquetaDesconto"
  desconto.textContent = jogo.desconto

  const nome = document.createElement("h3")
  nome.className = "nomeJogo"
  nome.textContent = jogo.nome

  const precoAntigo = document.createElement("p")
  precoAntigo.className = "precoAntigoJogo"
  precoAntigo.textContent = jogo.precoAntigo

  const precoAtual = document.createElement("p")
  precoAtual.className = "precoAtualJogo"
  precoAtual.textContent = jogo.precoAtual

  const link = document.createElement("a")
  link.className = "botaoSecundario"
  link.href = jogo.link
  link.textContent = "Ver detalhes"

  const botao = document.createElement("button")
  botao.className = "botaoFavorito favoritoAtivo"
  botao.type = "button"
  botao.setAttribute("aria-label", "Remover dos favoritos")
  botao.setAttribute("aria-pressed", "true")

  const icone = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  icone.classList.add("iconeBotaoFavorito")

  const use = document.createElementNS("http://www.w3.org/2000/svg", "use")
  use.setAttribute("href", "#iconeCoracao")
  icone.appendChild(use)
  botao.appendChild(icone)
  botao.onclick = () => marcarBotao(botao, jogo.id)

  card.append(imagem, desconto, nome, precoAntigo, precoAtual, link, botao)

  return card
}

function atualizarSecaoFavoritos() {
  const lista = document.querySelector(".divFavoritos")
  const secao = document.querySelector(".secaoFavoritos")
  const estadoVazio = secao?.querySelector(".estadoVazio")

  if (!lista) return

  lista.replaceChildren()

  for (const jogo of jogosFavoritos.values()) {
    lista.appendChild(criarCardFavorito(jogo))
  }

  if (estadoVazio) {
    estadoVazio.style.display =
      jogosFavoritos.size === 0 ? "" : "none"
  }
}

export function marcarBotao(botaoFavorito, id) {
  const idJogo = String(id)

  if (jogosFavoritos.has(idJogo)) {
    jogosFavoritos.delete(idJogo)
  } else {
    const card = botaoFavorito.closest("[data-game-id]")

    if (!card) return

    const jogo = {
      id: idJogo,
      nome: card.querySelector(".nomeJogo")?.textContent || "",
      imagem: card.querySelector(".imagemCapaJogo")?.src || "",
      desconto: card.querySelector(".etiquetaDesconto")?.textContent || "",
      precoAntigo: card.querySelector(".precoAntigoJogo")?.textContent || "",
      precoAtual: card.querySelector(".precoAtualJogo")?.textContent || "",
      link: card.querySelector(".botaoSecundario")?.href || `paginaJogo.html?id=${idJogo}`
    }

    jogosFavoritos.set(idJogo, jogo)
  }

  salvarFavoritos()
  atualizarSecaoFavoritos()

  document.querySelectorAll("[data-game-id]").forEach((card) => {
    const botao = card.querySelector(".botaoFavorito")

    if (botao && card.dataset.gameId === idJogo) {
      const favoritado = jogosFavoritos.has(idJogo)
      botao.classList.toggle("favoritoAtivo", favoritado)
      botao.setAttribute("aria-pressed", String(favoritado))
    }
  })
}

atualizarSecaoFavoritos()