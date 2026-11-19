Radar Gamer

O Radar Gamer reúne promoções de jogos digitais em um só lugar. O site permite buscar jogos, comparar preços promocionais e consultar informações como avaliações, publicadora e menor preço histórico. Também oferece favoritos e criação de alertas de preço.

## Recursos

- Página inicial com jogos selecionados, filtros e ofertas em destaque.
- Seção de Promoções com busca e navegação paginada.
- Busca de jogos na página inicial e na seção de Promoções.
- Página de detalhes com informações do jogo, avaliações e oferta disponível.
- Favoritos salvos no armazenamento local do navegador.
- Criação de alertas de preço com jogo, valor desejado e e-mail.
- Preços exibidos em reais, com conversão a partir da cotação USD/BRL.
- Layout responsivo para computadores, tablets e celulares.

## Tecnologias

- HTML5
- CSS3
- JavaScript em módulos, sem etapa de compilação

## Executar localmente

Como o site usa módulos JavaScript, chamadas de API e caminhos iniciados por `/`, abra-o por um servidor local em vez de abrir o HTML diretamente como arquivo.

1. Abra um terminal na pasta `radar_gamer`.
2. Inicie um servidor local:

   ```powershell
   py -m http.server 8000
   ```

3. Acesse [http://localhost:8000/paginaPrincipal.html](http://localhost:8000/paginaPrincipal.html) no navegador.

Se o comando `py` não estiver disponível, use outro servidor estático local, como a extensão Live Server do Visual Studio Code.

## Estrutura do projeto

```text
radar_gamer/
├── imagens/
│   └── logo.png
├── js/
│   ├── aviso.js
│   ├── buscarJogos.js
│   ├── detalhesJogo.js
│   ├── main.js
│   ├── moeda.js
│   ├── secaoAlertas.js
│   ├── secaoFavoritos.js
│   └── secaoPromocao.js
├── PaginaPrincipal.css
├── paginaPrincipal.html
├── paginaJogo.css
└── paginaJogo.html
```

## APIs e dados

- **CheapShark** fornece ofertas, preços, informações dos jogos, lojas e o serviço de alertas.
- **AwesomeAPI** fornece a cotação do dólar para conversão em reais.
- **Google Fonts** carrega as fontes Exo 2 e Manrope.
- Favoritos e a lista de alertas também ficam guardados no `localStorage` do navegador. Os alertas são enviados ao serviço da CheapShark com o e-mail e o preço informados.

O site precisa de conexão com a internet para carregar ofertas, cotações, fontes e criar alertas. Os dados e serviços exibidos dependem da disponibilidade das APIs externas.
