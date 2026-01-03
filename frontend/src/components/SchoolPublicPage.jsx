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
  Info
} from 'lucide-react';
import { API_URL } from '../config';
import './SchoolPublicPage.css';

function SchoolPublicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchoolDetails();
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

  return (
    <div className="school-public-page">
      {/* Header */}
      <header className="school-header">
        <div className="header-container">
          <button className="btn-back" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Back to Schools
          </button>
          
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="school-content">
        <div className="content-container">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={32} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{school._count?.students || 0}</div>
                <div className="stat-label">Students</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={32} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{school._count?.classes || 0}</div>
                <div className="stat-label">Classes</div>
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
                <div className="stat-label">Teachers</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Building2 size={32} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{school._count?.users || 0}</div>
                <div className="stat-label">Staff</div>
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

          {/* Contact Information */}
          <section className="info-section">
            <div className="section-header">
              <Phone size={24} />
              <h2>Contact Information</h2>
            </div>
            <div className="section-content">
              <div className="contact-grid">
                {school.address && (
                  <div className="contact-item">
                    <MapPin size={20} />
                    <div>
                      <div className="contact-label">Address</div>
                      <div className="contact-value">
                        {school.address}
                        {school.city && `, ${school.city}`}
                        {school.state && `, ${school.state}`}
                        {school.postalCode && ` ${school.postalCode}`}
                        {school.country && `, ${school.country}`}
                      </div>
                    </div>
                  </div>
                )}

                {school.phone && (
                  <div className="contact-item">
                    <Phone size={20} />
                    <div>
                      <div className="contact-label">Phone</div>
                      <div className="contact-value">
                        <a href={`tel:${school.phone}`}>{school.phone}</a>
                      </div>
                    </div>
                  </div>
                )}

                {school.email && (
                  <div className="contact-item">
                    <Mail size={20} />
                    <div>
                      <div className="contact-label">Email</div>
                      <div className="contact-value">
                        <a href={`mailto:${school.email}`}>{school.email}</a>
                      </div>
                    </div>
                  </div>
                )}

                {school.website && (
                  <div className="contact-item">
                    <Globe size={20} />
                    <div>
                      <div className="contact-label">Website</div>
                      <div className="contact-value">
                        <a href={school.website} target="_blank" rel="noopener noreferrer">
                          {school.website}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Available Classes */}
          {school.classes && school.classes.length > 0 && (
            <section className="info-section">
              <div className="section-header">
                <BookOpen size={24} />
                <h2>Available Classes</h2>
              </div>
              <div className="section-content">
                <div className="classes-grid">
                  {school.classes.map((cls) => (
                    <div key={cls.id} className="class-card">
                      <div className="class-header">
                        <h3 className="class-name">{cls.name}</h3>
                        {cls.level && (
                          <span className="class-level">{cls.level}</span>
                        )}
                      </div>

                      {cls.description && (
                        <p className="class-description">{cls.description}</p>
                      )}

                      {cls.teacher && (
                        <div className="class-teacher">
                          <GraduationCap size={16} />
                          <span>Teacher: {cls.teacher.name}</span>
                        </div>
                      )}

                      {(cls.enrollmentFee || cls.tuitionFee) && (
                        <div className="class-fees">
                          {cls.enrollmentFee && (
                            <div className="fee-item">
                              <DollarSign size={16} />
                              <span>
                                Enrollment: {cls.enrollmentFee.amount.toLocaleString()}{' '}
                                {cls.enrollmentFee.currency}
                              </span>
                            </div>
                          )}
                          {cls.tuitionFee && (
                            <div className="fee-item">
                              <DollarSign size={16} />
                              <span>
                                Tuition: {cls.tuitionFee.amount.toLocaleString()}{' '}
                                {cls.tuitionFee.currency}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="cta-section">
            <div className="cta-card">
              <h2>Interested in Enrolling?</h2>
              <p>
                Create an account to enroll your child in {school.name} and access
                all our platform features.
              </p>
              <div className="cta-buttons">
                <button
                  className="btn-primary"
                  onClick={() => navigate('/signup', { state: { selectedSchool: school } })}
                >
                  Get Started
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SchoolPublicPage;
