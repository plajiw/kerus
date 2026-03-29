# Template Padrão — Páginas de Guia

Este documento define a estrutura e convenções que todas as páginas de guia de usuário (`docs/guide/*.md`) devem seguir.

---

## Princípios

- **Audiência**: usuário final, não desenvolvedor. Zero referências a componentes, hooks, props ou arquivos TypeScript.
- **Sem emojis**: use SVG inline nas callout blocks. Não use emojis em títulos ou texto corrido.
- **Lingua**: português brasileiro (pt-BR). Links internos sem extensão `.md`.
- **Tom**: direto, imperativo nos passos ("acesse", "clique", "preencha"), explicativo nas descrições.

---

## Estrutura da Página

```markdown
# Título da Página

Parágrafo de introdução de 1-3 linhas explicando o que esta seção cobre
e por que é relevante para o usuário.

---

## Seção Principal {#ancora-para-docsLink}

Texto explicativo.

### Subseção (se necessário)

Passos numerados para tarefas procedurais.

::: tip | ::: warning | ::: info
Callout para informações de destaque.
:::

---

## Próximos Passos

- [Link para página relacionada](./outra-pagina)
- [Link para seção específica](./outra-pagina#ancora)
```

---

## Regras de Conteúdo

### Títulos com âncoras

Use `{#ancora}` em títulos para permitir links diretos via `docsLink` no HintButton.
O slug deve ser em português, sem acentos, com hífens.

```markdown
## Exportar a Ficha {#exportar}
## Status da Ficha {#status}
## Perfil da Empresa {#perfil-da-empresa}
```

### Callout blocks

VitePress suporta três tipos. Use SVG inline no título quando o bloco precisa de ícone visual:

```markdown
::: tip Título opcional
Informação positiva, dica de produtividade ou atalho.
:::

::: warning Título opcional
Restrição importante, comportamento que pode surpreender.
:::

::: info Título opcional
Contexto adicional, explicação de comportamento padrão.
:::
```

### Listas vs. passos numerados

- Use **lista com marcadores** para conjuntos não ordenados (campos disponíveis, opções de configuração).
- Use **lista numerada** somente para passos que devem ser seguidos em ordem.

### Definition lists (dl/dt/dd)

Use para documentar status, estados ou opções mutuamente exclusivas:

```markdown
**Rascunho**
: A fórmula está em desenvolvimento. Pode ser editada livremente.

**Final**
: A fórmula foi validada. Pode ser exportada e usada em orçamentos.
```

### Tabelas

Use somente quando há relação estruturada entre dois ou mais atributos.
Sempre inclua cabeçalho. Mantenha células concisas (máximo ~60 caracteres).

---

## Regras de Navegação

### Links internos

Sempre sem extensão `.md`. Prefira links relativos:

```markdown
[Fichas Técnicas](./sheet)              ✓
[Status da Ficha](./sheet#status)       ✓
[Fichas Técnicas](./sheet.md)           ✗
[/guide/sheet](/guide/sheet)            ✗ (use relativo)
```

### Seção "Próximos Passos"

Toda página de guia deve terminar com links para as páginas mais prováveis de continuação do fluxo do usuário.

---

## Vinculação com HintButton

Quando uma seção da aplicação tem um HintButton, o `docsLink` deve apontar para a âncora correspondente nesta documentação.

| Contexto no app | docsLink |
|---|---|
| Status da ficha (preview) | `/docs/guide/sheet#status` |
| Exportar PDF/XML (preview) | `/docs/guide/sheet#exportar` |
| Importar via IA (modal) | `/docs/guide/sheet#importar` |
| Status do orçamento (preview) | `/docs/guide/quotations#status` |
| Perfil da empresa (settings) | `/docs/guide/settings#perfil-da-empresa` |
| Modo Ajuda (settings) | `/docs/guide/help-mode` |
| Modo Avançado (settings) | `/docs/guide/advanced-mode` |

Ao adicionar uma nova seção com HintButton, sempre:
1. Crie a âncora correspondente na página de guia (`## Título {#ancora}`)
2. Adicione o `docsLink` no componente HintButton
3. Registre o mapeamento na tabela acima

---

## Exemplo Completo

Ver [sheet.md](../guide/sheet.md) como referência canônica de implementação completa.
