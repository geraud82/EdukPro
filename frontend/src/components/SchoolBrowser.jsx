import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './SchoolBrowser.css';

function SchoolBrowser({ onSelectSchool, students = [] }) {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [searchTerm, schools]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/schools`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }

      const data = await response.json();
      setSchools(data);
      setFilteredSchools(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterSchools = () => {
    if (!searchTerm.trim()) {
      setFilteredSchools(schools);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = schools.filter(
      (school) =>
        school.name?.toLowerCase().includes(term) ||
        school.address?.toLowerCase().includes(term) ||
        school.city?.toLowerCase().includes(term) ||
        school.country?.toLowerCase().includes(term) ||
        school.description?.toLowerCase().includes(term)
    );
    setFilteredSchools(filtered);
  };

  const handleSchoolClick = async (school) => {
    setSelectedSchool(school);
    setLoadingClasses(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/classes?schoolId=${school.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const data = await response.json();
      setSchoolClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setSchoolClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleEnrollInSchool = () => {
    if (onSelectSchool && selectedSchool) {
      onSelectSchool(selectedSchool, schoolClasses);
    }
  };

  const handleBackToList = () => {
    setSelectedSchool(null);
    setSchoolClasses([]);
  };

  if (loading) {
    return <div className="school-browser-loading">Loading schools...</div>;
  }

  if (error) {
    return <div className="school-browser-error">Error: {error}</div>;
  }

  // Detail View
  if (selectedSchool) {
    return (
      <div className="school-detail-view">
        <button onClick={handleBackToList} className="back-button">
          ← Back to Schools
        </button>

        <div className="school-detail-header">
          <h2>{selectedSchool.name}</h2>
          <button onClick={handleEnrollInSchool} className="enroll-button">
            Enroll Child in This School
          </button>
        </div>

        <div className="school-detail-info">
          <div className="info-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              {selectedSchool.address && (
                <div className="info-item">
                  <strong>Address:</strong>
                  <span>{selectedSchool.address}</span>
                </div>
              )}
              {selectedSchool.city && (
                <div className="info-item">
                  <strong>City:</strong>
                  <span>{selectedSchool.city}</span>
                </div>
              )}
              {selectedSchool.state && (
                <div className="info-item">
                  <strong>State:</strong>
                  <span>{selectedSchool.state}</span>
                </div>
              )}
              {selectedSchool.country && (
                <div className="info-item">
                  <strong>Country:</strong>
                  <span>{selectedSchool.country}</span>
                </div>
              )}
              {selectedSchool.phone && (
                <div className="info-item">
                  <strong>Phone:</strong>
                  <span>{selectedSchool.phone}</span>
                </div>
              )}
              {selectedSchool.email && (
                <div className="info-item">
                  <strong>Email:</strong>
                  <span>{selectedSchool.email}</span>
                </div>
              )}
              {selectedSchool.website && (
                <div className="info-item">
                  <strong>Website:</strong>
                  <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer">
                    {selectedSchool.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {selectedSchool.description && (
            <div className="info-section">
              <h3>About</h3>
              <p>{selectedSchool.description}</p>
            </div>
          )}

          <div className="info-section">
            <h3>Available Classes</h3>
            {loadingClasses ? (
              <p>Loading classes...</p>
            ) : schoolClasses.length === 0 ? (
              <p className="no-classes">No classes available at this school yet.</p>
            ) : (
              <div className="classes-grid">
                {schoolClasses.map((cls) => (
                  <div key={cls.id} className="class-card">
                    <h4>{cls.name}</h4>
                    {cls.level && <p className="class-level">Level: {cls.level}</p>}
                    {cls.description && <p className="class-description">{cls.description}</p>}
                    {cls.teacher && (
                      <p className="class-teacher">
                        <strong>Teacher:</strong> {cls.teacher.name}
                      </p>
                    )}
                    <div className="class-fees">
                      {cls.enrollmentFee && (
                        <div className="fee-item">
                          <span>Enrollment Fee:</span>
                          <strong>{cls.enrollmentFee.amount.toLocaleString()} {cls.enrollmentFee.currency}</strong>
                        </div>
                      )}
                      {cls.tuitionFee && (
                        <div className="fee-item">
                          <span>Tuition Fee:</span>
                          <strong>{cls.tuitionFee.amount.toLocaleString()} {cls.tuitionFee.currency}</strong>
                        </div>
                      )}
                    </div>
                    
                    {/* Enrollment Section */}
                    {students.length > 0 ? (
                      <EnrollmentSection cls={cls} students={students} schoolName={selectedSchool.name} />
                    ) : (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#92400e' }}>
                        ⚠️ Please add a child in the Children tab before enrolling in classes.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="school-browser">
      <div className="school-browser-header">
        <h2>Browse Schools</h2>
        <p>Find and enroll your child in the perfect school</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search schools by name, location, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="clear-button">
            ✕
          </button>
        )}
      </div>

      <div className="schools-count">
        {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'} found
      </div>

      {filteredSchools.length === 0 ? (
        <div className="no-schools">
          <p>No schools found matching your search.</p>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="reset-button">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="schools-grid">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="school-card"
              onClick={() => handleSchoolClick(school)}
            >
              <div className="school-card-header">
                <h3>{school.name}</h3>
              </div>
              <div className="school-card-body">
                {(school.address || school.city || school.state || school.country) && (
                  <p className="school-location">
                    📍 {[school.address, school.city, school.state, school.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
                {school.description && school.description.trim().length > 10 && (
                  <p className="school-description">
                    {school.description.length > 100
                      ? `${school.description.substring(0, 100)}...`
                      : school.description}
                  </p>
                )}
                <div className="school-stats">
                  <span className="stat">
                    👥 {school._count?.students || 0} Students
                  </span>
                  <span className="stat">
                    📚 {school._count?.classes || 0} Classes
                  </span>
                </div>
              </div>
              <div className="school-card-footer">
                <button className="view-details-btn">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Enrollment Section Component
function EnrollmentSection({ cls, students, schoolName }) {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedStudent = students.find(s => s.id === Number(studentId));
  const totalFees = (cls.enrollmentFee?.amount || 0) + (cls.tuitionFee?.amount || 0);

  async function handleEnroll(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedStudent) {
      setError('Please select a student');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: Number(studentId),
          classId: cls.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Enrollment failed');

      setSuccess('Enrollment request submitted successfully!');
      setStudentId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '1rem', borderTop: '2px solid #e5e7eb', paddingTop: '1rem' }}>
      <h5 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: '#374151' }}>
        📝 Enroll in this Class
      </h5>
      
      <form onSubmit={handleEnroll}>
        <select
          value={studentId}
          onChange={e => {
            setStudentId(e.target.value);
            setError('');
            setSuccess('');
          }}
          required
          style={{
            width: '100%',
            padding: '0.6rem',
            marginBottom: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.9rem',
          }}
        >
          <option value="">-- Select your child --</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        {selectedStudent && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#eff6ff',
            borderRadius: '0.375rem',
            marginBottom: '0.75rem',
            fontSize: '0.85rem',
          }}>
            <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.25rem' }}>
              Selected: {selectedStudent.firstName} {selectedStudent.lastName}
            </div>
            {totalFees > 0 && (
              <div style={{ color: '#3b82f6' }}>
                Total Fees: {totalFees.toLocaleString()} {cls.enrollmentFee?.currency || cls.tuitionFee?.currency || 'XOF'}
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '0.375rem',
            marginBottom: '0.75rem',
            color: '#991b1b',
            fontSize: '0.85rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '0.375rem',
            marginBottom: '0.75rem',
            color: '#065f46',
            fontSize: '0.85rem',
          }}>
            ✅ {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !studentId}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: studentId ? '#6366f1' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: studentId ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? '⏳ Submitting...' : '📝 Submit Enrollment Request'}
        </button>
      </form>

      <div style={{
        marginTop: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#dbeafe',
        borderRadius: '0.375rem',
        fontSize: '0.8rem',
        color: '#1e40af',
      }}>
        ℹ️ Your enrollment request will be sent to the school admin for approval. Invoices will be created once approved.
      </div>
    </div>
  );
}

export default SchoolBrowser;
