// Always visible, on every screen including the first gate question — see
// the "no more 'no branding until inside a track'" note in index.css. This
// is the direct answer to "add a cheema capital and what we do button at
// the top of first question."
export default function Header({ onLogoClick, onServicesClick, onBookClick }) {
  // /book is a real page outside the SPA (like /champaign-urbana), so this
  // is a plain <a>, not a button — but intercept ordinary clicks to run the
  // same fade-out the rest of the app uses (onBookClick -> navigateExternal
  // in FunnelApp.jsx) instead of cutting away instantly. Modified clicks
  // (new tab, new window) pass through untouched.
  //
  // "Who we are" deliberately does NOT live here — it's reached by first
  // clicking "What we do" (see ServicesScreen.jsx), not from the global
  // header. That's a specific, explicit choice, not an oversight.
  function handleBookClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onBookClick();
  }

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <button type="button" className="wordmark" onClick={onLogoClick}>Cheema Capital</button>
        <div className="site-header__nav">
          <button type="button" className="header-link" onClick={onServicesClick}>What we do</button>
          <a href="/book/" className="header-book-btn" onClick={handleBookClick}>Book a call</a>
        </div>
      </div>
    </header>
  );
}
