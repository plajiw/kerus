# Modo Ajuda

O **Modo Ajuda** é um sistema de dicas contextuais embutido no Kerus. Quando ativado, ele exibe pequenos botões `?` ao lado de campos e seções — ao clicar, um popover flutuante aparece com uma explicação detalhada sobre aquele elemento.

## Como ativar

O Modo Ajuda é controlado nas **Configurações** (`/configuracoes`), na seção de preferências de interface. A escolha é salva automaticamente e persiste entre sessões.

- **Ativado** (padrão): os botões `?` ficam visíveis em toda a interface.
- **Desativado**: todos os botões `?` desaparecem completamente — ideal para usuários experientes que não precisam das dicas.

## Onde aparece

O botão `?` é renderizado pelo componente `HintButton`, presente em:

- Campos do editor de fichas técnicas (ingredientes, etapas, metadados)
- Seções do editor de orçamentos
- Configurações avançadas

## Anatomia do popover

Quando clicado, o botão abre um popover flutuante com:

```
[ TÍTULO DA SEÇÃO ]         ← em laranja, uppercase, 10px
Texto explicativo da dica.  ← corpo, 12px
─────────────────────────
📖 Ver na documentação      ← link opcional para esta docs
```

O popover se posiciona automaticamente — abre para baixo por padrão e inverte para cima quando não há espaço suficiente na viewport.

## Uso no código

```tsx
import { HintButton } from '../ui/HintButton';

// Básico
<HintButton
    title="Rendimento"
    hint="Quantidade total produzida pela fórmula. Usado para calcular o custo por unidade."
/>

// Com link para a documentação
<HintButton
    title="Rendimento"
    hint="Quantidade total produzida pela fórmula. Usado para calcular o custo por unidade."
    docsLink="/docs/guide/formulas"
/>
```

### Props do `HintButton`

| Prop       | Tipo     | Padrão | Descrição                                               |
| ---------- | -------- | ------ | ------------------------------------------------------- |
| `hint`     | `string` | —      | Texto da dica (obrigatório)                             |
| `title`    | `string` | —      | Título exibido no topo do popover em laranja            |
| `docsLink` | `string` | —      | URL para a documentação — exibe link no rodapé do popup |
| `className`| `string` | `''`   | Classes CSS adicionais para o wrapper                   |

## Arquitetura

O componente é dividido em dois arquivos para manter separação de responsabilidades:

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/ui/HintButton.tsx` | Botão `?`, lógica de posicionamento, abertura/fechamento |
| `src/components/ui/HintPopover.tsx` | Renderização do popover via React Portal |

O estado de ativação é gerenciado pelo hook `useHelpMode` (`src/hooks/useHelpMode.ts`), que lê e escreve em `kerus_prefs` via `localStorageService`. Um evento customizado `kerus_help_mode_changed` sincroniza todos os `HintButton` montados ao mesmo tempo quando a configuração muda.
