# Fichas Técnicas

A Ficha Técnica é o documento central do Kerus. Ela reúne todas as informações de uma fórmula — ingredientes, fases, proporções e método de preparo — em um formato padronizado e pronto para produção.

---

## Criar uma Nova Ficha

No menu lateral, acesse **Fichas Técnicas** e clique em **Nova Ficha**.

O editor abre com as seções principais já organizadas. Preencha as informações do topo:

- **Nome da fórmula** — identifique o produto de forma clara (ex: "Shampoo Neutro Base")
- **Tamanho do lote** — quantidade total a ser produzida, em gramas
- **Data** — preenchida automaticamente, mas pode ser ajustada
- **Observações** — campo livre para anotações internas

---

## Organizar por Fases {#fases}

A ordem de adição dos ingredientes é fundamental em formulação técnica. O Kerus permite dividir a fórmula em **fases** para refletir exatamente o processo do laboratório ou da linha de produção.

Exemplos de nomenclatura comum:

| Fase | Uso típico |
|------|-----------|
| Fase A | Ingredientes aquosos — adicionados primeiro |
| Fase B | Ingredientes oleosos e emulsificantes |
| Fase C | Ativos sensíveis ao calor (termolábeis) |
| Fase D | Conservantes, fragrâncias, corretores de pH |

Para adicionar uma nova fase, clique em **Adicionar Fase** dentro do editor. Você pode renomear cada fase conforme a nomenclatura do seu laboratório.

---

## Adicionar Ingredientes {#ingredientes}

Dentro de cada fase, clique em **Adicionar Ingrediente**. Para cada item, preencha:

- **Nome** — nome comercial ou técnico da matéria-prima
- **INCI** — nomenclatura internacional (opcional, mas recomendado para cosméticos)
- **Função** — papel do ingrediente na fórmula (ex: emoliente, conservante, ativo)
- **Percentual (%)** — proporção em relação ao lote total

::: tip Escalonamento automático
O peso em gramas é calculado automaticamente a partir do percentual e do tamanho do lote. Se você mudar o tamanho do lote, todos os pesos se atualizam instantaneamente.
:::

---

## Validação de Proporções {#validacao}

O Kerus verifica em tempo real se a soma de todos os percentuais da fórmula fecha em exatos **100%**.

- Se a soma estiver incorreta, um alerta aparece no editor.
- A ficha não pode ser marcada como **Final** enquanto a soma estiver fora de 100%.

Esse controle evita que fórmulas quebradas cheguem à linha de produção.

---

## Status da Ficha {#status}

Cada ficha tem um status de ciclo de vida que controla o que pode ser feito com ela:

**Rascunho**
: A fórmula está em desenvolvimento ou teste. Pode ser editada livremente. Não é possível exportar PDF nem gerar orçamento a partir de uma ficha em rascunho.

**Final**
: A fórmula foi validada em bancada e está aprovada para produção. A partir desse ponto, pode ser exportada como PDF e usada como base de orçamentos.

Para alterar o status, use o seletor de status no topo da ficha (na tela de visualização).

---

## Exportar a Ficha {#exportar}

Com a ficha no status **Final**, acesse a tela de visualização (clique em **Visualizar** no editor) e use os botões no topo:

- **PDF** — gera um documento formatado com os dados da empresa, ingredientes e método de preparo, pronto para impressão ou envio
- **XML** — exporta os dados estruturados da fórmula para integração com outros sistemas

::: warning O PDF só está disponível para fichas no status Final
Fichas em Rascunho não podem ser exportadas. Isso garante que apenas documentos validados sejam distribuídos.
:::

---

## Importar via IA {#importar}

O Kerus possui um assistente de inteligência artificial que acelera a criação de fichas a partir de dados externos.

Para usar, clique em **Importar** no editor e escolha o método:

- **Imagem** — foto de um rótulo, laudo técnico ou formulação impressa
- **Texto** — cole o conteúdo de um PDF, especificação técnica ou tabela

O sistema interpreta o conteúdo e preenche automaticamente as fases e ingredientes no editor. Revise os dados antes de salvar.

::: tip Ideal para digitalizar formulações existentes
Se você tem fichas em papel ou planilhas antigas, a importação via IA é a forma mais rápida de trazê-las para o sistema.
:::

---

## Modo Avançado

Quando o [Modo Avançado](./advanced-mode) está ativado, o editor de fichas exibe campos extras:

- Faixa de pH ideal (mínimo e máximo)
- Perfil de viscosidade esperado
- Controle de versões da fórmula

---

## Próximos Passos

- [Gerar um Orçamento a partir desta ficha](./quotations)
- [Ativar o Modo Avançado](./advanced-mode)
