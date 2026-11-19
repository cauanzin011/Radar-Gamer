const APIcheapShark = "https://www.cheapshark.com/api/1.0"

import { conversao, converterParaReal } from "./moeda.js"
import { mostrarAviso } from "./aviso.js"

const converter = await conversao()

const parametros = new URLSearchParams(window.location.search)

const idJogo = parametros.get("id")

const nomeJogo = document.querySelector(".nomeJogo")
const capaJogo = document.querySelector(".capaJogo")
const notaSteam = document.querySelector(".notaSteam")
const quantidadeAvaliacoes = document.querySelector(".quantidadeAvaliacoes")
const notaMetacritic = document.querySelector(".notaMetacritic")
const publicadora = document.querySelector(".publicadora")
const lancamento = document.querySelector(".lancamento")
const menorPrecoHistoria = document.querySelector(".menorPrecoHistoria")
const dataMenorPreco = document.querySelector(".dataMenorPreco")
const precoAtual = document.querySelector(".precoAtual")
const precoDesconto = document.querySelector(".desconto")
const porcentagemDesconto = document.querySelector(".porcentagemDesconto")
const nomeLoja = document.querySelector(".nomeLoja")
const linkOferta = document.querySelector(".linkOferta")


async function buscarDadosJogos(){
    try{
        if(!idJogo){
            console.log("Não foi possivel encontrar o id do jogo")
            mostrarAviso("Não foi possível encontrar o jogo (ID ausente na URL).")
        }

    const resultadoGames = await fetch(`${APIcheapShark}/games?id=${idJogo}`)

    const dadosGames = await resultadoGames.json()


    const dealID = dadosGames.deals[0].dealID;

    const resultadoDeals = await fetch(`${APIcheapShark}/deals?id=${dealID}`)

    const dadosDeals = await resultadoDeals.json()

    const resultadoLojas = await fetch(`${APIcheapShark}/stores`)

    const dadosLojas = await resultadoLojas.json()

    if(!resultadoGames.ok){
        throw new Error("Erro ao buscar o jogo")
    }


    const menorOferta = dadosGames.deals.reduce((menor, oferta) => {
     return Number(oferta.price) < Number(menor.price)
         ? oferta
         : menor
})

const lojaEncontrada = dadosLojas.find(loja => {
    return String(loja.storeID) === String(menorOferta.storeID)
})

    let precoHistorico = Number(dadosGames.cheapestPriceEver.price)
    let precoNormal = Number(menorOferta.retailPrice)
    let precoPromocao = Number(menorOferta.price)
    let porcentagem = Number(menorOferta.savings)

    if(Number(menorOferta.price) === 0){
        precoHistorico = 0
    }




    let menorPrecoHistoriaConvertido = converterParaReal(precoHistorico, converter)
    let precoNormalConvertido = converterParaReal(precoNormal, converter)
    let precoPromocaoConvertido = converterParaReal(precoPromocao, converter)

        nomeJogo.textContent = dadosGames.info.title
        capaJogo.src = dadosGames.info.thumb.replace("capsule_sm_120", "header")

        if(precoNormalConvertido === precoPromocaoConvertido){
            precoAtual.textContent = `R$ ${precoNormalConvertido.toFixed(2).replace(".", ",")}`
        }else{
            precoAtual.textContent = `R$ ${precoNormalConvertido.toFixed(2).replace(".", ",")}`
            precoDesconto.textContent = `R$ ${precoPromocaoConvertido.toFixed(2).replace(".", ",")}`
            porcentagemDesconto.textContent = "-" + porcentagem.toFixed(0) + "%"
        }

        menorPrecoHistoria.textContent = `R$ ${menorPrecoHistoriaConvertido.toFixed(2).replace(".", ",")}`
        dataMenorPreco.textContent = new Date(dadosGames.cheapestPriceEver.date * 1000).toLocaleDateString("pt-BR")
        notaSteam.textContent = `Nota na Steam ${dadosDeals.gameInfo.steamRatingPercent}` + "%"
        quantidadeAvaliacoes.textContent = `${dadosDeals.gameInfo.steamRatingCount} Avaliações`
        notaMetacritic.textContent = `Nota no MetaCritic ${dadosDeals.gameInfo.metacriticScore}` + "%"

        if(dadosDeals.gameInfo.publisher === "N/A" || lojaEncontrada.storeName === "N/A"){

            publicadora.textContent = "Não foi possivel encontrar a publicadora"

        }else{

            publicadora.textContent = dadosDeals.gameInfo.publisher

        }

        if(lojaEncontrada.storeName === "N/A"){

            nomeLoja.textContent = "Não foi possivel encontrar a loja"

        }else{

            nomeLoja.textContent = lojaEncontrada.storeName

        }

        lancamento.textContent = new Date(dadosDeals.gameInfo.releaseDate * 1000).toLocaleDateString("pt-BR")
        linkOferta.href = `https://www.cheapshark.com/redirect?dealID=${menorOferta.dealID}`

    }catch(erro){
        console.log("Erro:", erro)
        mostrarAviso("Não foi possível carregar os detalhes deste jogo.")
    }
}
buscarDadosJogos()