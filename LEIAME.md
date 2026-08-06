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
- **Paleta de Marte** aplicada em céu, vila, tileset, esqueleto, fantasma
  e dasher. O rosto ciano do fantasma foi mantido de propósito: é a cor
  complementar do rust e garante leitura contra o fundo.
- **Morte, respawn e explosão** ligados:
  - `Dead` (18 frames) toca quando o herói entra no estado `Death`.
  - `Respawn` (21 frames) toca toda vez que a fase carrega — o Dogelon
    desce no feixe de luz. Cancela sozinho se o jogador mexer; nunca
    prende o controle.
  - `Explode` (6 frames) substituiu o `EnemyDeathFire`.
- **Retrato do HUD** trocado pela cabeça do Dogelon.
- Tela de título, textos de controle e nome do projeto atualizados.

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
- A marca "Made with GDevelop" no canto vem do tier gratuito do GDevelop.

## Checklist da submissão VibeCon

- [x] Sprite oficial do Dogelon como personagem principal, reconhecível
- [x] Totalmente jogável no browser, sem download
- [x] Sem NSFW, sem scam
- [ ] Link público (publicar no Vercel / GitHub Pages)
- [ ] Formulário: https://forms.gle/VHjcQ7MtUrD6hXaGA
