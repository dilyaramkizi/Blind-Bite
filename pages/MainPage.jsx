import { useNavigate } from 'react-router-dom';
import '../style.css';
import heroImage from '../back/static/images/hero_image.jpg';

function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="/">
            <i className="bi bi-rosette"></i> Blind Bite
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="mainNav">
            <ul className="navbar-nav">
              <li className="nav-item me-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/register')}
                >
                  Register
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section text-white text-center text-lg-start">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold">Welcome to Blind Bite 🍽️</h1>
              <p className="lead">Your journey to discover delicious cuisines starts here.</p>
              <button
                className="btn btn-light btn-lg mt-3"
                onClick={() => navigate('/register')}
              >
                Get Started
              </button>
            </div>
            <div className="col-lg-6">
              <img
                src={heroImage}
                alt="Delicious Cuisine"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-5 flex-grow-1">
        <div className="container">
          <div className="row g-4">
            {[
              {
                img: 'https://via.placeholder.com/400x250',
                title: 'Project Overview',
                text: 'Learn about our mission to bring the best culinary experiences to your table.',
                action: () => navigate('/overview'),
              },
              {
                img: 'https://via.placeholder.com/400x250',
                title: 'Our Services',
                text: 'We offer personalized food recommendations based on your preferences.',
                action: () => navigate('/services'),
              },
              {
                img: 'https://via.placeholder.com/400x250',
                title: 'Contact Us',
                text: 'Get in touch with us to know more about our services or ask any questions.',
                action: () => navigate('/contact'),
              },
            ].map((card, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 shadow-sm">
                  <img src={card.img} className="card-img-top" alt={card.title} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text flex-grow-1">{card.text}</p>
                    <button
                      className="btn btn-outline-primary mt-3"
                      onClick={card.action}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-light py-4">
        <div className="container text-center">
          <h5 className="mb-3">Contact Us</h5>
          <p className="mb-0 text-muted">© 2025 Blind Bite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
