import "./footer.css";

function Footer() {
  return (
    <footer>
      <p> &copy; Ali Muhsin, 2022 </p>
      <div className="footer-icons">
        <a href="https://www.linkedin.com/in/aliarnoos/" target="_blank">
          <img src="/imgs/linkedin-icon.svg" alt="soical media" />
        </a>
        <a href="https://github.com/aliarnoos" target="_blank">
          <img src="/imgs/github-icon.svg" alt="soical media" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
