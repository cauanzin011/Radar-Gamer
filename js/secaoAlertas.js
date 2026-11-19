import { buscarJogosPorNome } from "./buscarJogos.js"
import { conversao } from "./moeda.js"
import { mostrarAviso } from "./aviso.js"

const inputNome = document.querySelector("#inputNome")
const inputPrecoDesejado = document.querySelector("#inputPreco")
const inputEmail = document.querySelector("#inputEmail")
const botaoCriarAlerta = document.querySelector("#botaoCriarAlerta")


const divAlertas = document.querySelector(".divAlertas")

const CHAVE_ALERTAS = "radarGamerAlertas"

function carregarAlertas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_ALERTAS) || "[]")
  } catch {
    return []
  }
}

function renderizarAlertas() {
  divAlertas.replaceChildren()

  carregarAlertas().forEach((alerta) => {
    const item = document.createElement("div")
    const imagem = document.createElement("img")
    const nome = document.createElement("p")
    const loja = document.createElement("p")
    const preco = document.createElement("p")

    imagem.src = alerta.thumb
    imagem.alt = `Capa de ${alerta.nome}`
    nome.textContent = alerta.nome
    loja.textContent =
      `Oferta encontrada em ${alerta.loja}. O alerta vale para qualquer loja.`
    preco.textContent =
      `Avisar quando chegar a R$ ${alerta.precoReais.toFixed(2)}`

    item.append(imagem, nome, loja, preco)
    divAlertas.appendChild(item)
  })
}

renderizarAlertas()


const listaSugestoes = document.createElement("div")
listaSugestoes.className = "sugestoesJogosAlerta"

inputNome.closest(".campoFormulario").append(listaSugestoes)

async function carregarNomesLojas() {
  try {
    const resposta = await fetch(
      "https://www.cheapshark.com/api/1.0/stores"
    )

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`)
    }

    const lojas = await resposta.json()

    return new Map(
      lojas.map((loja) => [
        String(loja.storeID),
        loja.storeName
      ])
    )
  } catch (erro) {
    console.error("Não foi possível carregar as lojas:", erro)
    return new Map()
  }
}

const nomesLojas = await carregarNomesLojas()

inputNome.addEventListener("input", () => {
  delete inputNome.dataset.gameId
  delete inputNome.dataset.storeName
  delete inputNome.dataset.thumb
  listaSugestoes.replaceChildren()
})

inputNome.addEventListener("keydown", async (evento) => {
  if (evento.key !== "Enter") return

  evento.preventDefault()

  const nomeDigitado = inputNome.value.trim()

  if (!nomeDigitado) {
    mostrarAviso("Digite o nome de um jogo.")
    return
  }

  try {
    const sugestoes = await buscarJogosPorNome(nomeDigitado)

    listaSugestoes.replaceChildren(
      ...sugestoes.map((jogo) => {
        const opcao = document.createElement("button")
        const imagem = document.createElement("img")
        const nomeLoja =
          nomesLojas.get(String(jogo.storeID)) || "Loja desconhecida"

        opcao.type = "button"

        imagem.src = jogo.thumb
        imagem.alt = `Capa de ${jogo.title}`

        opcao.append(
          imagem,
          document.createTextNode(`${jogo.title} — ${nomeLoja}`)
        )

        opcao.onclick = () => {
          inputNome.dataset.thumb = jogo.thumb
          inputNome.value = jogo.title
          inputNome.dataset.gameId = jogo.gameID
          inputNome.dataset.storeName = nomeLoja
          listaSugestoes.replaceChildren()
        }

        return opcao
      })
    )

    if (sugestoes.length === 0) {
      listaSugestoes.textContent = "Nenhum jogo encontrado."
    }
  } catch (erro) {
    console.error("Erro ao pesquisar jogos:", erro)
    mostrarAviso("Não foi possível pesquisar os jogos agora.")
  }
})

botaoCriarAlerta.addEventListener("click", async () => {
  const gameID = inputNome.dataset.gameId
  const precoReais = Number(inputPrecoDesejado.value)
  const email = inputEmail.value.trim()

  if (!gameID || !Number.isFinite(precoReais) || precoReais <= 0 || !email) {
    mostrarAviso("Escolha um jogo e preencha o preço e o e-mail.")
    return
  }

  if (!inputEmail.checkValidity()) {
    mostrarAviso("Digite um endereço de e-mail válido.")
    return
  }

  try {
    const cotacao = await conversao()
    const price = (precoReais / cotacao).toFixed(2)

    const parametros = new URLSearchParams({
      action: "set",
      email,
      gameID,
      price
    })

    const resposta = await fetch(
      `https://www.cheapshark.com/api/1.0/alerts?${parametros}`
    )

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`)
    }

    const criado = await resposta.json()

    if (criado) {
  const alertas = carregarAlertas().filter(
    (alerta) =>
      alerta.gameID !== gameID ||
      alerta.precoReais !== precoReais
  )

  alertas.push({
    gameID,
    nome: inputNome.value,
    thumb: inputNome.dataset.thumb,
    loja: inputNome.dataset.storeName,
    precoReais
  })

  localStorage.setItem(CHAVE_ALERTAS, JSON.stringify(alertas))
  renderizarAlertas()
}

    mostrarAviso(
      criado
        ? "Alerta criado com sucesso."
        : "Não foi possível criar o alerta."
    )
  } catch (erro) {
    console.error("Erro ao criar alerta:", erro)
    mostrarAviso("Não foi possível enviar o alerta agora.")
  }
})
