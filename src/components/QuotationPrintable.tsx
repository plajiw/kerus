import React from 'react';
import { Quotation } from '../types';
import { useCompanySettings } from '../hooks/useCompanySettings';

interface Props {
    quotation: Quotation;
    mode?: 'preview' | 'print';
}

const fmt = (v: number, locale = 'pt-BR') =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(v);

const fmtDate = (iso: string, locale = 'pt-BR') => {
    if (!iso) return '';
    try {
        return new Date(iso + 'T00:00:00').toLocaleDateString(locale, {
            day: '2-digit', month: 'long', year: 'numeric',
        });
    } catch {
        return iso;
    }
};

const DELIVERY_LABELS: Record<string, string> = {
    online: 'Online',
    presencial: 'Presencial',
    outro: 'Outro',
};

export const QuotationPrintable: React.FC<Props> = ({ quotation: q, mode = 'print' }) => {
    const { settings } = useCompanySettings();
    const isDraft = q.status === 'RASCUNHO';

    const companyName = settings.nomeEmpresa || '';
    const responsible = settings.nomeResponsavel || '';
    const phone = settings.telefone || '';

    const accent = q.accentColor || '#1a1a1a';
    const fontFam = q.fontFamily ? `${q.fontFamily}, sans-serif` : "'Manrope', sans-serif";

    return (
        <div
            className="print-page bg-white relative"
            style={{
                width: '210mm',
                minHeight: '297mm',
                fontFamily: fontFam,
                color: '#1a1a1a',
                fontSize: 11,
            }}
        >
            {/* Draft watermark */}
            {isDraft && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ zIndex: 0 }}
                >
                    <span
                        style={{
                            fontSize: 72,
                            fontWeight: 900,
                            color: 'rgba(0,0,0,0.04)',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            userSelect: 'none',
                            transform: 'rotate(-30deg)',
                        }}
                    >
                        RASCUNHO
                    </span>
                </div>
            )}

            <div className="relative" style={{ zIndex: 1, padding: '14mm 16mm' }}>

                {/* ── Header ────────────────────────────────── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${accent}` }}>
                    <div>
                        {companyName && (
                            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                                {companyName}
                            </div>
                        )}
                        {responsible && (
                            <div style={{ fontSize: 10, color: '#555', marginBottom: 2 }}>Responsável: {responsible}</div>
                        )}
                        {phone && (
                            <div style={{ fontSize: 10, color: '#555' }}>Tel: {phone}</div>
                        )}
                        {!companyName && !responsible && (
                            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Kerus
                            </div>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 4 }}>
                            Proposta Comercial
                        </div>
                        <div style={{ fontSize: 10, color: '#555' }}>
                            Data: {fmtDate(q.date)}
                        </div>
                        {q.status !== 'RASCUNHO' && (
                            <div style={{
                                marginTop: 6,
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 9,
                                fontWeight: 800,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                background: q.status === 'APROVADO' ? '#dcfce7' : q.status === 'ENVIADO' ? '#e0e7ff' : '#fef9c3',
                                color: q.status === 'APROVADO' ? '#166534' : q.status === 'ENVIADO' ? '#3730a3' : '#713f12',
                            }}>
                                {q.status === 'APROVADO' ? 'Aprovado' : q.status === 'ENVIADO' ? 'Enviado' : q.status}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Service title ─────────────────────────── */}
                <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 6 }}>
                        Serviço Prestado
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        {q.title || '—'}
                    </div>
                    {q.clientName && (
                        <div style={{ marginTop: 6, fontSize: 11, color: '#444' }}>
                            Cliente: <strong>{q.clientName}</strong>
                        </div>
                    )}
                </div>

                {/* ── Items ─────────────────────────────────── */}
                {q.items.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 8 }}>
                            Fórmulas / Itens Incluídos
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5' }}>
                                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', borderBottom: '1px solid #e8e8e8' }}>#</th>
                                    <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', borderBottom: '1px solid #e8e8e8' }}>Descrição</th>
                                    <th style={{ padding: '6px 10px', textAlign: 'center', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', borderBottom: '1px solid #e8e8e8' }}>Tipo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {q.items.map((item, idx) => (
                                    <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                                        <td style={{ padding: '7px 10px', fontSize: 10, color: '#888', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle', width: 28 }}>{idx + 1}</td>
                                        <td style={{ padding: '7px 10px', fontSize: 11, fontWeight: 600, borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' }}>{item.name || '—'}</td>
                                        <td style={{ padding: '7px 10px', fontSize: 9, textAlign: 'center', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                borderRadius: 100,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.06em',
                                                background: item.type === 'formula' ? '#fef3c7' : '#f3f4f6',
                                                color: item.type === 'formula' ? '#92400e' : '#6b7280',
                                            }}>
                                                {item.type === 'formula' ? 'Fórmula' : 'Serviço'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Payment ───────────────────────────────── */}
                {q.payment.total > 0 && (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 10 }}>
                            Valor e Condições de Pagamento
                        </div>
                        <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{ padding: '12px 16px', background: '#f9fafb', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888' }}>Valor Total do Serviço</span>
                                <span style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a' }}>{fmt(q.payment.total)}</span>
                            </div>
                            <div style={{ padding: '12px 16px' }}>
                                {q.payment.entry > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                                        <span style={{ color: '#555' }}>Entrada</span>
                                        <span style={{ fontWeight: 700 }}>{fmt(q.payment.entry)}</span>
                                    </div>
                                )}
                                {q.payment.installments > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                                        <span style={{ color: '#555' }}>
                                            {q.payment.installments}x de {fmt(q.payment.installmentValue)}
                                            {q.payment.paymentTerms ? ` — ${q.payment.paymentTerms}` : ''}
                                        </span>
                                        <span style={{ fontWeight: 700 }}>{fmt(q.payment.total - q.payment.entry)}</span>
                                    </div>
                                )}
                                {q.payment.startDate && (
                                    <div style={{ marginTop: 8, fontSize: 10, color: '#777' }}>
                                        A partir de: {fmtDate(q.payment.startDate)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Delivery ──────────────────────────────── */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 8 }}>
                        Entrega do Serviço
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #eee' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 4 }}>Modo</div>
                            <div style={{ fontSize: 12, fontWeight: 700 }}>{DELIVERY_LABELS[q.deliveryMethod] || q.deliveryMethod}</div>
                        </div>
                        {q.deliveryFormat && (
                            <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #eee' }}>
                                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: 4 }}>Formato</div>
                                <div style={{ fontSize: 12, fontWeight: 700 }}>{q.deliveryFormat}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Notes ─────────────────────────────────── */}
                {q.notes && (
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#888', marginBottom: 8 }}>
                            Observações
                        </div>
                        <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: 8, border: '1px solid #eee', fontSize: 11, color: '#444', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {q.notes}
                        </div>
                    </div>
                )}

                {/* ── Signature area ────────────────────────── */}
                <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e8e8e8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                    {[companyName || 'Prestador de Serviço', q.clientName || 'Cliente'].map((name, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #ccc', marginBottom: 8, height: 40 }} />
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#444' }}>{name}</div>
                            <div style={{ fontSize: 9, color: '#aaa' }}>{i === 0 ? 'Prestador' : 'Contratante'}</div>
                        </div>
                    ))}
                </div>

                {/* ── Footer ────────────────────────────────── */}
                <div style={{ marginTop: 24, paddingTop: 12, borderTop: '1px dashed #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: '#bbb' }}>Documento gerado pelo sistema Kerus</span>
                    <span style={{ fontSize: 9, color: '#bbb' }}>{fmtDate(q.date)}</span>
                </div>
            </div>
        </div>
    );
};
