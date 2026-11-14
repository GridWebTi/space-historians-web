# Handoff — Idiomas no MVP

## Objetivo

Adicionar seletor e infraestrutura reutilizável de tradução. Nesta etapa, somente a interface atual, o prólogo e a primeira missão (ALSEP da Apollo 12) devem ficar completos em português, inglês e espanhol. Não replicar ainda as outras 11 missões.

## Fluxo de trabalho

```bash
git checkout main
git pull
git checkout -b fernando/i18n-mvp
npm install
npm run dev
```

Não trabalhar diretamente na `main`. Entregar por pull request, sem merge automático.

## Requisitos funcionais

- Exibir antes do prólogo: `Português`, `English` e `Español`.
- Usar `pt-BR` quando não existir preferência salva.
- Manter um controle compacto `PT · EN · ES` durante o jogo.
- Salvar a escolha em `localStorage` com a chave `space-historians-language`.
- Valores permitidos: `pt-BR`, `en-US` e `es-ES`.
- Trocar o idioma sem reiniciar o jogo ou apagar posição, pontos, descobertas e etapas concluídas.
- Atualizar também `document.documentElement.lang` e textos de acessibilidade.
- Quando uma tradução não existir, usar `pt-BR` sem mostrar a chave técnica.

## Arquitetura sugerida

```text
src/i18n/index.ts
src/i18n/types.ts
src/i18n/locales/pt-BR.ts
src/i18n/locales/en-US.ts
src/i18n/locales/es-ES.ts
src/story-data.ts
```

Criar `SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES'` e uma função simples, por exemplo `t('intro.start')`. Remover textos traduzíveis fixos de `index.html` e `main.ts`. Preservar nomes oficiais: Apollo 12, ALSEP, Intrepid e Oceanus Procellarum.

Traduzir HUD, rota, objetivo, controles, botões, descoberta, pontuação, feedback, mensagens de erro, prólogo e a missão completa do ALSEP.

## Chaves mínimas

```text
app.title
language.choose
language.portuguese
language.english
language.spanish
progress.lunarArchive
mission.label
mission.currentObjective
mission.findStation
mission.followSignal
route.title
route.current
route.locked
controls.walk
controls.hint
intro.start
discovery.found
discovery.investigate
discovery.count
discovery.mission
discovery.year
discovery.points
discovery.completed
discovery.continue
activity.tryAgain
```

## Português — conteúdo de referência

### Prólogo

**Sobrancelha:** PRÓLOGO · UM ARQUIVO CHEIO DE PERGUNTAS

**Título:** As histórias que ficaram na Lua

1. A superfície lunar ocupa a janela da sua nave. Há crateras, pedras e sombras compridas. No mapa, pequenos pontos marcam os locais que você poderá explorar.
2. Você abre a mochila digital. O arquivo Space Historians aparece com doze fichas ainda incompletas.
3. Equipamentos guardam histórias. Para descobri-las, observe, experimente nas simulações e procure evidências.

**Missão:** Encontre os equipamentos e descubra como cada um ajudou as pessoas a conhecer melhor a Lua.

**Botão:** Abrir o mapa lunar

### ALSEP da Apollo 12 — O chão guardou a partida

**Encontro:** Uma antena se destaca em Oceanus Procellarum. Cabos ligam a central a instrumentos espalhados pelo terreno. / Você abre a ficha. Um registro cheio de pequenas oscilações aparece na tela. / Por que o chão se moveu? A resposta pode estar em uma nave que já partiu.

**O que é? — Uma estação científica:** Você encontrou o ALSEP da Apollo 12, uma estação científica instalada em 1969. Ela reunia instrumentos para investigar a Lua, incluindo um sismômetro, que registrava vibrações do solo. Sua antena transmitia medições à Terra. Depois da partida dos astronautas, a estação continuou enviando informações.

**Pergunta:** Qual instrumento registrava as vibrações do solo?  
**Opções:** Sismômetro | Câmera | Antena parabólica  
**Feedback:** Descoberta registrada: uma estação podia continuar a pesquisa sem pessoas ao lado.

**O que fez na Lua? — O chão registrou o impacto:** O sismômetro percebeu vibrações da decolagem do Intrepid. Depois, registrou por quase uma hora as vibrações do impacto planejado de seu estágio de subida, já vazio.

**Pergunta:** Qual registro mostra vibrações que continuam depois do impacto?  
**Opções:** ━━━ linha quase imóvel | 〰〰〰 oscilações prolongadas  
**Feedback:** As oscilações aparecem. Você encontrou a pista deixada pelo acontecimento!

**Como sabemos? — Registros que se confirmam:** Os registros da missão documentam o impacto. Os dados do sismômetro mostram as vibrações. Relacionar os dois ajudou os cientistas a interpretar o sinal e testar o instrumento.

**Pergunta:** Que duas evidências precisam ser ligadas?  
**Opções:** Registro do impacto + sinal sísmico | Fotografia + marca de roda | Mapa + amostra de rocha  
**Feedback:** Sua ficha está completa. O módulo partiu, mas o chão guardou seu rastro.

## English copy

### Prologue

**Eyebrow:** PROLOGUE · AN ARCHIVE FULL OF QUESTIONS  
**Title:** The stories left on the Moon

1. The lunar surface fills your spacecraft window. There are craters, rocks, and long shadows. On the map, small dots mark the places you can explore.
2. You open your digital backpack. The Space Historians archive appears with twelve unfinished records.
3. Equipment holds stories. To uncover them, observe, experiment with the simulations, and look for evidence.

**Mission:** Find the equipment and discover how each object helped people learn more about the Moon.  
**Button:** Open the lunar map

### Apollo 12 ALSEP — The ground remembered the departure

**Encounter:** An antenna stands out in Oceanus Procellarum. Cables connect the central station to instruments spread across the surface. / You open the record. A signal filled with small vibrations appears on the screen. / Why did the ground move? The answer may lie in a spacecraft that has already departed.

**What is it? — A scientific station:** You found the Apollo 12 ALSEP, a scientific station installed in 1969. It brought together instruments for studying the Moon, including a seismometer that recorded vibrations in the ground. Its antenna transmitted measurements to Earth. After the astronauts left, the station continued sending information.

**Question:** Which instrument recorded vibrations in the ground?  
**Options:** Seismometer | Camera | Parabolic antenna  
**Feedback:** Discovery recorded: a station could continue its research without people nearby.

**What did it do on the Moon? — The ground recorded the impact:** The seismometer detected vibrations from the Intrepid's liftoff. It later recorded vibrations for nearly an hour after the planned impact of the empty ascent stage.

**Question:** Which signal shows vibrations continuing after the impact?  
**Options:** ━━━ almost still line | 〰〰〰 prolonged vibrations  
**Feedback:** The vibrations appear. You found the clue left by the event!

**How do we know? — Records that confirm each other:** Mission records document the impact. Seismometer data shows the vibrations. Connecting the two helped scientists interpret the signal and test the instrument.

**Question:** Which two pieces of evidence should be connected?  
**Options:** Impact record + seismic signal | Photograph + wheel track | Map + rock sample  
**Feedback:** Your record is complete. The module departed, but the ground preserved its trace.

## Contenido en español

### Prólogo

**Encabezado:** PRÓLOGO · UN ARCHIVO LLENO DE PREGUNTAS  
**Título:** Las historias que quedaron en la Luna

1. La superficie lunar ocupa la ventana de tu nave. Hay cráteres, rocas y sombras alargadas. En el mapa, pequeños puntos señalan los lugares que podrás explorar.
2. Abres tu mochila digital. El archivo de Space Historians aparece con doce fichas todavía incompletas.
3. Los equipos guardan historias. Para descubrirlas, observa, experimenta con las simulaciones y busca evidencias.

**Misión:** Encuentra los equipos y descubre cómo cada uno ayudó a las personas a conocer mejor la Luna.  
**Botón:** Abrir el mapa lunar

### ALSEP del Apollo 12 — El suelo guardó la partida

**Encuentro:** Una antena se destaca en Oceanus Procellarum. Unos cables conectan la estación central con instrumentos distribuidos por el terreno. / Abres la ficha. En la pantalla aparece un registro lleno de pequeñas oscilaciones. / ¿Por qué se movió el suelo? La respuesta puede estar en una nave que ya partió.

**¿Qué es? — Una estación científica:** Encontraste el ALSEP del Apollo 12, una estación científica instalada en 1969. Reunía instrumentos para investigar la Luna, entre ellos un sismómetro que registraba las vibraciones del suelo. Su antena transmitía las mediciones a la Tierra. Después de la partida de los astronautas, la estación continuó enviando información.

**Pregunta:** ¿Qué instrumento registraba las vibraciones del suelo?  
**Opciones:** Sismómetro | Cámara | Antena parabólica  
**Respuesta:** Descubrimiento registrado: una estación podía continuar la investigación sin personas a su lado.

**¿Qué hizo en la Luna? — El suelo registró el impacto:** El sismómetro detectó las vibraciones del despegue del Intrepid. Después, registró durante casi una hora las vibraciones producidas por el impacto planificado de su etapa de ascenso, ya vacía.

**Pregunta:** ¿Qué registro muestra vibraciones que continúan después del impacto?  
**Opciones:** ━━━ línea casi inmóvil | 〰〰〰 oscilaciones prolongadas  
**Respuesta:** Aparecen las oscilaciones. ¡Encontraste la pista que dejó el acontecimiento!

**¿Cómo lo sabemos? — Registros que se confirman:** Los registros de la misión documentan el impacto. Los datos del sismómetro muestran las vibraciones. Relacionar ambos elementos ayudó a los científicos a interpretar la señal y probar el instrumento.

**Pregunta:** ¿Qué dos evidencias deben relacionarse?  
**Opciones:** Registro del impacto + señal sísmica | Fotografía + huella de rueda | Mapa + muestra de roca  
**Respuesta:** Tu ficha está completa. El módulo partió, pero el suelo conservó su rastro.

## Critérios de aceite

- [ ] Seletor visível antes do prólogo; português como padrão.
- [ ] Preferência persiste após recarregar.
- [ ] Atributo `lang`, HUD, rota, controles, objetivos e feedback acompanham o idioma.
- [ ] Prólogo e primeira missão estão completos nos três idiomas.
- [ ] Não há textos traduzíveis fixos em `index.html` ou `main.ts`.
- [ ] Troca de idioma atualiza o cartão aberto sem alterar posição, progresso ou pontuação.
- [ ] Pontuação continua limitada a 60; respostas mantêm os mesmos índices.
- [ ] Chave ausente usa português como fallback.
- [ ] Não há texto cortado em 1366×768.
- [ ] Funciona em Chrome e Edge, sem erros no console.
- [ ] `npm run build` termina sem erros.

## Testes mínimos

1. Iniciar sem preferência salva e confirmar português.
2. Escolher inglês, recarregar e confirmar persistência.
3. Escolher espanhol e concluir a primeira missão.
4. Com 10 pontos, trocar o idioma e confirmar que os pontos permanecem.
5. Com o cartão aberto, alternar os três idiomas.
6. Concluir tudo e confirmar 60/60 em cada idioma.
7. Simular chave ausente e confirmar fallback em português.
8. Conferir console e executar o build.

## Entrega

- pull request de `fernando/i18n-mvp` para `main`;
- resumo da arquitetura e arquivos alterados;
- resultado do build e dos testes;
- capturas do seletor e da primeira missão nos três idiomas;
- pendências de revisão humana.

## Prompt pronto para o agente

```text
Implemente a internacionalização do MVP do Space Historians seguindo integralmente docs/I18N_MVP_HANDOFF.md.

Verifique primeiro o projeto atual com npm install, npm run dev e npm run build. Crie a branch fernando/i18n-mvp e não trabalhe diretamente na main.

Implemente o seletor PT/EN/ES, persistência em localStorage, fallback para pt-BR e atualização dinâmica dos textos sem perder progresso. Traduza completamente apenas a interface existente, o prólogo e a primeira missão do ALSEP da Apollo 12, usando o conteúdo da especificação.

Não replique os outros 11 objetos, não reescreva a cena 3D e não remova mecânicas existentes.

Ao terminar, execute todos os critérios de aceite, rode npm run build e abra um pull request sem merge automático. Informe arquivos alterados, testes executados, resultado do build e pendências.
```
