export interface QuotationItem {
  id: string;
  name: string;
  type: 'formula' | 'service' | 'other';
  linkedFormulaId?: string;
}

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'boleto' | 'transfer' | 'cash' | 'other';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  credit: 'Cartão de Crédito',
  debit: 'Cartão de Débito',
  boleto: 'Boleto Bancário',
  transfer: 'Transferência / TED',
  cash: 'Dinheiro',
  other: 'Outro'
};

export interface PaymentModel {
  id: string;
  name: string;
  entryPercentage: number;
  installments: number;
  paymentTerms: string;
  method?: PaymentMethod;
  interestRate?: number;
  penaltyFee?: number;
}

export interface QuotationPayment {
  total: number;
  entry: number;
  installments: number;
  installmentValue: number;
  paymentTerms: string;
  startDate: string;
  method?: PaymentMethod;
  interestRate?: number;
  penaltyFee?: number;
}

export type QuotationStatus = 'RASCUNHO' | 'ENVIADO' | 'APROVADO' | 'RECUSADO';
export type DeliveryMethod = 'online' | 'presencial' | 'outro';

export interface Quotation {
  id: string;
  title: string;
  clientName: string;
  date: string;
  status: QuotationStatus;
  items: QuotationItem[];
  payment: QuotationPayment;
  deliveryMethod: DeliveryMethod;
  deliveryFormat: string;
  notes: string;
  accentColor?: string;
  fontFamily?: string;
  showProviderSignature?: boolean;
  showClientSignature?: boolean;
}
