# Patch incremental — Dogelon Mars

Só o que mudou em relação ao `dogelonskull-main.zip` original.
**229 KB** em vez de 5,1 MB.

Comparei os 277 arquivos originais com os 336 atuais, por hash MD5:

| | |
|---|---|
| Inalterados (não vão no patch) | 216 |
| Modificados | 39 |
| Novos | 81 |
| Removidos | 22 |

## Como aplicar

Na raiz do seu repositório:

```sh
# 1. copiar os arquivos novos e modificados por cima
cp -r caminho/do/patch/* .
rm LEIA-PRIMEIRO.md

# 2. apagar os do herói antigo, que não existem mais
sh APAGAR-do-repo.sh
rm APAGAR-do-repo.sh

# 3. conferir e subir
git status
git add -A
git commit -m "Retheme Dogelon Mars: herói, tiro, morte/respawn, cenário sci-fi, splash"
git push
```

## Atenção ao passo 2

Copiar por cima **não apaga** os 22 PNGs do herói antigo (`Idle-*`, `Run-*`,
`Attack-*`, `Jump-*`, `Hit-1`, `HeroAttackHitbox-1`). Eles não quebram o jogo
— o `data.js` não referencia mais nenhum deles — mas ficam ocupando espaço no
repo e no deploy. O `APAGAR-do-repo.sh` usa `git rm --ignore-unmatch`, então
é seguro rodar mesmo que algum já tenha sumido.

## Os 3 arquivos que carregam quase tudo

- `data.js` (164 KB) — animações do Dogelon, projétil, tela de carregamento,
  marca do GDevelop desligada, textos do menu
- `tiles.png` (32 KB) — o cenário inteiro repintado com o tileset Foozle
- `index.html` — só uma linha a mais, carregando o `dogelon-blast.js`

## Nas próximas vezes

Depois deste primeiro commit, o Git já cuida do incremental sozinho: `git add
-A` só envia o que mudou. Este patch só é necessário agora porque o repo ainda
está na versão original.
