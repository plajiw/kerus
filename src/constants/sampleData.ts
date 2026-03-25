import { Recipe } from '../types/recipe';
import { Quotation } from '../types/quotation';

export const SAMPLE_RECIPES: Recipe[] = [
    {
        id: 'sample-formula-pimenta',
        nome_formula: 'Molho de Pimenta Habanero Defumado',
        data: new Date().toISOString(),
        status: 'FINAL',
        accentColor: '#FF4500',
        nome_empresa: 'Gourmet Heat Sauces',
        batch_size: 5000, // 5kg
        formula_version: '2.1.0',
        viscosity: 'Molho Encorpado',
        ingredientes: [
            // Base
            { id: 'p1', nome: 'Pimenta Habanero Fresca', quantidade: 25.0, unidade: '%', phase: 'A', function: 'Ingrediente Principal / Picância' },
            { id: 'p2', nome: 'Vinagre de Maçã Orgânico', quantidade: 35.0, unidade: '%', phase: 'A', function: 'Conservante / Acidez' },
            { id: 'p3', nome: 'Água Filtrada', quantidade: 20.0, unidade: '%', phase: 'A', function: 'Diluente' },
            // Temperos e Sabor
            { id: 'p4', nome: 'Alho Triturado', quantidade: 4.0, unidade: '%', phase: 'A', function: 'Aromatizante' },
            { id: 'p5', nome: 'Cebola Branca Picada', quantidade: 6.0, unidade: '%', phase: 'A', function: 'Base de Sabor' },
            { id: 'p6', nome: 'Sal Refinado', quantidade: 3.0, unidade: '%', phase: 'A', function: 'Realçador de Sabor' },
            { id: 'p7', nome: 'Açúcar Mascavo', quantidade: 2.5, unidade: '%', phase: 'B', function: 'Equilíbrio de Acidez' },
            { id: 'p8', nome: 'Aroma Natural de Fumaça', quantidade: 0.5, unidade: '%', phase: 'B', function: 'Sabor Defumado' },
            { id: 'p9', nome: 'Páprica Defumada', quantidade: 3.5, unidade: '%', phase: 'B', function: 'Cor e Sabor' },
            // Textura
            { id: 'p10', nome: 'Goma Xantana (Grau Alimentício)', quantidade: 0.5, unidade: '%', phase: 'C', function: 'Espessante / Estabilizante' },
        ],
        modo_preparo: [
            { id: 'ps1', text: 'Higienizar as pimentas e remover os talos. Bater no liquidificador industrial com o vinagre, água, alho e cebola até obter uma pasta homogênea.' },
            { id: 'ps2', text: 'Transferir a mistura para um tanque de cocção e adicionar o sal e o açúcar mascavo.' },
            { id: 'ps3', text: 'Aquecer a mistura até atingir 85°C (pasteurização) e manter por 15 minutos sob agitação constante.' },
            { id: 'ps4', text: 'Adicionar a páprica e o aroma de fumaça, misturando bem por mais 5 minutos.' },
            { id: 'ps5', text: 'Dispersar a goma xantana lentamente com o auxílio de um mixer de alta rotação para garantir a textura ideal sem grumos.' },
            { id: 'ps6', text: 'Envasar a quente em frascos esterilizados e realizar o resfriamento rápido.' }
        ],
        observacoes: 'Nível de picância: Alta (4/5). pH final esperado: 3.5 - 3.8. Validade: 12 meses após envase.',
        exibir_ilustracao: true,
        ilustracao_svg: 'flask'
    }
];

export const SAMPLE_QUOTATIONS: Quotation[] = [
    {
        id: 'sample-quote-pimenta-1',
        title: 'Lote Mensal - Restaurante Fogo & Brasa',
        clientName: 'Restaurante Fogo & Brasa (Unidade Centro)',
        date: new Date().toISOString(),
        status: 'ENVIADO',
        deliveryMethod: 'presencial',
        deliveryFormat: 'Caixas com 12 unidades de 150ml (Total 500 frascos)',
        accentColor: '#FF4500',
        items: [
            { id: 'pqi1', name: 'Molho de Pimenta Habanero Defumado (150ml)', type: 'formula', linkedFormulaId: 'sample-formula-pimenta' },
            { id: 'pqi2', name: 'Personalização de Rótulos (Private Label)', type: 'service' },
            { id: 'pqi3', name: 'Frete Logística Expressa', type: 'other' }
        ],
        payment: {
            total: 4800.00,
            entry: 1440.00,
            installments: 2,
            installmentValue: 1680.00,
            paymentTerms: '30% entrada + 2 parcelas (30/60 dias)',
            startDate: new Date().toISOString(),
            method: 'pix'
        },
        notes: 'Prazo de entrega de 7 dias úteis após confirmação do pagamento da entrada.',
        showProviderSignature: true,
        showClientSignature: true
    }
];
