import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  School,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Building2,
  DollarSign,
  Info,
  Award,
  Calendar,
  Clock,
  Star,
  Share2,
  Printer,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CheckCircle,
  Target,
  Heart,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import { API_URL } from '../config';
import './SchoolPublicPage.css';

function SchoolPublicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    fetchSchoolDetails();
    fetchSchoolPosts();
  }, [id]);

  async function fetchSchoolDetails() {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/api/schools/public/${id}`);
      
      if (!response.ok) {
        throw new Error('School not found');
      }

      const data = await response.json();
      setSchool(data);
    } catch (err) {
      console.error('Error fetching school:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSchoolPosts() {
    try {
      setLoadingPosts(true);
      const response = await fetch(`${API_URL}/api/schools/${id}/posts`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  }

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${school.name} on EduckPro!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: school.name,
          text: text,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="school-public-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading school information...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="school-public-page">
        <div className="error-container">
          <School size={64} color="#6b7280" />
          <h2>School Not Found</h2>
          <p>{error || 'The school you are looking for does not exist.'}</p>
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // School highlights and achievements
  const highlights = [
    { icon: <Award size={20} />, text: 'Accredited Institution' },
    { icon: <Star size={20} />, text: 'Experienced Faculty' },
    { icon: <TrendingUp size={20} />, text: 'Modern Facilities' },
    { icon: <Heart size={20} />, text: 'Caring Environment' },
  ];

  return (
    <div className="school-public-page">
      {/* Header */}
      <header className="school-header">
        <div className="header-container">
          <div className="header-top">
            <button className="btn-back" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              Back to Schools
            </button>
            
            <div className="header-actions">
              <button className="icon-btn" onClick={handleShare} title="Share">
                <Share2 size={20} />
              </button>
              <button className="icon-btn" onClick={handlePrint} title="Print">
                <Printer size={20} />
              </button>
            </div>
          </div>
          
          <div className="header-content">
            <div className="school-icon-large">
              <School size={48} />
            </div>
            <div className="school-header-info">
              <h1 className="school-name">{school.name}</h1>
              {(school.city || school.country) && (
                <div className="school-location">
                  <MapPin size={18} />
                  <span>
                    {[school.address, school.city, school.state, school.country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )}
              
              {/* Highlights */}
              <div className="school-highlights">
                {highlights.map((highlight, index) => (
                  <div key={index} className="highlight-badge">
                    {highlight.icon}
                    <span>{highlight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="school-content">
        <div className="content-container">
          {/* Tabs Navigation */}
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Info size={18} />
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              <BookOpen size={18} />
              Programs & Classes
            </button>
            <button 
              className={`tab-btn ${activeTab === 'admission' ? 'active' : ''}`}
              onClick={() => setActiveTab('admission')}
            >
              <FileText size={18} />
              Admission
            </button>
            <button 
              className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              <FileText size={18} />
              News & Events
            </button>
            <button 
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <MessageSquare size={18} />
              Contact
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-panel">
                {/* Statistics Cards */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Users size={32} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{school._count?.students || 0}</div>
                      <div className="stat-label">Students Enrolled</div>
                      <div className="stat-trend">
                        <TrendingUp size={14} />
                        <span>Active learners</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <BookOpen size={32} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">{school._count?.classes || 0}</div>
                      <div className="stat-label">Programs Offered</div>
                      <div className="stat-trend">
                        <Target size={14} />
                        <span>Diverse curriculum</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <GraduationCap size={32} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">
                        {school.classes?.filter(c => c.teacher).length || 0}
                      </div>
                      <div className="stat-label">Expert Teachers</div>
                      <div className="stat-trend">
                        <Award size={14} />
                        <span>Certified educators</span>
                      </div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <Star size={32} />
                    </div>
                    <div className="stat-info">
                      <div className="stat-value">5.0</div>
                      <div className="stat-label">Rating</div>
                      <div className="stat-trend">
                        <Heart size={14} />
                        <span>Parent reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                {school.description && (
                  <section className="info-section">
                    <div className="section-header">
                      <Info size={24} />
                      <h2>About {school.name}</h2>
                    </div>
                    <div className="section-content">
                      <p className="school-description">{school.description}</p>
                    </div>
                  </section>
                )}

                {/* Why Choose Us */}
                <section className="info-section">
                  <div className="section-header">
                    <Target size={24} />
                    <h2>Why Choose {school.name}?</h2>
                  </div>
                  <div className="section-content">
                    <div className="features-grid">
                      <div className="feature-item">
                        <CheckCircle size={20} color="#10b981" />
                        <div>
                          <h4>Quality Education</h4>
                          <p>Comprehensive curriculum designed for student success</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <CheckCircle size={20} color="#10b981" />
                        <div>
                          <h4>Qualified Teachers</h4>
                          <p>Experienced and certified educational professionals</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <CheckCircle size={20} color="#10b981" />
                        <div>
                          <h4>Modern Facilities</h4>
                          <p>State-of-the-art learning environment and resources</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <CheckCircle size={20} color="#10b981" />
                        <div>
                          <h4>Individual Attention</h4>
                          <p>Personalized learning approach for every student</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <CheckCircle size={20} color="#10b981" />
                        <div>
                          <h4>Extracurricular Activities</h4>
                          <p>Sports, arts, and clubs for holistic development</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <CheckCircle size={20} color="#10b981" />
                        <div>
                          <h4>Parent Engagement</h4>
                          <p>Regular communication and involvement opportunities</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Quick Facts */}
                <section className="info-section quick-facts">
                  <div className="section-header">
                    <Calendar size={24} />
                    <h2>Quick Facts</h2>
                  </div>
                  <div className="section-content">
                    <div className="facts-grid">
                      <div className="fact-item">
                        <Clock size={18} />
                        <div>
                          <strong>School Hours:</strong>
                          <span>8:00 AM - 3:00 PM</span>
                        </div>
                      </div>
                      <div className="fact-item">
                        <Users size={18} />
                        <div>
                          <strong>Class Size:</strong>
                          <span>Average 20-25 students</span>
                        </div>
                      </div>
                      <div className="fact-item">
                        <Calendar size={18} />
                        <div>
                          <strong>Academic Year:</strong>
                          <span>September - June</span>
                        </div>
                      </div>
                      <div className="fact-item">
                        <Award size={18} />
                        <div>
                          <strong>Accreditation:</strong>
                          <span>Fully Accredited</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === 'classes' && (
              <div className="tab-panel">
                <section className="info-section">
                  <div className="section-header">
                    <BookOpen size={24} />
                    <h2>Available Programs & Classes</h2>
                  </div>
                  <div className="section-content">
                    {school.classes && school.classes.length > 0 ? (
                      <div className="classes-grid-enhanced">
                        {school.classes.map((cls) => (
                          <div key={cls.id} className="class-card-enhanced">
                            <div className="class-card-header">
                              <div>
                                <h3 className="class-name">{cls.name}</h3>
                                {cls.level && (
                                  <span className="class-level">{cls.level}</span>
                                )}
                              </div>
                              {cls.teacher && (
                                <div className="class-teacher-badge">
                                  <GraduationCap size={16} />
                                  <span>{cls.teacher.name}</span>
                                </div>
                              )}
                            </div>

                            {cls.description && (
                              <p className="class-description">{cls.description}</p>
                            )}

                            <div className="class-details">
                              <div className="detail-item">
                                <Users size={16} />
                                <span>{cls._count?.enrollments || 0} students enrolled</span>
                              </div>
                              <div className="detail-item">
                                <Calendar size={16} />
                                <span>Full academic year</span>
                              </div>
                            </div>

                            {(cls.enrollmentFee || cls.tuitionFee) && (
                              <div className="class-fees-enhanced">
                                <div className="fees-header">
                                  <DollarSign size={18} />
                                  <strong>Tuition Fees</strong>
                                </div>
                                {cls.enrollmentFee && (
                                  <div className="fee-row">
                                    <span>Enrollment Fee:</span>
                                    <strong>{cls.enrollmentFee.amount.toLocaleString()} {cls.enrollmentFee.currency}</strong>
                                  </div>
                                )}
                                {cls.tuitionFee && (
                                  <div className="fee-row">
                                    <span>Tuition Fee:</span>
                                    <strong>{cls.tuitionFee.amount.toLocaleString()} {cls.tuitionFee.currency}</strong>
                                  </div>
                                )}
                                {cls.enrollmentFee && cls.tuitionFee && (
                                  <div className="fee-row total">
                                    <span>Total:</span>
                                    <strong>
                                      {(cls.enrollmentFee.amount + cls.tuitionFee.amount).toLocaleString()}{' '}
                                      {cls.enrollmentFee.currency}
                                    </strong>
                                  </div>
                                )}
                              </div>
                            )}

                            <button 
                              className="class-enroll-btn"
                              onClick={() => navigate('/signup', { state: { selectedSchool: school, selectedClass: cls } })}
                            >
                              Enroll Now
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-data">
                        <BookOpen size={48} />
                        <p>No programs available at the moment</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Admission Tab */}
            {activeTab === 'admission' && (
              <div className="tab-panel">
                <section className="info-section">
                  <div className="section-header">
                    <FileText size={24} />
                    <h2>Admission Process</h2>
                  </div>
                  <div className="section-content">
                    <div className="admission-steps">
                      <div className="step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                          <h3>Create an Account</h3>
                          <p>Register as a parent on the EduckPro platform to get started.</p>
                        </div>
                      </div>

                      <div className="step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                          <h3>Submit Application</h3>
                          <p>Add your child's information and select the desired program/class.</p>
                        </div>
                      </div>

                      <div className="step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                          <h3>School Review</h3>
                          <p>Our admissions team will review your application within 24-48 hours.</p>
                        </div>
                      </div>

                      <div className="step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                          <h3>Enrollment Confirmation</h3>
                          <p>Once approved, complete the enrollment by paying the required fees.</p>
                        </div>
                      </div>
                    </div>

                    <div className="admission-requirements">
                      <h3>Required Documents</h3>
                      <ul className="requirements-list">
                        <li><CheckCircle size={18} /> Birth certificate (copy)</li>
                        <li><CheckCircle size={18} /> Previous school records (if applicable)</li>
                        <li><CheckCircle size={18} /> Immunization records</li>
                        <li><CheckCircle size={18} /> Parent/Guardian ID</li>
                        <li><CheckCircle size={18} /> Recent passport-size photograph</li>
                      </ul>
                    </div>

                    <div className="cta-box">
                      <h3>Ready to Apply?</h3>
                      <p>Start your child's educational journey with us today!</p>
                      <button 
                        className="btn-large"
                        onClick={() => navigate('/signup', { state: { selectedSchool: school } })}
                      >
                        Begin Application
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* News & Events Tab */}
            {activeTab === 'news' && (
              <div className="tab-panel">
                <section className="info-section">
                  <div className="section-header">
                    <FileText size={24} />
                    <h2>Latest News & Announcements</h2>
                  </div>
                  <div className="section-content">
                    {loadingPosts ? (
                      <div className="no-data">
                        <div className="loading-spinner"></div>
                        <p>Loading posts...</p>
                      </div>
                    ) : posts.filter(p => p.type !== 'photo').length === 0 ? (
                      <div className="no-data">
                        <FileText size={48} />
                        <p>No announcements or news yet. Check back later for updates!</p>
                      </div>
                    ) : (
                      <div className="news-grid">
                        {posts.filter(p => p.type !== 'photo').map((item) => (
                          <div key={item.id} className={`news-card ${item.type}`}>
                            <div className="news-header">
                              <div className="news-badge">
                                {item.type === 'announcement' && '📢'}
                                {item.type === 'event' && '📅'}
                                {item.type === 'news' && '📰'}
                                <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                              </div>
                              <div className="news-date">
                                <Calendar size={14} />
                                {new Date(item.createdAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </div>
                            </div>
                            {item.imageUrl && (
                              <img 
                                src={item.imageUrl} 
                                alt={item.title}
                                className="news-image"
                              />
                            )}
                            <h3 className="news-title">{item.title}</h3>
                            <p className="news-content">{item.content}</p>
                            <div className="news-footer">
                              <span className="news-author">Posted by {item.author?.name || 'School Admin'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Photo Gallery */}
                <section className="info-section">
                  <div className="section-header">
                    <Building2 size={24} />
                    <h2>Photo Gallery</h2>
                  </div>
                  <div className="section-content">
                    {posts.filter(p => p.type === 'photo').length > 0 ? (
                      <>
                        <div className="photo-gallery">
                          {posts.filter(p => p.type === 'photo').map((photo) => (
                            <div key={photo.id} className="photo-item">
                              <img src={photo.imageUrl || '/images/hero-background.png'} alt={photo.title} />
                              <div className="photo-overlay">
                                <div className="photo-category">{photo.type}</div>
                                <div className="photo-caption">{photo.title}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="gallery-note">
                          <Info size={18} />
                          <p>More photos and updates coming soon. Follow us on social media for daily updates!</p>
                        </div>
                      </>
                    ) : (
                      <div className="no-data">
                        <Building2 size={48} />
                        <p>No photos available yet. Check back later!</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Upcoming Events Calendar */}
                <section className="info-section">
                  <div className="section-header">
                    <Calendar size={24} />
                    <h2>Upcoming Events</h2>
                  </div>
                  <div className="section-content">
                    <div className="events-timeline">
                      {posts.filter(p => p.type === 'event').length > 0 ? (
                        posts.filter(p => p.type === 'event').map((event) => {
                          const eventDisplayDate = event.eventDate ? new Date(event.eventDate) : new Date(event.createdAt);
                          return (
                            <div key={event.id} className="timeline-item">
                              <div className="timeline-date">
                                <div className="timeline-month">
                                  {eventDisplayDate.toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                                <div className="timeline-day">
                                  {eventDisplayDate.getDate()}
                                </div>
                              </div>
                              <div className="timeline-content">
                                {event.imageUrl && (
                                  <img 
                                    src={event.imageUrl} 
                                    alt={event.title}
                                    className="event-image"
                                  />
                                )}
                                <h4>{event.title}</h4>
                                <p>{event.content}</p>
                                <button 
                                  className="event-rsvp"
                                  onClick={() => navigate('/signup', { state: { selectedSchool: school } })}
                                >
                                  Register to Attend
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="no-events">
                          <Calendar size={48} />
                          <p>No upcoming events at the moment. Check back later!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="tab-panel">
                <section className="info-section">
                  <div className="section-header">
                    <MessageSquare size={24} />
                    <h2>Get in Touch</h2>
                  </div>
                  <div className="section-content">
                    <div className="contact-grid-enhanced">
                      {school.address && (
                        <div className="contact-card">
                          <div className="contact-icon">
                            <MapPin size={24} />
                          </div>
                          <div className="contact-details">
                            <h4>Visit Us</h4>
                            <p>
                              {school.address}
                              {school.city && <br />}{school.city}
                              {school.state && `, ${school.state}`}
                              {school.postalCode && <br />}{school.postalCode}
                              {school.country && <br />}{school.country}
                            </p>
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent([school.address, school.city, school.country].filter(Boolean).join(', '))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="contact-action"
                            >
                              Get Directions →
                            </a>
                          </div>
                        </div>
                      )}

                      {school.phone && (
                        <div className="contact-card">
                          <div className="contact-icon">
                            <Phone size={24} />
                          </div>
                          <div className="contact-details">
                            <h4>Call Us</h4>
                            <p>{school.phone}</p>
                            <a href={`tel:${school.phone}`} className="contact-action">
                              Make a Call →
                            </a>
                          </div>
                        </div>
                      )}

                      {school.email && (
                        <div className="contact-card">
                          <div className="contact-icon">
                            <Mail size={24} />
                          </div>
                          <div className="contact-details">
                            <h4>Email Us</h4>
                            <p>{school.email}</p>
                            <a href={`mailto:${school.email}`} className="contact-action">
                              Send Email →
                            </a>
                          </div>
                        </div>
                      )}

                      {school.website && (
                        <div className="contact-card">
                          <div className="contact-icon">
                            <Globe size={24} />
                          </div>
                          <div className="contact-details">
                            <h4>Visit Website</h4>
                            <p>{school.website}</p>
                            <a href={school.website} target="_blank" rel="noopener noreferrer" className="contact-action">
                              Open Website →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Office Hours */}
                    <div className="office-hours">
                      <h3>Office Hours</h3>
                      <div className="hours-grid">
                        <div className="hours-item">
                          <strong>Monday - Friday:</strong>
                          <span>8:00 AM - 4:00 PM</span>
                        </div>
                        <div className="hours-item">
                          <strong>Saturday:</strong>
                          <span>9:00 AM - 12:00 PM</span>
                        </div>
                        <div className="hours-item">
                          <strong>Sunday:</strong>
                          <span>Closed</span>
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="social-media">
                      <h3>Follow Us</h3>
                      <div className="social-links">
                        <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                          <Facebook size={20} />
                          <span>Facebook</span>
                        </a>
                        <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                          <Twitter size={20} />
                          <span>Twitter</span>
                        </a>
                        <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                          <Instagram size={20} />
                          <span>Instagram</span>
                        </a>
                        <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
                          <Youtube size={20} />
                          <span>YouTube</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Floating CTA */}
          <div className="floating-cta">
            <div className="floating-cta-content">
              <div className="cta-text">
                <strong>Ready to Join {school.name}?</strong>
                <span>Start your enrollment today</span>
              </div>
              <div className="cta-buttons">
                <button
                  className="btn-primary-cta"
                  onClick={() => navigate('/signup', { state: { selectedSchool: school } })}
                >
                  Get Started
                </button>
                <button
                  className="btn-secondary-cta"
                  onClick={() => setActiveTab('contact')}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SchoolPublicPage;
