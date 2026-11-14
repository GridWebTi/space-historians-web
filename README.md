# Space Historians

Protótipo de jogo educativo 3D criado para o NASA Space Apps Challenge. Crianças de 8 a 12 anos exploram a superfície lunar, encontram equipamentos deixados por missões espaciais e investigam suas histórias.

## Estado atual

- exploração lunar em 3D;
- astronauta controlável com `W`, `A`, `S`, `D` ou setas;
- primeiro objeto: ALSEP da Apollo 12;
- prólogo narrativo;
- três camadas de investigação;
- atividades interativas e pontuação de conhecimento;
- estrutura preparada para 12 descobertas.

## Executar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite no navegador.

## Gerar versão de produção

```bash
npm run build
```

Os arquivos publicados serão criados na pasta `dist`.

## Tecnologias

- TypeScript
- Vite
- Babylon.js

## Conteúdo

Os textos narrativos ficam centralizados em `src/story-data.ts`. Isso permite atualizar histórias e preparar traduções sem alterar a estrutura 3D.

## Créditos

Consulte [ASSET_CREDITS.md](ASSET_CREDITS.md) para os créditos e licenças dos modelos utilizados.

## Status

Protótipo em desenvolvimento. Ainda não representa a versão final do jogo.
