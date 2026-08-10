# Patch — só o que mudou

Comparei o seu export com o build integrado, arquivo por arquivo (MD5).
**314 KB** em vez dos 10 MB do pacote completo.

| | |
|---|---|
| Inalterados (não vão no patch) | 292 |
| Modificados | 3 |
| Novos | 75 |
| Removidos | 0 |

## Como aplicar

Copie tudo por cima da pasta do seu export e suba:

```sh
cp -r caminho/do/patch/* .
rm LEIA-PRIMEIRO.md
git add -A
git commit -m "Sprites Dogelon, tiro, controles PC e mobile"
git push
```

Não precisa apagar nada: nenhum arquivo seu foi removido.

## Os 3 modificados

- **`data.js`** — animações do Dogelon no `Hero`, o projétil no
  `HeroAttackHitbox`, os 72 recursos novos, tela cheia em paisagem
  (`scaleOuter`), EXIT GAME virou CONTROLS, marca do GDevelop desligada,
  papel de parede do título cobrindo, sprite solto removido, fundo das cenas
  escurecido
- **`index.html`** — carrega os 3 scripts e um CSS que tira as margens da página
- **`GUIMain-1-0.png`** — o retrato do HUD, que ainda era o herói de capa roxa

## Os 75 novos

- **72 PNGs** do Dogelon: 9 animações do herói (Idle, Run, Attack, Jump, Hit,
  Fall, Dash, Dead, Respawn) e as 2 do projétil
- **`dogelon-blast.js`** — tiro à distância, morte, respawn, tiro no ar
- **`dogelon-controls.js`** — tela de CONTROLES e os 5 presets de teclado
- **`dogelon-touch.js`** — controle de toque, menu tocável, tela cheia

## O que NÃO foi tocado

Sua fase, o tilemap, os cenários, o céu marciano, o chefe caveira, os créditos,
a splash, os sons. Nenhum arquivo seu foi apagado ou substituído fora dos 3
listados acima.
