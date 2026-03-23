/** Formulation phase — cosmetics industry standard order-of-addition */
export type IngredientPhase = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Ingredient {
    id: string;
    nome: string;
    quantidade: number;
    unidade: string;
    porcentagem?: number;
    custo_unitario?: number;
    custo_total?: number;
    /** Formulation phase (advanced mode) */
    phase?: IngredientPhase;
    /** INCI name — International Nomenclature of Cosmetic Ingredients (advanced mode) */
    inci?: string;
    /** Functional role (advanced mode): emollient, humectant, preservative, etc. */
    function?: string;
}

export interface Step {
    id: string;
    text: string;
}

export interface Recipe {
    id: string;
    nome_formula: string;
    data: string;
    status?: 'RASCUNHO' | 'FINAL';
    accentColor?: string;
    fontFamily?: string;
    fontSize?: 'small' | 'medium' | 'large';
    stripedRows?: boolean;
    exibir_modo_preparo?: boolean;
    exibir_observacoes?: boolean;
    ingredientes: Ingredient[];
    modo_preparo: Step[];
    observacoes?: string;
    rendimento_kg?: number;
    rendimento_unidades?: number;
    custo_total_formula?: number;
    nome_empresa?: string;
    exibir_ilustracao?: boolean;
    ilustracao_svg?: string;
    ilustracao_alt?: string;
    /** Target batch size in grams (advanced mode — drives scaling preview) */
    batch_size?: number;
    /** Target pH lower bound (advanced mode) */
    ph_min?: number;
    /** Target pH upper bound (advanced mode) */
    ph_max?: number;
    /** Formulation version string (advanced mode) */
    formula_version?: string;
    /** Viscosity profile (advanced mode): fluido, loção, creme, gel */
    viscosity?: string;
}
