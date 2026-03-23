export interface QuotationItem {
  id: string;
  name: string;
  type: 'formula' | 'service' | 'other';
  linkedFormulaId?: string;
}

export interface QuotationPayment {
  total: number;
  entry: number;
  installments: number;
  installmentValue: number;
  paymentTerms: string;
  startDate: string;
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
}
