let temporizadorAviso = null

export function mostrarAviso(mensagem, duracaoEmMs = 6000) {

    const elementoAviso = document.querySelector(".avisoPagina")

    if (!elementoAviso) {
        return
    }

    elementoAviso.textContent = mensagem

    if (temporizadorAviso) {
        clearTimeout(temporizadorAviso)
    }

    temporizadorAviso = setTimeout(() => {
        elementoAviso.textContent = ""
        temporizadorAviso = null
    }, duracaoEmMs)
}
