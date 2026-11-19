const API_moeda = "https://economia.awesomeapi.com.br/json/last/USD-BRL"
import { mostrarAviso } from "./aviso.js"

export async function conversao() {

    console.log("Convertendo o valor da moeda")

    try {

        const resultado = await fetch(API_moeda)

        if (!resultado.ok) {
            throw new Error("Ocorreu um erro ao converter a moeda")
        }

        const dados = await resultado.json()

        return Number(dados.USDBRL.bid)

    } catch (erro) {

        console.log("Erro:", erro)
        mostrarAviso("Não foi possível obter a cotação do dólar agora.")
        throw erro

    }
}

export function converterParaReal(precoDolar, cotacao) {

    return Number(precoDolar) * cotacao

}