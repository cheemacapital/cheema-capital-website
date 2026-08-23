// Narrative copy in data/content.js carries a single literal <strong>...</strong>
// span for emphasis (ported from the original site's HTML strings). Rather
// than reach for dangerouslySetInnerHTML, split on that one tag and render
// real JSX. Only supports exactly the pattern our content actually uses:
// plain text, one <strong>...</strong> span, plain text.
export function renderStrong(text) {
  const match = text.match(/^(.*)<strong>(.*)<\/strong>(.*)$/s);
  if (!match) return text;
  const [, before, bold, after] = match;
  return (
    <>
      {before}
      <strong>{bold}</strong>
      {after}
    </>
  );
}

// Same content, plain text for the emailed report (strips the tag out
// entirely rather than rendering it).
export function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}
