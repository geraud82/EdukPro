import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  DollarSign, 
  MessageCircle, 
  BarChart3,
  Zap,
  Lock,
  Smartphone,
  Globe,
  Rocket,
  Gem,
  Building2,
  LogIn,
  Sparkles,
  ArrowRight,
  Shield,
  Check,
  Download
} from 'lucide-react';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.nav-container')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on navigation
  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleAnchorClick = () => {
    setMobileMenuOpen(false);
  };

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
      icon: <Users size={32} />,
      title: 'Parent Portal',
      description: 'Manage your children\'s education, track fees, and communicate with teachers all in one place.'
    },
    {
      icon: <BookOpen size={32} />,
      title: 'Teacher Dashboard',
      description: 'Organize classes, track student progress, and maintain seamless communication with parents.'
    },
    {
      icon: <GraduationCap size={32} />,
      title: 'School Management',
      description: 'Complete administration tools for managing fees, enrollments, classes, and staff efficiently.'
    },
    {
      icon: <DollarSign size={32} />,
      title: 'Fee Management',
      description: 'Automated invoice generation, payment tracking, and financial reporting made simple.'
    },
    {
      icon: <MessageCircle size={32} />,
      title: 'Real-time Chat',
      description: 'Instant messaging between parents, teachers, and administrators for better collaboration.'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Analytics & Reports',
      description: 'Comprehensive insights and data visualization for informed decision-making.'
    }
  ];

  const benefits = [
    {
      icon: <Zap size={24} />,
      title: 'Lightning Fast',
      description: 'Built with modern technology for instant response times'
    },
    {
      icon: <Lock size={24} />,
      title: 'Secure & Safe',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Mobile Ready',
      description: 'Access from any device, anywhere, anytime'
    },
    {
      icon: <Globe size={24} />,
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
      <nav className={`homepage-nav ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon"><GraduationCap size={28} /></span>
            <span className="logo-text">EduckPro</span>
          </div>
          
          {/* Mobile: Get Started button and Hamburger menu */}
          <div className="nav-mobile-actions">
            <button onClick={() => handleNavClick('/signup')} className="nav-btn nav-btn-signup nav-btn-mobile">
              Get Started
            </button>
            <button 
              className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benefits" className="nav-link">Benefits</a>
            <button onClick={() => navigate('/pricing')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Pricing</button>
            <a href="#about" className="nav-link">About</a>
            <button onClick={() => navigate('/login')} className="nav-btn nav-btn-login">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="nav-btn nav-btn-signup">
              Get Started
            </button>
          </div>

          {/* Mobile menu dropdown */}
          <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#features" className="mobile-menu-link" onClick={handleAnchorClick}>
              <span className="mobile-menu-icon"><Rocket size={20} /></span>
              Features
            </a>
            <a href="#benefits" className="mobile-menu-link" onClick={handleAnchorClick}>
              <span className="mobile-menu-icon"><Gem size={20} /></span>
              Benefits
            </a>
            <a href="#about" className="mobile-menu-link" onClick={handleAnchorClick}>
              <span className="mobile-menu-icon"><Building2 size={20} /></span>
              About
            </a>
            <div className="mobile-menu-divider"></div>
            <button onClick={() => handleNavClick('/login')} className="mobile-menu-btn mobile-menu-btn-login">
              <span className="mobile-menu-icon"><LogIn size={20} /></span>
              Login
            </button>
            <button onClick={() => handleNavClick('/signup')} className="mobile-menu-btn mobile-menu-btn-signup">
              <span className="mobile-menu-icon"><Sparkles size={20} /></span>
              Create Account
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      {/* Hero Section */}
      <div className="hero-section-wrapper">
        <section className="hero-section">
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
            
            {/* Mobile Hero Image */}
            <div className="hero-image-mobile">
              <img 
                src="/images/hero-background.png" 
                alt="School Management Illustration" 
                className="hero-img-mobile"
              />
            </div>

            <div className="hero-buttons">
              <button onClick={() => navigate('/signup')} className="hero-btn hero-btn-primary">
                <span>Get Started Free</span>
                <span className="btn-arrow"><ArrowRight size={20} /></span>
              </button>
              <button onClick={() => navigate('/login')} className="hero-btn hero-btn-secondary">
                <span className="btn-icon"><Shield size={20} /></span>
                <span>Sign In</span>
              </button>
              {showInstallButton && (
                <button onClick={handleInstallClick} className="hero-btn hero-btn-install">
                  <span className="btn-icon"><Download size={20} /></span>
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
        </section>
      </div>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <span><Rocket size={20} /></span>
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
                <span><Gem size={20} /></span>
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
                <div className="small-icon"><Check size={20} /></div>
                <div className="small-text">All fees paid</div>
              </div>
              <div className="visual-card visual-card-small visual-card-bottom">
                <div className="small-icon"><MessageCircle size={20} /></div>
                <div className="small-text">3 new messages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-image">
              <div className="about-image-container">
                <div className="about-card about-card-main">
                  <div className="about-icon"><GraduationCap size={32} /></div>
                  <div className="about-card-content">
                    <h4>Our Mission</h4>
                    <p>Empowering educational institutions with modern tools</p>
                  </div>
                </div>
                <div className="about-card about-card-float about-card-1">
                  <span className="about-stat">10+</span>
                  <span className="about-stat-label">Years Experience</span>
                </div>
                <div className="about-card about-card-float about-card-2">
                  <span className="about-stat">24/7</span>
                  <span className="about-stat-label">Support</span>
                </div>
              </div>
            </div>
            <div className="about-text">
              <div className="section-badge">
                <span><Building2 size={20} /></span>
                <span>About Us</span>
              </div>
              <h2 className="section-title">Transforming Education Management</h2>
              <p className="about-description">
                EduckPro was founded with a simple mission: to make school management 
                effortless for administrators, engaging for teachers, and transparent for parents.
              </p>
              <p className="about-description">
                Our platform is built by educators, for educators. We understand the unique 
                challenges faced by schools and have developed solutions that address real-world 
                needs while being intuitive and easy to use.
              </p>
              <div className="about-highlights">
                <div className="about-highlight">
                  <span className="highlight-icon"><Check size={20} /></span>
                  <span>Trusted by 50+ schools worldwide</span>
                </div>
                <div className="about-highlight">
                  <span className="highlight-icon"><Check size={20} /></span>
                  <span>Dedicated customer success team</span>
                </div>
                <div className="about-highlight">
                  <span className="highlight-icon"><Check size={20} /></span>
                  <span>Regular updates and new features</span>
                </div>
                <div className="about-highlight">
                  <span className="highlight-icon"><Check size={20} /></span>
                  <span>99.9% uptime guarantee</span>
                </div>
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
                <span className="btn-arrow"><ArrowRight size={20} /></span>
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
                <span className="logo-icon"><GraduationCap size={28} /></span>
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
