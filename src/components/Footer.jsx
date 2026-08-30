export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <span>© {year} Cheema Capital</span>
        <div className="site-footer__links">
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <a href="mailto:hello@cheemacapital.ai">hello@cheemacapital.ai</a>
        </div>
      </div>
    </footer>
  );
}
