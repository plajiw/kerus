import React from 'react';

type Lang = 'json' | 'xml';

// Escape HTML special chars
const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const highlightJson = (code: string): string => {
    const escaped = esc(code);
    return escaped.replace(
        /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        (match) => {
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    // key
                    const key = match.slice(0, -1); // remove trailing ":"
                    return `<span style="color:#7dd3fc">${key}</span>:`;
                }
                return `<span style="color:#86efac">${match}</span>`;
            }
            if (/true|false/.test(match)) return `<span style="color:#c084fc">${match}</span>`;
            if (/null/.test(match)) return `<span style="color:#94a3b8">${match}</span>`;
            return `<span style="color:#fb923c">${match}</span>`; // number
        }
    );
};

const highlightXml = (code: string): string => {
    const escaped = esc(code);
    return escaped
        // Processing instruction
        .replace(/(&lt;\?[^?]*\?&gt;)/g, '<span style="color:#94a3b8">$1</span>')
        // Closing tags
        .replace(/(&lt;\/[\w:.-]+&gt;)/g, '<span style="color:#7dd3fc">$1</span>')
        // Opening tags with possible attributes: capture tag name + rest
        .replace(/(&lt;)([\w:.-]+)((?:\s[^&]*)?)(&gt;)/g, (_, open, name, attrs, close) => {
            const coloredAttrs = attrs.replace(
                /([\w:.-]+)(=)("(?:[^"]*)")/g,
                '<span style="color:#fb923c">$1</span>$2<span style="color:#86efac">$3</span>'
            );
            return `${open}<span style="color:#7dd3fc">${name}</span>${coloredAttrs}${close}`;
        })
        // Text content between tags — leave as-is but color light
        .replace(/(&gt;)([^<&]+)(&lt;)/g, `$1<span style="color:#e2e8f0">$2</span>$3`);
};

interface CodeBlockProps {
    code: string;
    lang: Lang;
    className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, lang, className = '' }) => {
    const html = lang === 'json' ? highlightJson(code) : highlightXml(code);

    return (
        <pre
            className={`text-xs leading-relaxed overflow-auto rounded-xl p-4 font-mono select-text ${className}`}
            style={{ background: '#0f172a', color: '#e2e8f0', minHeight: 0 }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
