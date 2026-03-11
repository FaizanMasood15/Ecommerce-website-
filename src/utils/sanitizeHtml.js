export const sanitizeRichHtml = (input = '') => {
    const raw = String(input || '');

    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
        return raw.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'text/html');

    doc.querySelectorAll('script,style,iframe,object,embed,link,meta,base').forEach((el) => el.remove());

    doc.querySelectorAll('*').forEach((el) => {
        for (const attr of [...el.attributes]) {
            const name = attr.name.toLowerCase();
            const value = attr.value || '';
            if (name.startsWith('on') || (name === 'href' && /^\s*javascript:/i.test(value))) {
                el.removeAttribute(attr.name);
            }
        }
    });

    return doc.body.innerHTML;
};
