# Orçamentos

O módulo de Orçamentos transforma o trabalho técnico das suas fichas em propostas comerciais completas e profissionais. Os custos são calculados automaticamente a partir dos dados da fórmula vinculada.

---

## Criar um Novo Orçamento

No menu lateral, acesse **Orçamentos** e clique em **Novo Orçamento**.

---

## Vincular uma Ficha Técnica

O primeiro passo é selecionar a ficha técnica que será a base do orçamento. O sistema importa automaticamente:

- Lista de ingredientes e suas proporções
- Custo de matéria-prima por grama (se cadastrado na ficha)
- Nome do produto

::: warning Somente fichas no status Final aparecem nessa lista
Orçamentos são documentos comerciais — apenas fórmulas validadas podem ser cotadas.
:::

---

## Ajustar o Lote e os Custos {#custos}

Após vincular a ficha, defina:

- **Tamanho do lote cotado** — pode ser diferente do lote-padrão da ficha. Os custos são recalculados proporcionalmente.
- **Custo de embalagem** — valor unitário da embalagem do produto final
- **Mão de obra** — custo de produção por lote
- **Margem de lucro (%)** — percentual aplicado sobre o custo total

O sistema exibe em tempo real o **custo total** e o **preço de venda sugerido** com base nesses parâmetros.

---

## Preencher os Dados do Cliente

Registre as informações do destinatário da proposta:

- Nome do cliente ou empresa
- Contato (e-mail ou telefone)
- Condições de pagamento (à vista, parcelado, etc.)
- Prazo de entrega estimado
- Data de validade da proposta

---

## Status do Orçamento {#status}

Acompanhe o andamento de cada proposta pelo status:

**Pendente**
: Proposta enviada ao cliente, aguardando resposta. Status inicial de todo orçamento criado.

**Aprovado**
: Cliente aceitou a proposta. A produção pode ser liberada.

**Arquivado**
: Negociação encerrada sem aprovação. O orçamento é mantido no histórico para referência futura.

Para alterar o status, use o seletor na tela de visualização do orçamento.

---

## Exportar e Enviar

Na tela de visualização, use os botões no topo:

- **PDF** — gera uma proposta formatada com os dados da empresa, produto, quantidades e valores, pronta para envio
- **Imprimir** — abre a janela de impressão do navegador

::: tip A proposta já inclui os dados da sua empresa
Nome, contato e identificação profissional configurados em Configurações aparecem automaticamente no cabeçalho do documento.
:::

---

## Acompanhamento no Dashboard

O Dashboard exibe um resumo dos orçamentos mais recentes com seus status. Use-o para identificar rapidamente quais propostas precisam de acompanhamento.

---

## Próximos Passos

- [Ajustar os dados da empresa nas Configurações](./settings)
- [Entender o status das Fichas Técnicas](./sheet#status)
