# Dogelon Mars — VibeCon 2026

Build jogável no browser. Base: export HTML5 do GDevelop 5 (DogelonSkull),
rethemado para Dogelon Mars.

## Como publicar

**Vercel** — arraste esta pasta em vercel.com/new, ou:

    npm i -g vercel && vercel --prod

**GitHub Pages** — suba o conteúdo desta pasta na raiz do repo e ative Pages.

Não precisa de build nem servidor: é HTML/JS estático. Só não abra por
`file://` — o navegador bloqueia o carregamento dos assets. Use qualquer
servidor local para testar:

    python3 -m http.server 8000

## Controles

| Ação | Teclado | Gamepad |
|---|---|---|
| Mover | A / D | D-Pad ou analógico |
| Pular | J | Cross / A |
| Tiro | K | Square / X |
| Deslize | O | Circle / B |
| Menu | W / S + K | D-Pad + Cross |

## O que foi alterado

- **Herói** trocado pelo sprite oficial do Dogelon (7 animações, 33 PNGs a 3x).
  Origem nativa 64x64, extraída dos sheets 1728px sem perda.
- **Ataque corpo a corpo virou tiro à distância** (`dogelon-blast.js`).
  O projétil usa a folha `Dogelon_Blast` e aplica dano reusando as mesmas
  variáveis dos inimigos do jogo original.
- **Cenário convertido para laboratório sci-fi** com o tileset da Foozle
  (CC0). O `Level1.json` NÃO foi tocado: o papel de cada tile foi inferido
  do próprio mapa (quais vizinhos são sólidos) e a arte equivalente foi
  pintada no mesmo slot do atlas `tiles.png`. Dados do mapa, classes
  `Platform` e todos os polígonos de colisão — inclusive as 90 células de
  rampa — continuam idênticos.
  Os 415 tiles de fundo foram distribuídos por **brilho**, não por sorteio,
  para a silhueta da estrutura antiga virar relevo de painel em vez de
  ruído. Paralaxe e esqueleto repintados para o tom frio do laboratório.
- **Paleta de Marte** ainda aplicada no fantasma e no dasher. O rosto ciano do fantasma foi mantido de propósito: é a cor
  complementar do rust e garante leitura contra o fundo.
- **Morte, respawn e explosão** ligados:
  - `Dead` (18 frames) toca quando o herói entra no estado `Death`.
  - `Respawn` (21 frames) toca toda vez que a fase carrega — o Dogelon
    desce no feixe de luz. Cancela sozinho se o jogador mexer; nunca
    prende o controle.
  - `Explode` (6 frames) substituiu o `EnemyDeathFire`.
- **Tela de carregamento (splash)** própria: `SplashDogelonMars.png`.
  Desenhada em 320x180 e ampliada 4x com NEAREST, pra o pixel bater com o
  jogo. Logo do GDevelop desligado, barra de progresso em dourado quente,
  `minDuration` de 2,5 s pra dar tempo de ler.
- **Retrato do HUD** trocado pela cabeça do Dogelon.
- **Marca "Made with GDevelop" desligada** via `properties.watermark.showWatermark`
  no `data.js` (é a mesma chave que o editor mexe). Ver nota de licença abaixo.
- Tela de título, textos de controle e nome do projeto atualizados.

## Se for editar o splash

O renderer do GDevelop escala o fundo em modo **cover** (`Math.max` entre as
razões) e centraliza. Em telas mais estreitas que 16:9 as laterais são
cortadas — nada importante pode encostar nas bordas.

A barra de progresso é desenhada por cima, centralizada, em
`y = altura - 90 - alturaDaBarra`. Num viewport de 720 isso é y 616..630,
ou seja y 154..157 no desenho de 320x180. Essa faixa fica limpa de propósito.

## Créditos de assets

- Sci-Fi Labs Tileset — Foozle (foozle.io), **CC0**, encomendado de aimen23b.
  Uso comercial livre, atribuição não exigida.
- Sprites do Dogelon — pack oficial da VibeCon 2026.
- Trilha sonora — do projeto original (Johnathan So). **Trocar ou creditar
  antes de submeter.**

## Nota de licença — marca do GDevelop

A engine do GDevelop é open source sob licença MIT e os jogos podem ser
distribuídos sem royalties. A marca "Made with GDevelop", porém, é o que
o **tier gratuito** entrega: removê-la é um recurso das assinaturas pagas,
e a FAQ do projeto lista "deixar o splash screen" como uma forma de
contribuir com a engine.

Ou seja: tecnicamente sai, mas se você não tem assinatura, vale considerar
creditar o GDevelop nos créditos do jogo ou na página de submissão. A tela
de Credits do projeto já existe e é um bom lugar.

## Nota sobre a ordem dos frames

As folhas têm células vazias. Em quase todas (`Dead`, `Blast`, `Hit`,
`Slide`, `duck`) os vazios ficam só no fim da grade — compactar é inofensivo.
Mas o `Dogelon_respawn` tem vazios **no meio**: posições 5, 10-12 e 17-20 de
21. São frames de piscada do teleporte, não sobra de grade. A extração lê a
grade inteira em ordem de leitura e preserva os vazios; compactar quebraria
a cadência do efeito.

## Pendências

- Sons: os arquivos não chegaram. A trilha atual é do projeto original
  (Johnathan So) — precisa creditar ou substituir antes de submeter.
- O boss ainda é a caveira original (já é laranja/fogo, combina com Marte).

## Checklist da submissão VibeCon

- [x] Sprite oficial do Dogelon como personagem principal, reconhecível
- [x] Totalmente jogável no browser, sem download
- [x] Sem NSFW, sem scam
- [ ] Link público (publicar no Vercel / GitHub Pages)
- [ ] Formulário: https://forms.gle/VHjcQ7MtUrD6hXaGA
