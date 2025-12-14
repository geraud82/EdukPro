import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // PWA Install Handler
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

  const features = [
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Parent Portal',
      description: 'Manage your children\'s education, track fees, and communicate with teachers all in one place.'
    },
    {
      icon: '👨‍🏫',
      title: 'Teacher Dashboard',
      description: 'Organize classes, track student progress, and maintain seamless communication with parents.'
    },
    {
      icon: '🎓',
      title: 'School Management',
      description: 'Complete administration tools for managing fees, enrollments, classes, and staff efficiently.'
    },
    {
      icon: '💰',
      title: 'Fee Management',
      description: 'Automated invoice generation, payment tracking, and financial reporting made simple.'
    },
    {
      icon: '💬',
      title: 'Real-time Chat',
      description: 'Instant messaging between parents, teachers, and administrators for better collaboration.'
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'Comprehensive insights and data visualization for informed decision-making.'
    }
  ];

  const benefits = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built with modern technology for instant response times'
    },
    {
      icon: '🔒',
      title: 'Secure & Safe',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access from any device, anywhere, anytime'
    },
    {
      icon: '🌍',
      title: 'Multi-School',
      description: 'Support for multiple schools and institutions'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Students' },
    { number: '50+', label: 'Schools' },
    { number: '200+', label: 'Teachers' },
    { number: '99%', label: 'Satisfaction' }
  ];

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className={`homepage-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">EduckPro</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benefits" className="nav-link">Benefits</a>
            <a href="#about" className="nav-link">About</a>
            <button onClick={() => navigate('/login')} className="nav-btn nav-btn-login">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="nav-btn nav-btn-signup">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your School
            <br />
            <span className="hero-title-gradient">Management Experience</span>
          </h1>
          <p className="hero-description">
            EduckPro is the all-in-one solution for schools, teachers, and parents.
            Streamline operations, enhance communication, and focus on what matters most - education.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/signup')} className="hero-btn hero-btn-primary">
              <span>Get Started Free</span>
              <span className="btn-arrow">→</span>
            </button>
            <button onClick={() => navigate('/login')} className="hero-btn hero-btn-secondary">
              <span className="btn-icon">🔐</span>
              <span>Sign In</span>
            </button>
            {showInstallButton && (
              <button onClick={handleInstallClick} className="hero-btn hero-btn-install">
                <span className="btn-icon">📱</span>
                <span>Install App</span>
              </button>
            )}
          </div>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="hero-stat">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-container">
            <div className="hero-card hero-card-1">
              <div className="card-icon">👨‍👩‍👧</div>
              <div className="card-content">
                <div className="card-title">Parent Portal</div>
                <div className="card-subtitle">Track everything</div>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <div className="card-title">Analytics</div>
                <div className="card-subtitle">Real-time insights</div>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <div className="card-title">Payments</div>
                <div className="card-subtitle">Automated billing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <span>🚀</span>
              <span>Features</span>
            </div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-description">
              Powerful features designed to make school management effortless
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="section-container">
          <div className="benefits-content">
            <div className="benefits-text">
              <div className="section-badge">
                <span>💎</span>
                <span>Why Choose Us</span>
              </div>
              <h2 className="section-title">Built for Modern Schools</h2>
              <p className="section-description">
                EduckPro combines cutting-edge technology with intuitive design to deliver 
                an unmatched school management experience.
              </p>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-icon">{benefit.icon}</div>
                    <div className="benefit-content">
                      <h4 className="benefit-title">{benefit.title}</h4>
                      <p className="benefit-description">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="benefits-visual">
              <div className="visual-card visual-card-main">
                <div className="visual-header">
                  <div className="visual-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="visual-title">Dashboard</div>
                </div>
                <div className="visual-content">
                  <div className="visual-metric">
                    <div className="metric-label">Students Enrolled</div>
                    <div className="metric-value">1,247</div>
                    <div className="metric-change">+12% this month</div>
                  </div>
                  <div className="visual-chart">
                    <div className="chart-bar" style={{ height: '40%' }}></div>
                    <div className="chart-bar" style={{ height: '65%' }}></div>
                    <div className="chart-bar" style={{ height: '50%' }}></div>
                    <div className="chart-bar" style={{ height: '80%' }}></div>
                    <div className="chart-bar" style={{ height: '70%' }}></div>
                    <div className="chart-bar" style={{ height: '90%' }}></div>
                  </div>
                </div>
              </div>
              <div className="visual-card visual-card-small visual-card-top">
                <div className="small-icon">✅</div>
                <div className="small-text">All fees paid</div>
              </div>
              <div className="visual-card visual-card-small visual-card-bottom">
                <div className="small-icon">💬</div>
                <div className="small-text">3 new messages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join hundreds of schools already using EduckPro to streamline their operations
            </p>
            <div className="cta-buttons">
              <button onClick={() => navigate('/signup')} className="cta-btn cta-btn-primary">
                <span>Create Free Account</span>
                <span className="btn-arrow">→</span>
              </button>
              <button onClick={() => navigate('/login')} className="cta-btn cta-btn-secondary">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-column">
              <div className="footer-logo">
                <span className="logo-icon">🎓</span>
                <span className="logo-text">EduckPro</span>
              </div>
              <p className="footer-description">
                Modern school management platform designed for the digital age.
              </p>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Product</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#benefits">Benefits</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#help">Help Center</a></li>
                <li><a href="#docs">Documentation</a></li>
                <li><a href="#api">API</a></li>
                <li><a href="#status">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2025 EduckPro. All rights reserved.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
