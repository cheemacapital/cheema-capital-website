// Always visible, on every screen including the first gate question — see
// the "no more 'no branding until inside a track'" note in index.css. This
// is the direct answer to "add a cheema capital and what we do button at
// the top of first question."
export default function Header({ onLogoClick, onServicesClick }) {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <button type="button" className="wordmark" onClick={onLogoClick}>Cheema Capital</button>
        <button type="button" className="header-link" onClick={onServicesClick}>What we do</button>
      </div>
    </header>
  );
}
