const TAG_RE = /<[^>]*>/g;

export const isRichTextEmpty = (html: string | undefined | null) =>
    !html || html.replace(TAG_RE, '').replace(/&nbsp;/g, '').trim() === '';

export const toRenderableRichTextHtml = (value: string | undefined | null) => {
    const content = value || '';
    if (!content) return '';
    if (/<[a-z][^>]*>/i.test(content)) return content;
    return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
};
