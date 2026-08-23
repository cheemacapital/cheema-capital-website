export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <span>© {year} Cheema Capital</span>
        <a href="mailto:hello@cheemacapital.ai">hello@cheemacapital.ai</a>
      </div>
    </footer>
  );
}
