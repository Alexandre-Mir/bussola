Blueprint Sistêmico Consolidado — App LMS / Gerenciador de Estudos

1. Arquitetura Geral da Aplicação (Shell)
   Layout do tipo Admin Dashboard.

Sidebar lateral fixa e colapsável.

Área de conteúdo principal fluida.

Navegação hierárquica:
Planejamento → Visão Geral, Calendário, Trilha Semanal, Ciclo de Estudos, Revisões, Edital Verticalizado, Simulados, Histórico, Configurações.

Design System:
Clean UI, hierarquia tipográfica clara, Dark Mode nativo, uso extensivo de Empty States educacionais.

2. Criação de Planos de Estudo (Instanciação do Objeto Principal)
   2.1 Modal de Criação de Plano (Decision Fork)
   Interface modal obrigatória no primeiro acesso e disponível sob demanda.
   Caminhos Disponíveis
   A. Editais Pré-cadastrados (Curadoria)
   Seleção de editais previamente estruturados.

Importação automática de:

Disciplinas.

Tópicos.

Estrutura hierárquica padrão.

Base para recursos como Edital Verticalizado e Análise de Progresso.

B. Plano Personalizado (Manual)
Criação do plano do zero.

Cadastro manual de disciplinas e conteúdos.

Suporte à colagem de texto bruto (ex.: edital em PDF ou DOC).

Parser em tempo real para conversão de linhas em conteúdos.

C. Importação de Planilha (Migração)
Importação estruturada de dados oriundos da “Planilha do Aprovado”.

Mapeamento assistido de colunas:

Disciplina.

Conteúdo.

Horas.

Revisões.

Histórico de estudos.

Validação e preview antes da persistência.

3. Planejamento de Estudos (Ciclos e Cronogramas)
   3.1 Ciclo de Estudos (Rotacional)
   Modos de Criação
   Automático (Algoritmo de Rebalanceamento Dinâmico):
   Geração algorítmica baseada em um sistema de pesos multicritério:

   A. Peso do Edital (PE): Proporcional ao número de itens estimados na prova.

   B. Fator de Risco Cebraspe (FRC):
   Cálculo do Desempenho Líquido ($DL = C - E$).
   Sensibilidade ao Erro: Disciplinas com alto volume de erros ($E$) recebem um multiplicador de carga horária para mitigar a perda de pontos líquidos.
   Fórmula de Reequilíbrio: $NovaCarga_i = \frac{PE_i \times (1 - DL_i)}{ \sum (PE \times (1 - DL)) } \times TotalHoras$.

   C. Nível de Domínio (ND): Input subjetivo inicial recalibrado por dados objetivos de logs.

   D. Carga horária semanal disponível.

   3.1.1 Ciclo de Recuperação de Pontos (Auto-Ajuste)
   Sempre que o Desempenho Líquido ($C-E$) cair abaixo de um limiar crítico (ex: 40%), o algoritmo prioriza essa disciplina no próximo ciclo ("Caminho Crítico"), aumentando o tempo de Teoria e Revisão até que a taxa de acertos estabilize.

   3.1.2 Inteligência de ROI e Estratégia de Omissão
   Para evitar o "Sunk Cost Fallacy" (desperdício de tempo em matérias de baixíssimo retorno), o algoritmo executa um **Decision Fork** estratégico:

   A. Verificação de Mínimos Editalícios (Hard Limit):
   O sistema monitora os requisitos do item 8.11.4 do edital (Mínimo de 10 em P1 e 21 em P2). Se a omissão total colocar em risco a eliminação por nota mínima, o aumento de carga horária é **mandatório** e focado em tópicos de alta recorrência e baixa complexidade ("Catadores de Pontos").

   B. Curva de Eficiência de Estudo (CEE):
   O algoritmo cruza $HorasEstudadas$ vs $\Delta DL$.
   - Se $\Delta DL \approx 0$ após 3 ciclos de recuperação: O sistema sinaliza **Platô de Rendimento**.
   - Recomendação de Omissão: O Bússola sugere reduzir a carga horária para "Manutenção de Base" (apenas revisões rápidas) e adotar a estratégia de deixar itens complexos em branco, liberando o tempo excedente para disciplinas de **Médio Domínio**, onde o ROI de pontos é maior e mais rápido.

   C. Realocação por Custo de Oportunidade:
   O tempo "economizado" da matéria com baixa eficiência é injetado automaticamente nas disciplinas onde o usuário está na "Zona de Ganho" (aproveitamento entre 60-70%), visando levá-las para os +85%, o que é matematicamente mais eficiente para a classificação final do que tentar subir de 20% para 40% em uma matéria hostil.

   3.1.3 Análise de Massa Crítica de Sobrevivência (Teto de Literalidade)
   O algoritmo executa um **Stress Test** matemático para validar se a estratégia de "fugir do complexo" é suicida:

   A. Cálculo do Potencial de Base (PB):
   O sistema cruza a recorrência histórica do Cebraspe com a taxonomia de complexidade de cada tópico do [**Conteudo Programatico.md**](./Conteudo%20Programatico.md).
   - $PB = \sum (Questões\_Literais / Total\_Items)$.
   - Se o $PB \times Taxa\_Acerto\_Estimada$ for menor que 1.5x o mínimo editalício (ex: P1 < 15 pontos potenciais), o sistema emite um alerta de **Insuficiência de Massa Crítica**.

   B. O Gatilho de "Enfrentamento Obrigatório":
   Se a literalidade não sustenta os mínimos, o Bússola transmuta o ROI.
   - O sistema identifica o tópico de "Alta Complexidade" com a menor curva de aprendizado (menor tempo médio de resolução no dashboard global) e o marca como **Nódulo de Sobrevivência**.
   - Esse tópico torna-se o alvo principal do Ciclo, com carga horária protegida, forçando o usuário a subir o degrau técnico para não ser eliminado por falta de "matéria-prima" de pontos no bloco.

   C. Simulador de Ponto de Equilíbrio:
   Interface visual que mostra: "Para passar com segurança em P2, você precisa de 35 pontos brutos. A literalidade te dá no máximo 22. Você é OBRIGADO a aprender [Tópico X] e [Tópico Y] para ter margem de erro".

   3.1.4 Salvaguarda de Integridade Líquida (Anti-Chute de Sobrevivência)
   Para garantir que o "Enfrentamento Obrigatório" não resulte em anulação de pontos de literalidade, o sistema aplica o **Filtro de Seletividade Tática**:

   A. Estudo Mandatório != Marcação Mandatória:
   O Bússola separa o objetivo de **Estudo** (ganhar massa crítica) do objetivo de **Prova** (gerir risco).
   - Mesmo que um tópico seja um "Nódulo de Sobrevivência", o sistema só autoriza a marcação no simulado/prova se o seu **IC (Índice de Calibração)** específico no tópico for > 0.7.
   - Se o IC for baixo, o sistema recomenda: "Você estudou este tema complexo para salvaguardar os mínimos, mas a sua precisão ainda é instável. **MANTENHA A OMISSÃO** neste item para não contaminar sua nota líquida de P1/P2".

   B. O "Nódulo de Alta Fidelidade":
   A IA identifica dentro do tema complexo quais são os "Fragmentos de Alta Fidelidade" (sub-tópicos onde a banca é previsível).
   - O sistema te treina para ser **cirúrgico**: "Marque apenas se o item cobrar X ou Y; se a complexidade escalar para Z, abstenha-se".
   - Isso protege os seus ganhos de literalidade, garantindo que o enfrentamento do complexo seja uma busca por **Pontos de Bônus Seguros**, e não um "Tudo ou Nada" desesperado.

   C. Diagnóstico de Drenagem de Pontos:
   Se nos simulados o sistema detectar que o Nódulo de Sobrevivência está subtraindo mais de 3 pontos do seu bloco de literalidade, o algoritmo recalibra o ROI e sugere a **Troca de Nódulo**: ele busca outro tema de alta complexidade com menor taxa de "falsa convicção" para substituir o alvo anterior.

   3.1.5 Pivoteamento para Alta Performance (Ranking Mode)
   Para impedir que a "Segurança dos Mínimos" (10/21) se torne um teto de vidro que impeça a aprovação final, o sistema implementa o **Pivoteamento de Risco Dinâmico**:

   A. A Zona de Transição de Estratégia:
   O Bússola utiliza um semáforo de risco baseado na sua Nota Líquida Projetada:
   - **Modo Sobrevivência (Vermelho):** Nota < 1.2x o Mínimo. Foco total em Omissão e Literalidade.
   - **Modo Estabilização (Amarelo):** Nota entre 1.2x e 1.5x o Mínimo. Início do enfrentamento cirúrgico de Nódulos de Sobrevivência.
   - **Modo Ranking (Verde):** Nota > 1.5x o Mínimo (ex: P1 > 15, P2 > 32). Aqui, o sistema gira o "dial" para **Agressividade Controlada**.

   B. Identificação dos "Itens de Classificação" (Alpha Items):
   No Modo Ranking, o algoritmo deixa de focar apenas no que é "seguro" e passa a mapear os itens que são "o diferencial do aprovado".
   - O sistema identifica temas de **Dificuldade Média-Alta** onde o seu IC está em crescimento (ex: entre 0.5 e 0.65).
   - Em vez de recomendar a omissão, o Bússola sinaliza: "Estes são os itens que te colocarão nas vagas. A sua base está segura o suficiente para você **arriscar a marcação** aqui. O ganho potencial de classificação supera o risco de perda líquida".

   C. O Delta de Corte (Projeção de Vagas):
   O sistema cruza estatísticas de concursos similares para o Cargo 15 e define a **Nota de Corte Estimada (NCE)**.
   - Se a sua "Nota Segura" está abaixo da NCE, o sistema gera o plano de **Ataque de Intervalo**: ele seleciona 5 a 10 itens que você normalmente deixaria em branco e te treina intensivamente para converter a "Dúvida" em "Certeza Técnica", elevando seu teto de pontuação de forma consciente.

   D. Simulado de Stress de Ranking:
   Nos Simulados Finais, o Bússola alterna:
   - 50% dos itens são focados em manter a "Nota de Sobrevivência".
   - 50% são desenhados para testar o seu **Limite de Ousadia**: o sistema te avalia pela sua capacidade de extrair pontos de questões ambíguas sem desintegrar sua base líquida, garantindo que você chegue no dia da prova com a "faca nos dentes" para a classificação, não apenas para a sobrevivência.

     3.1.6 Normalização de Performance por ISQ (Índice de Severidade)
     Para impedir a criação de um "Ranking Fictício" baseado em questões excessivamente fáceis, o sistema aplica uma métrica de deflação/inflação de nota:

   A. Cálculo do ISQ (Índice de Severidade da Questão):
   Cada questão na base de dados possui um ISQ (0.1 a 1.0) baseado na taxa de erro global e complexidade estrutural.

   B. O Fosso de Severidade:
   O sistema calcula a média de ISQ das questões resolvidas pelo usuário ($ISQ_{user}$) e a compara com o benchmark da prova alvo ($ISQ_{bench}$ - Ex: 0.65 para FUB Cargo 15).
   - Se $ISQ_{user} < ISQ_{bench}$: O sistema sinaliza um **Fosso de Severidade** e aplica um redutor à Nota Líquida Projetada, alertando: _"Sua nota 90 é fictícia; em uma prova de nível real (ISQ 0.65), ela equivaleria a um 72"_.

   C. Metas de Treinamento por Faixa de Dificuldade:
   O Bússola força o usuário a equilibrar sua "Dieta de Questões". Se o $ISQ_{user}$ estiver muito baixo, o sistema bloqueia o estudo de tópicos de literalidade e exige a resolução de uma "Cota de Complexidade" para revalidar a projeção de ranking.

   3.1.7 Solução do Paradoxo da Sobrevivência (ROI Híbrido)
   Para evitar que o foco em literalidade impeça a competitividade, o algoritmo de rebalanceamento opera sob o **Princípio da Escassez Inteligente**:

   A. Lock de Manutenção de Base:
   Assim que a Projeção de Literalidade atinge **1.5x o mínimo** (ex: 15 pontos em P1 / 32 pontos em P2), o sistema ativa o **Lock**. A carga horária para temas de Baixo ISQ é "achatada" para apenas o tempo estritamente necessário para revisões (SRS), impedindo que matéria-prima de tempo seja desperdiçada em temas onde o ganho marginal de pontos já estagnou.

   B. Alocação Transbordante (Overflow):
   Todo o tempo economizado pelo Lock é injetado em **Itens Alpha** (Alto ISQ / Média Complexidade). O algoritmo para de olhar para o DL (Desempenho Líquido) bruto e passa a ponderar o peso pela fórmula: $Fator\_Carga = \frac{ISQ}{DL}$.
   - Isso prioriza temas difíceis onde você ainda tem muito a crescer, forçando a subida da **Nota Normalizada**.

   C. O Gatilho de "All-In" Tático:
   Se a Projeção Total (Soma de todos os blocos) estiver a menos de 5 pontos da Nota de Corte (NCE) mas sua Nota Normalizada estiver baixa devido ao Fosso de Severidade, o Bússola entra em **Modo All-In**: ele suspende o estudo de matérias de Médio Domínio e foca 100% da carga horária nos 3 tópicos de maior ISQ do edital que possuem maior recorrência histórica.

   _Resultado:_ O sistema garante os 10/21 pontos nos primeiros 40% do ciclo de estudos e usa os 60% restantes para "caçar" os pontos de elite que definem a Zona Alpha.

   Manual:
   Definição explícita de ordem, tempo e recorrência das matérias.

Wizard de Criação (Stepper)
Seleção de matérias.

Ponderação da carga horária.

Fragmentação automática em blocos de estudo.

Visualização proporcional em gráfico de rosca.

3.2 Planejamento Semanal (Trilha Semanal)
Visualização em quadro semanal (Segunda a Domingo).

Distribuição de sessões por dia.

Interação via arrastar e soltar.

Repetição rápida de eventos.

Destaque visual do dia corrente.

Criação rápida de tarefas por coluna.

4. Registro e Execução do Estudo (Logging)
   4.1 Modos de Registro
   Cronômetro (Estudo ao Vivo)
   Registro automático de tempo.

Modos Pomodoro ou Cronômetro livre.

Associação direta à matéria e conteúdo.

Registro Manual
Data.

Categoria:

Teoria.

Revisão.

Questões.

Lei seca.

Jurisprudência.

Tempo gasto.

Conteúdo estudado.

Material utilizado.

    4.5 Sincronização Externas (Modo Overlay)
    Para resolver a fragmentação entre o Bússola e sites de questões (Qconcursos, TEC, etc.):

    A. Overlay de Comando (Global Hotkeys):
    O sistema opera como uma camada invisível. O usuário utiliza atalhos globais (ex: `Alt+C` para CERTO e `Alt+E` para ERRADO) que registram a resposta no Bússola enquanto ele permanece na tela do site de questões. Não há necessidade de alternar janelas (`Alt+Tab`).

    B. Event-Driven Timing (Smart Stop):
    O cronômetro do Bússola é sensível ao foco da janela e a eventos de rede (via extensão opcional).
    - **Detecção de Latência:** O sistema desconta automaticamente o tempo de carregamento da página do site externo (Network Idle), iniciando a contagem apenas quando a questão está visível.
    - **Fim Preciso:** A métrica de resolução é encerrada no milissegundo em que o atalho global é acionado, eliminando o erro humano de registro tardio.

    C. Importação Assíncrona via Parser:
    Para sessões offline ou sem overlay, o sistema possui um parser de "Texto Bruto". O usuário copia o log do site de terceiros e o Bússola reconstrói a linha do tempo, cruzando o horário de cada registro com o seu log de atividades para validar a duração média.

    4.6 Estratégia de Calibração Híbrida (Nativo vs. Externo)
    Para resolver a falta de granularidade (convicção/erro específico) nos dados agregados de sites terceiros, o algoritmo utiliza **Inferência de Comportamento**:

    A. Projeção de Índice de Calibração (IC):
    O sistema mapeia o seu comportamento estatístico no **Núcleo Estratégico** (Questões nativas do Cargo 15). Se no Bússola você apresenta 15% de "Falsa Convicção" em Direito Administrativo, o algoritmo aplica esse mesmo fator de risco como um redutor sobre os dados agregados do Qconcursos.
    *Lógica:* "Se o usuário erra com certeza no Cargo 15, o seu 80% do Qconcursos é, na verdade, um 68% líquido ajustado pelo risco de ponto cego".

    B. Detecção de "Vício de Questão" (Gap de Contexto):
    O algoritmo cruza sua performance nativa (questões repetidas em loop) com a externa (questões inéditas do site).
    - **Performance Nativa > Externa:** Alerta de Memorização de Resposta. O sistema identifica que você decorou o gabarito das provas do cargo 15, mas não domina a base, forçando revisões teóricas.
    - **Performance Externa > Nativa:** Alerta de Falta de Atenção/Fadiga em temas repetitivos.

    C. O Papel do Dashboard Externo como "Alerta de Tendência":
    Os dados do Qconcursos servem como um "Termômetro de Amplitude". Se a performance agregada externa cair, o Bússola aciona automaticamente uma **Auditoria de Ponto Cego**, injetando questões inéditas manuais ou forçando uma revisão no Ciclo, mesmo que os dados do Cargo 15 pareçam estáveis.

    4.7 Mecanismos Anti-Corrupção do IC (Combate ao Vício)
    Para impedir que a memorização ("vício de questão") corrompa o Índice de Calibração, o algoritmo implementa as seguintes travas:

    A. Desconto por Velocidade (DST - Decision Speed Threshold):
    Se o tempo de resposta for inferior a um limiar de processamento lógico (ex: < 3 segundos para itens complexos), o algoritmo **desconsidera o acerto** para fins de IC. Ele classifica o item como "Reconhecimento Visual" e não "Domínio Técnico". O dado é computado no histórico, mas não reduz a carga horária da matéria.

    B. Degradação Temporal de Confiança:
    O "valor de verdade" de um acerto no Núcleo Estratégico decai conforme o número de repetições aumenta.
    - 1ª Repetição: Peso 1.0 no IC.
    - 10ª Repetição: Peso 0.2 no IC.
    Para manter um IC alto, o usuário é obrigado a manter uma performance sólida em questões **Externas (Inéditas)**. O sistema "sabe" que você decorou o Cargo 15 e passa a exigir prova de vida intelectual no Qconcursos para validar seu Índice de Calibração.

    C. Auditoria por Transferência (Questão Fantasma):
    O sistema periodicamente solicita que o usuário explique, em 140 caracteres (micro-discursiva), o "porquê" do gabarito de uma questão que ele acertou repetidamente.
    *Faca de Dois Gumes:* Se você acerta o C/E (objetivo) mas erra a justificativa (rubrica), o sistema identifica a **Corrupção por Memorização** e reseta o seu nível de domínio naquele tópico, forçando o retorno à Teoria Base no Ciclo.

    D. Injeção de Entropia (Cross-Validation):
    O Bússola utiliza a performance externa (Qconcursos) como o "auditador de realidade". Se o seu IC nativo é 100% (você nunca erra o que tem certeza no Cargo 15) mas sua performance externa é baixa, o sistema gera o diagnóstico de **"Zumbi de Questão"** e injeta automaticamente novos exercícios de bancas similares (FGV/Vunesp) para testar a solidez do conceito.




    4.3 Rastreamento Metacognitivo (O "Botão da Certeza")
    Para calibrar a estratégia Cebraspe, o sistema introduz o **Grau de Convictividade** no log de questões:

    A. Marcação de Certeza (Pre-Result):
    Ao responder, o usuário marca o nível de confiança: [Baixa/Chute], [Média/Dúvida], [Alta/Total].

    B. Matriz de Diagnóstico Meta-Estatístico:
    - **Erro com Confiança Baixa:** Classificado como "Chute Infeliz". *Solução:* Reforço da Estratégia de Omissão (deixar em branco).
    - **Erro com Confiança Alta:** Classificado como **"Falsa Convicção"** (Ponto Cego). *Solução:* Alerta crítico. O sistema bloqueia o avanço e exige a leitura do comentário/teoria, pois este é o erro que anula pontos de forma invisível.
    - **Acerto com Confiança Baixa:** Classificado como "Sorte". *Solução:* O sistema agenda uma revisão imediata do tópico, pois o acerto mascarou uma lacuna de conhecimento.

    4.4 Gestão de Fricção e UX (Foco em Adesão)
    Para garantir o registro sem comprometer o fluxo de estudo ou viciar métricas:

    A. UX de "Um Clique" e Hotkeys:
    A marcação de certeza é integrada ao comando de resposta (ex: `Enter` para nível padrão, `Shift+Enter` para dúvida). No mobile, gestos de deslizar (swipe) definem o grau de confiança simultaneamente ao registro do item.

    B. Normalização do Tempo de Resolução (Debouncing):
    O sistema distingue o **Tempo de Decisão** (resolução do item) do **Tempo de Registro** (metacognição). O cronômetro "congela" a métrica de resolução assim que a resposta é selecionada, tratando o tempo de marcação da certeza como overhead administrativo descartado das estatísticas de velocidade.

    C. Logging por Amostragem ou Exceção:
    O usuário pode configurar o sistema para solicitar o "Botão da Certeza" apenas em:
    - Itens assinalados com tempo de resolução acima da média (detecção automática de dúvida).
    - Blocos de simulados específicos (Modo Teste).
    - Disciplinas em "Caminho Crítico" (baixo DL).

    D. Gamificação do Índice de Calibração:
    Em vez de ser um fardo, a marcação é incentivada através do "Índice de Honestidade". O sistema recompensa o usuário não apenas pelo acerto, mas pela precisão do seu autodiagnóstico, transformando a fadiga em engajamento tático.

5. Gestão de Revisões e Progresso
   5.1 Revisões Periódicas (SRS)
   Agendamento automático com base nos registros.

Intervalos configuráveis (ex.: 1, 7, 30 dias).

Abas de status:

Programadas.

Atrasadas.

Ignoradas.

Concluídas.

5.2 Edital Verticalizado
Visualização hierárquica por disciplina e tópico.

Indicadores de status:

Teoria finalizada.

Revisões realizadas.

Desempenho em questões.

Anexação de recursos externos:

PDFs.

Vídeos.

Links diversos.

Atualização automática baseada nos logs.

6. Análise de Desempenho e Simulados
   6.1 Estatísticas e Analytics
   Gráficos de:

Horas estudadas.

Constância (heatmap anual).

Desempenho por disciplina.

Desempenho por categoria de estudo.

KPIs consolidados:

Tempo líquido.

Percentual de acertos.

Progresso global.

6.2 Controle de Simulados
Registro de simulados:

Múltipla escolha.

Certo/Errado (modelo Cebraspe).

Lógica de correção configurável:

Anulação de acertos por erro.

Registro de notas.

Gráficos de evolução.

Análise detalhada por disciplina e tópico.

9. Treinamento de Prova Discursiva (Módulo P3)
   9.1 Simulador de Escrita
   Interface de prática com limitador de 30 linhas.

   Cronômetro específico para a redação (sugestão: 60-90 min).

   Repositório de temas focados em Atualidades (conforme item 9.1 do edital).

   9.2 Feedback e Correção (Learning Loop de Calibração)
   Para mitigar a subjetividade da autoavaliação, o sistema utiliza uma **Tríade de Calibração**:

   A. Rubricas de Conteúdo "Padrão de Resposta" (Bottom-Up):
   O sistema não solicita uma "nota solta". Ele decompõe o tema em tópicos (ex: Aspecto 1, Aspecto 2, Aspecto 3).
   O usuário deve marcar: [ ] Não mencionou (0%), [ ] Mencionou superficialmente (50%), [ ] Abordou com profundidade (100%).
   A NC final é o somatório ponderado dessas evidências, e não uma estimativa intuitiva.

   B. Triangulação com Desempenho Objetivo (Cross-Check):
   O "Índice de Coerência": Se o usuário possui 40% de acertos em "Direito Administrativo" nas objetivas, mas atribui-se NC 19/20 em uma discursiva do mesmo tema, o sistema emite um **Alerta de Inconsistência de Calibração**.
   Isso força o usuário a revisar a correção ou sinaliza um "ponto cego" de conhecimento.

   C. Motor de Cálculo Cebraspe e Auditoria de Erros:
   Input detalhado: Nota de Conteúdo (NC) granular, Número de Erros (NE) por categoria (Morfossintaxe, Propriedade Vocabular, Grafia) e Total de Linhas (TL).
   Fórmula nativa: NPD = NC – 4 × NE ÷ TL.
   Fator de Auditoria: O sistema permite anexar correções de terceiros ou IAs externas para gerar uma "Nota de Auditoria", calculando o **Delta de Otimismo** (Diferença entre autoavaliação e avaliação externa).

   9.3 "Shadow Scoring" via IA (Opcional/Premium)
   A IA atua como "Banca Sombra", analisando a presença de palavras-chave e a estrutura lógica para sugerir uma NC conservadora antes que o usuário faça sua própria avaliação.

   9.3 Histórico de Desempenho P3
   Gráfico de evolução da Nota Discursiva (NPD).
   Monitoramento da densidade de erros (NE/TL).
   Repositório de rascunhos para revisão posterior.

10. Personalização do Usuário (Settings Engine)
    10.1 Preferências de Estudo
    Definição de dias de estudo ativos.

    Exclusão de dias de descanso do cálculo de constância.

    10.2 Metas e Indicadores
    Configuração de faixas de desempenho:

    Verde.

    Amarelo.

    Vermelho.

    Percentuais customizáveis.

    10.3 Padrões de Revisão
    Definição de intervalos preferenciais.

    Aplicação automática nos registros.

11. Visão Sistêmica Final
    A plataforma opera como um painel de controle, estruturado em um ciclo contínuo:
    Configuração → Planejamento → Execução → Revisão → Análise → Ajuste
    O sistema não executa o estudo pelo usuário, mas fornece:
    Instrumentos (incluindo o laboratório de redação P3).

    Indicadores de Convergência (Objetiva + Discursiva).

    Alertas de gap de desempenho.

    Rotas claras para a classificação final.

    Permitindo decisões conscientes, correções de trajetória e maximização do desempenho com previsibilidade e segurança, reconhecendo o caráter eliminatório e classificatório da etapa escrita.

12. IA Local e Paráfrase Controlada (Módulo Anti-Decoreba)
    Para que o loop de questões do "Cargo 15" não se torne um exercício de memória visual, o sistema integra-se ao servidor Llama local (ex: 192.168.1.2:8080) sob um rigoroso **Protocolo de Integridade Semântica**.

    10.1 Escudos de Preservação (Token Locking)
    O sistema identifica e "trava" palavras-chave que definem o gabarito (Modificadores Lógicos e Jurídicos). A IA é proibida de alterar:
    - **Operadores de Escopo:** "exclusivamente", "diretamente", "conforme", "salvo", "em regra".
    - **Status de Deontologia:** "vedado", "facultado", "obrigatório", "deverá".
    - **Âncoras Jurídicas:** Números de leis, nomes de princípios e cargos específicos (ex: "Senador", "Reitor").

      10.2 Metodologia de Transformação (Syntactic Shifting)
      A IA é instruída a realizar apenas mudanças estruturais que mantenham o valor de verdade:

    - **Voz Passiva <-> Ativa:** "O Reitor expedirá o ato" vs "O ato será expedido pelo Reitor".
    - **Substituição por Sinônimos Neutros:** "Céleres" por "rápidos", "imperativo" por "essencial".
    - **Reordenação de Orações:** Troca da ordem de orações subordinadas que não alterem a causalidade.

      10.3 Validação por Justificativa (Consensus Check)
      Para garantir que a "pegadinha" sobreviveu, o sistema executa um **Double-Check Lógico**:
    1. A IA gera a paráfrase.
    2. O sistema envia a paráfrase de volta à IA perguntando: "Com base na Lei X, este item continua SENDO [Certo/Errado]? Justifique".
    3. Se a justificativa da IA divergir do gabarito original do Núcleo Estratégico, a paráfrase é descartada e o sistema exibe o item original (Fail-Safe).

       10.4 Diferenciação por Disciplina
    - **Português:** A IA é restrita. Foca em paráfrases que mantêm a análise sintática idêntica (foco em reescrita).
    - **Direito:** Foca na troca de exemplos fáticos mantendo a subsunção à norma idêntica.
    - **Administração/Informática:** Foca na atualização de jargões obsoletos por sinônimos modernos.

      10.5 Transparência (Audit Link)
      Todo item parafraseado exibe um pequeno ícone de "IA". Ao clicar, o usuário pode ver a **Versão Original** para auditar se houve corrupção semântica em caso de dúvida.

      10.6 Blindagem contra Efeito Eco (Anti-Self-Validation)
      Para que a IA não "valide o próprio erro" (Eco Chamber), o Bússola utiliza o **Gabarito Humano como Âncora Invariável**:

    A. Desafio Congruente (Adversarial Prompting):
    O sistema não pergunta à IA "Qual o gabarito deste novo item?".
    O sistema **afirma** o gabarito original (C ou E) e exige que a IA **prove**, citando o item original, por que a nova versão mantém a mesma lógica.
    _Se a IA não conseguir mapear o "Caminho da Lógica" entre o original e a paráfrase, o sistema bloqueia a versão._

    B. Análise de Entropia Sintática (Heurística Determinística):
    O Bússola executa um script (não-IA) de comparação de strings antes e depois da paráfrase.
    - Se a IA mover um "Token Travado" (ex: "exclusivamente") de uma oração subordinada para a principal, o sistema detecta a **mudança de escopo lógico** estatisticamente e descarta a questão automaticamente, sem perguntar à IA.

    C. O "Crowdsourced Calibration" (Feedback de Usuário):
    Se o usuário (Alexandre) errar uma questão de IA mas acertar o conceito original no loop, ou se identificar uma falha na paráfrase via Audit Link, ele sinaliza "Paráfrase Corrompida".
    - Isso gera uma **"Penalidade de Confiança"** no modelo.
    - Após 3 sinalizações em um tópico, o sistema suspende o motor de paráfrases para aquela disciplina específica, diagnosticando que a IA não domina a "pegadinha" daquela área.

    D. Âncora de Justificativa via Edital Verticalizado:
    O sistema fornece à IA os fragmentos exatos do [**Conteudo Programatico.md**](./Conteudo%20Programatico.md) relacionados à questão. A IA deve validar a paráfrase confrontando-a com o **texto da lei/edital**, e não com o texto da questão original, quebrando o ciclo de auto-referência.

    10.7 Preservação de DNA da Banca (Anti-Doutrina Geral)
    Para impedir que a IA utilize um "Direito Geral" que contrarie o "Direito Cebraspe", o sistema utiliza a **Justificativa Original do Item** como o limite semântico intransponível:

    A. Injeção do "Ratio Decidendi" no Prompt:
    Ao solicitar a paráfrase, o sistema não envia apenas a questão, mas a **Justificativa Oficial da Banca** (extraída do arquivo [**Provas Objetivas FUB.md**](./Provas%20Objetivas%20FUB.md)).
    _Instrução de Ouro:_ "Sua paráfrase DEVE ser sustentada por ESTE raciocínio específico: [Texto da Justificativa]. Se a mudança de uma palavra invalidar a justificativa original, a mudança é proibida."

    B. O "Veto por Divergência Doutrinária":
    O Bússola mantém um log de "Interpretações Polêmicas". Por exemplo, se o Cebraspe adota a corrente X sobre "Atos Compostos", essa preferência é injetada como uma **System Prompt** fixa.
    Se a IA tentar uma paráfrase que abra margem para a doutrina Y (geralmente aceita, mas errada no Cebraspe), o sistema identifica a divergência entre o gabarito original e a nova interpretação da IA e descarta a questão.

    C. Blindagem de "Pegadinha" por Contradição Externa:
    O sistema executa um teste de estresse: ele pede para a IA tentar "provar que o item está ERRADO" usando o Llama comum. Em seguida, ele pede para provar que está "CERTO" usando as âncoras da banca.
    - Se a IA mostrar que a paráfrase ficou ambígua o suficiente para ser defendida como Certo ou Errado (o que mataria a questão do Cebraspe), a paráfrase é considerada **Instável** e descartada.

    D. Aprendizado por Correção de Rumo:
    Quando o usuário identifica um conflito entre a "Lógica da IA" e a "Lógica da Banca", o sistema armazena esse evento como uma **Regra de Exceção Local**.
    _Exemplo:_ "Nesta matéria, o Cebraspe ignora a jurisprudência STJ e segue a Lei Seca". Essa regra passa a ser uma restrição de sistema para todas as paráfrases futuras daquela disciplina.

13. Bootstrapping de Justificativas (Alimentação Estratégica)
    Como o arquivo original [**Provas Objetivas FUB.md**](./Provas%20Objetivas%20FUB.md) é um "esqueleto" sem fundamentação, o sistema utiliza o usuário como o **Curador de DNA da Banca**, solicitando micro-justificativas ("justifique em 1 frase") de forma cirúrgica.

    11.1 Critérios de Seleção (Onde a escrita é mandatória)
    Para não gerar fadiga, o sistema exige a entrada manual da justificativa apenas em:
    - **Itens de Falsa Convicção:** Se você errou com "Total Certeza", o sistema bloqueia o avanço e exige: "Por que você achou que estava certo e por que o gabarito é este?". Isso torna-se a âncora de verdade para o Llama não repetir seu erro na paráfrase.
    - **Itens de Alta Complexidade/Tempo:** Se o usuário levou muito tempo para responder, o sistema interpreta como "Zona de Conflito" e solicita a síntese do raciocínio.
    - **Itens de Tópicos Inéditos:** No primeiro contato com um sub-tópico do edital, o sistema solicita a justificativa para criar a "Semente de Lógica" inicial daquela matéria.
    - **Amostragem Aleatória de Calibração:** 5% das questões acertas com "Dúvida" exigem justificativa para transformar sorte em conhecimento estruturado.

      11.2 Transformação de Input em "Regra de Ouro"
      A justificativa fornecida pelo usuário é armazenada no metadado da questão.
      _O Fluxo:_ Usuário escreve -> IA resume e valida contra o gabarito -> Justificativa torna-se a **Âncora de Paráfrase**.
      Dessa forma, o Llama passa a parafrasear com base no **seu** entendimento validado do "porquê" da banca, e não em um conhecimento genérico.

      11.3 Minimização de Gargalo (UX de Escrita)

    - **Voz para Texto:** Integração com Web Speech API para ditado da justificativa se estiver no mobile.
    - **Tags de Raciocínio rápido:** O usuário pode apenas selecionar tags (Ex: #Literalidade #Jurisprudência #PegadinhaDeVerbo) em vez de escrever texto livre, o que já fornece 80% da orientação lógica para a IA.

      11.4 Refinamento por Evidência de Erro (Audit Loop)
      Para impedir que uma justificativa "apenas plausível" seja canonizada como verdade, o sistema não usa cronômetros, mas **Gatilhos de Desempenho Cruzado**:

    A. O Evento de Conflito (Trigger):
    O sistema monitora questões **Externas (Qconcursos/Inéditas)** que mapeiam para o mesmo tópico da sua justificativa interna.
    _Se você errar uma questão externa inédita sobre um tema onde sua justificativa interna está marcada como "Sólida", o sistema gera uma **Crise de Confiança**._

    B. O Prompt de Refatoração:
    Na próxima vez que o item do "Cargo 15" aparecer no loop, o Bússola não apresentará a questão normal, mas um **Modo de Auditoria**:
    _"Alexandre, você errou o item X no Qconcursos recentemente. A sua justificativa para este item aqui diz [Sua Justificativa]. À luz do seu novo erro, ela ainda é 100% fiel à banca ou precisa ser ajustada?"._

    C. Incremento Diferencial:
    O sistema sugere a refatoração focando no "Delta". Ele pergunta: "Qual detalhe do erro externo faltava na sua explicação interna?". Isso garante que a justificativa evolua de "plausível" para "tecnicamente inatacável" baseada em evidência empírica de erro real.

    D. Proteção contra Refatoração Inútil:
    Se a sua performance externa no tópico for > 90%, o sistema **blinda** sua justificativa. Ele entende que seu modelo mental está correto e não te interrompe com pedidos de reescrita, protegendo seu alto volume de estudo.

    11.5 Hierarquia de Severidade (ISQ - Índice de Severidade da Questão)
    Para que questões externas "fáceis" não blindem prematuramente uma justificativa medíocre, o Bússola aplica o filtro de **Severidade de Elite**:

    A. Calibração por Taxa de Erro Global (ISQ):
    O sistema (via API ou Metadados do Dashboard) verifica o Índice de Severidade da questão externa.
    - Se a questão tem 80% de acerto global (Questão de Base), o seu acerto **não blinda** sua justificativa. O sistema a mantém em status "Em Validação".
    - A blindagem real só ocorre quando você acerta questões com **ISQ Alto (acerto global < 40%)**. Somente o sucesso no "Hard Level" externo valida a sua verdade interna como sendo de alto nível para a FUB.

    B. O Filtro de "Mirroring" (DNA da Banca de Origem):
    O Bússola prioriza como "Auditores de Elite" as questões externas que vêm de provas de tribunais superiores (STF, STJ, TST) ou órgãos de cúpula legislativa.
    _A Lógica:_ "Se você acerta o Administrativo de um tribunal no Cebraspe, sua base para a FUB (Cargo 15) está blindada. Se você só acertou questões de prefeituras pequenas, a porta para refatoração continua aberta".

    C. Estresse Analítico via IA (Adversarial Paraphrase):
    Para itens "blindados", o sistema pede ao Llama local: "Gere uma versão deste item que subverta a justificativa atual do Alexandre de forma sutil".
    - Se o sistema gerar uma paráfrase "mortal" que você errar no loop, a blindagem é removida. Isso prova que a sua justificativa era sólida apenas para o que você já conhecia, mas não para variações de alta complexidade.

    D. Alerta de "Falso Otimismo de Dashboard":
    Se o Bússola detecta que você está com 100% no Qconcursos mas apenas 60% nas questões de alto ISQ (difíceis), ele exibe uma notificação de **Risco de Blindagem Prematura**, forçando o sistema a ignorar os acertos fáceis e manter a exigência de micro-justificativas nos itens do Cargo 15.

    11.3 Minimização de Gargalo (UX de Escrita)
    - **Voz para Texto:** Integração com Web Speech API para ditado da justificativa se estiver no mobile.
    - **Tags de Raciocínio rápido:** O usuário pode apenas selecionar tags (Ex: #Literalidade #Jurisprudência #PegadinhaDeVerbo) em vez de escrever texto livre, o que já fornece 80% da orientação lógica para a IA.

14. Controle de Sofisticação Indevida (Anti-Overthinking)
    Para impedir que a preparação de elite (Módulo 11) corrompa a execução de itens simples da FUB, o Bússola introduz o **Filtro de Literalidade Burocrática**:

    12.1 Índice de Overthinking (IO)
    O sistema detecta matematicamente o erro por sofisticação:
    - **Detecção:** O usuário erra uma questão de **Baixo ISQ** (Fácil/Literal) mas acerta questões de **Alto ISQ** (Difícil/Jurisprudencial) no mesmo tópico.
    - **Diagnóstico:** O algoritmo identifica que o usuário está "procurando chifre em cabeça de cavalo". O sistema emite um alerta de **Sofisticação Indevida**.

      12.2 O "Modo Lei Seca" Forçado
      Sempre que o IO subir, o ciclo de estudos reage:

    - **Injeção de Literalidade:** O sistema suspende temporariamente o treinamento de "Elite" (Tribunais) e injeta um bloco massivo de questões de **literalidade pura** do Cebraspe para cargos de nível médio.
    - **Prompt de Resposta Rápida:** O Bússola reduz o tempo limite de resposta para esses itens, forçando o usuário a confiar no reconhecimento imediato da norma, sem espaço para divagações doutrinárias.

      12.3 Auditoria de Justificativa "Simples"
      Em casos de Overthinking, o sistema pede uma justificativa reversa:
      _"Alexandre, por que este item é uma literalidade do Art. X e por que a exceção jurídica que você imaginou não se aplica a esta prova especificamente?"._
      Isso força a separação consciente entre o **conhecimento acadêmico** e a **estratégia de prova de nível médio**.

      12.4 Calibração de "Vibe" da Questão (DNA de Cargo)
      O sistema utiliza metadados para ajustar a paráfrase da IA:

    - **Modo Elite:** Paráfrases que exploram exceções e nuances.
    - **Modo FUB:** Paráfrases que reforçam a literalidade e a interpretação gramatical básica.
      O Bússola garante que 70% do seu loop seja em "Modo FUB" para manter seu cérebro calibrado com a realidade do edital 2025.

      12.5 Monitor de Micro-Atenção (Filtro de Impulsividade)
      Para garantir que a velocidade do "Modo Lei Seca" não induza o erro por negligência (impulsividade), o sistema aplica a **Regra dos Tokens Críticos**:

    A. Marcação de Partículas de Gatilho:
    Através da IA local, o Bússola identifica "Partículas de Exclusão" (ex: _negligenciável, prescindível, unicamente, tão somente_) na questão.
    - Se você errar um item que contenha estas partículas e o tempo de resposta for extremamente baixo, o sistema classifica o erro não como "Falta de Conhecimento", mas como **"Miopia por Impulsividade"**.

    B. O Contra-Relógio Punitivo:
    Se o gatilho de impulsividade for ativado, o sistema **bloqueia** o avanço rápido.
    - Na próxima questão literal, o botão de resposta só é habilitado após 5 segundos de **"Leitura Obrigatória"**, forçando o tempo de maturação sintática que a sua impulsividade tentou pular.

    C. Auditoria de Destaque (Foco Seletivo):
    Em caso de erro por impulsividade, o Bússola reapresenta o item pedindo que o usuário **sublinhe (clicando no texto)** o termo exato que invalida a questão antes de fornecer o gabarito. Isso treina a "visão de raio-x" para detectar os venenos sutis da banca.

    D. Calibragem Dinâmica do Tempo:
    O "Modo Lei Seca" não é um tempo fixo, mas baseado na **Extensão do Item**.
    $TempoMax = (NumPalavras \times WPM\_Base) + Overhead\_Sintatico$.
    O Bússola ajusta o cronômetro para que ele pressione o seu "Overthinking" (impedindo divagações profundas), mas respeite o tempo biológico necessário para a leitura integral da frase, evitando o "chute por reflexo".

15. Curadoria de Itens Semente (Tópicos Inéditos 2025)
    Para tópicos onde não há histórico no "Cargo 15" (ex: Lei 14.133, SEI Operacional), o sistema utiliza um **Protocolo de Injeção Controlada**:

    13.1 Seleção por Analogia de Nível (Mirroring de Cargo)
    O sistema não importa qualquer questão sobre a Lei 14.133. Ele filtra o "Mundo Externo" buscando o **DNA do Cargo 15**:
    - **Filtro de Escopo:** Prioriza questões de cargos de "Assistente Administrativo" ou "Técnico" de universidades federais (IFs, UFMG, UFRJ) e autarquias federais.
    - **Rejeição de DNA Elite:** O algoritmo descarta automaticamente itens de concursos de Magistratura, Ministério Público e Auditoria, mesmo que sejam da mesma banca (Cebraspe). Isso impede que o "conhecimento de cúpula" corrompa a base burocrática necessária para a FUB.

      13.2 O "Semente SEI" (Simulação de Operação)
      Como a parte operacional do SEI (Sistema Eletrônico de Informações) é baseada em manuais técnicos:

    - O Bússola utiliza a IA para transformar os **Manuais Oficiais do TRF-4/UnB** em itens de Certo/Errado.
    - **Validação de Semente:** Esses itens são marcados como "Temporários". Eles só se tornam "Sementes Permanentes" após passarem por uma auditoria sua, onde você deve validar se a "vibe" da questão reflete o que o edital 2025 pede (foco em botões, processos e trâmites, não em teoria arquivística profunda).

      13.3 Quarentena de IC (Índice de Calibração)
      Questões sobre tópicos inéditos permanecem em **Quarentena de Calibração** por 2 ciclos:

    - Os acertos/erros nesses itens não afetam o seu Índice de Calibração (IC) global imediatamente.
    - **A Lógica:** Se nem a banca tem um padrão histórico consolidado (como na nova lei de licitações para este nível), o sistema não pode punir seu IC por uma divergência de interpretação inicial. O IC só é ativado após a estabilização da sua curva de acertos no tópico.

      13.4 Auditoria Human-in-the-Loop (Curadoria de Alexandre)
      No primeiro contato com a Lei 14.133, o sistema apresenta o item e pergunta:
      _"Alexandre, este item de Assistente da UFMG reflete a literalidade que você espera para a FUB ou ele é sofisticado demais?"._

    - Se você sinalizar como "Sofisticado", o sistema aplica um **Fator de Redução de Complexidade** a todas as futuras importações daquele tópico, refinando a semente com base na sua sensibilidade estratégica.

16. Desmame Cognitivo na Análise Textual (Anti-Muleta)
    Para garantir que o realce automático de parágrafos não atrofie sua capacidade de busca ativa e correlação global exigida pelo Cebraspe (questões de "depreende-se", "infere-se" ou "sentido global"), o sistema aplica o **Protocolo de Scaffolding Dinâmico**:

    14.1 Classificação de Demanda de Busca
    O Bússola classifica as questões em dois níveis de interação com o texto:
    - **Nível Analítico (Local):** Questões que explicitam o parágrafo ou linha (ex: "No primeiro parágrafo..."). Aqui, o realce é mantido para acelerar o volume de estudo.
    - **Nível Sintético (Global):** Questões de inferência global ou reescrita de fragmentos dispersos. **Nesta categoria, o realce automático é bloqueado pelo sistema.** O usuário recebe o texto "nu" para treinar a varredura (scanning) exigida na prova real.

      14.2 O "Realce por Mérito" (Fading Assistance)
      Nos itens analíticos, o sistema implementa o desmame temporal:

    - O destaque do parágrafo aparece com 100% de opacidade nos primeiros 2 ciclos de repetição.
    - A partir da 3ª repetição, o destaque se torna **"sob demanda"** (o usuário precisa clicar no ícone de lupa para ver o realce) ou o sistema destaca apenas a primeira e a última linha do parágrafo, exigindo que o usuário localize o núcleo da informação internamente.

      14.3 Validação por Triangulação de Evidências
      Para questões de inferência global (Nível Sintético), o Bússola introduz o **Check de Justificativa Espalhada**:

    - Após responder "Certo" ou "Errado", o sistema solicita: _"Selecione no texto os 2 ou 3 fragmentos que, combinados, sustentam esta conclusão"_.
    - Isso treina a **capacidade de correlação** (conectar parágrafo 1 com parágrafo 4), que é exatamente o que o Cebraspe cobra nas questões de maior dificuldade.

      14.4 Auditoria de Visão Periférica
      O sistema monitora o tempo de fixação ou rolagem do texto.

    - Se o usuário acerta questões globais sem rolar o texto (o que indicaria memorização do gabarito ou falta de análise real), o Bússola injeta uma **"Questão de Sabotagem"**: ele altera sutilmente uma frase no meio do texto e pergunta se a inferência global continua válida.
    - Isso força o usuário a nunca confiar na memória e sempre executar a busca ativa, mantendo a musculatura analítica pronta para o dia da prova.
