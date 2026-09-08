document.addEventListener('DOMContentLoaded', () => {
    const placeholderLinks = {
        '[link zu kontakt]': '../../index.html#kontakt',
        '[Link zum Kontakt]': '../../index.html#kontakt',
        '[Link zur Datenschutzerklärung]': 'datenschutz.html',
        '[Link zur Datenschutzerklärung von Google]': 'https://policies.google.com/privacy?hl=de'
    };

    const appendLinkedText = (element, text) => {
        const placeholder = Object.keys(placeholderLinks).find((value) => text.includes(value));
        if (!placeholder) {
            element.textContent = text;
            return;
        }

        const [before, after] = text.split(placeholder);
        if (before) element.appendChild(document.createTextNode(before));

        const link = document.createElement('a');
        link.href = placeholderLinks[placeholder];
        link.textContent = placeholder;
        if (link.href.startsWith('https://')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        element.appendChild(link);
        if (after) element.appendChild(document.createTextNode(after));
    };

    document.querySelectorAll('[data-legal-document]').forEach((documentElement) => {
        const source = documentElement.querySelector('[data-legal-source]');
        if (!source) return;

        const lines = source.textContent.trim().split(/\r?\n/);
        const content = document.createDocumentFragment();
        let list;

        const closeList = () => {
            if (list) content.appendChild(list);
            list = null;
        };

        lines.forEach((line, index) => {
            const text = line.trim();
            if (!text) {
                closeList();
                return;
            }

            if (index === 0) {
                closeList();
                const heading = document.createElement('h2');
                appendLinkedText(heading, text);
                content.appendChild(heading);
            } else if (/^\d+\.\s/.test(text)) {
                closeList();
                const heading = document.createElement('h3');
                appendLinkedText(heading, text);
                content.appendChild(heading);
            } else if (text.startsWith('•')) {
                if (!list) list = document.createElement('ul');
                const item = document.createElement('li');
                appendLinkedText(item, text);
                list.appendChild(item);
            } else {
                closeList();
                const paragraph = document.createElement('p');
                appendLinkedText(paragraph, text);
                content.appendChild(paragraph);
            }
        });
        closeList();
        source.replaceWith(content);
    });
});
