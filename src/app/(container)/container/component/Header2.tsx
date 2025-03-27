"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Header2() {
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light shadow-lg">
      <ul className="navbar-nav">
        <li className="nav-item d-block d-md-none">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>

        <li className="nav-item d-none d-sm-inline-block">
          <a href="/" className="nav-link">
            ホーム
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i className="fas fa-expand-arrows-alt" />
          </a>
        </li>
      </ul>
    </nav>
  );
}
