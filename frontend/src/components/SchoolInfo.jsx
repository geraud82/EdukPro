import { useState, useEffect } from 'react';

function SchoolInfo() {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    loadSchoolInfo();
  }, []);

  async function loadSchoolInfo() {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      // First, fetch the user's profile to get the current schoolId
      const profileRes = await fetch('http://localhost:4000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profileRes.ok) {
        throw new Error('Failed to load profile');
      }

      const profileData = await profileRes.json();
      
      // Check if user has a school assigned
      if (!profileData.school && !profileData.schoolId) {
        setError('No school assigned to your account');
        setLoading(false);
        return;
      }

      // If we have school data from profile, use it directly
      if (profileData.school) {
        const res = await fetch(`http://localhost:4000/api/schools/${profileData.school.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load school info');

        setSchool(data);
        setFormData({
          name: data.name || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          postalCode: data.postalCode || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          description: data.description || '',
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const res = await fetch(`http://localhost:4000/api/schools/${user.schoolId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setSchool(data);
      setUpdateSuccess('School information updated successfully!');
      setEditing(false);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSaveSchool(e) {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      // Create new school
      const res = await fetch('http://localhost:4000/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone || null,
          email: formData.email || null,
          website: formData.website || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create school');

      // Update localStorage with new school assignment
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.schoolId = data.id;
      localStorage.setItem('user', JSON.stringify(user));

      setSchool(data);
      setError('');
      setUpdateSuccess('School created successfully!');
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setEditing(false);
    setUpdateError('');
    setUpdateSuccess('');
    if (school) {
      setFormData({
        name: school.name || '',
        address: school.address || '',
        city: school.city || '',
        state: school.state || '',
        country: school.country || '',
        postalCode: school.postalCode || '',
        phone: school.phone || '',
        email: school.email || '',
        website: school.website || '',
        description: school.description || '',
      });
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p>Loading school information...</p>
      </div>
    );
  }

  if (error && error !== 'No school assigned to your account') {
    return (
      <div className="card">
        <div className="alert alert-error">⚠️ {error}</div>
      </div>
    );
  }

  // If no school is assigned, show a form to create one
  if (!school || error === 'No school assigned to your account') {
    return (
      <div className="card">
        <h3>🏫 Create School Profile</h3>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          No school is currently assigned to your account. Create your school profile to get started.
        </p>
        
        <form onSubmit={handleSaveSchool}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            School Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter school name"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Address <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            placeholder="Enter school address"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Enter phone number"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="school@example.com"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://www.school.com"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
          />

          {updateError && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              ⚠️ {updateError}
            </div>
          )}

          <button 
            className="btn" 
            type="submit" 
            disabled={saving}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          >
            {saving ? '⏳ Creating School...' : '✨ Create School Profile'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>🏫 School Information</h3>
          {!editing && (
            <button className="btn" onClick={() => setEditing(true)}>
              ✏️ Edit Information
            </button>
          )}
        </div>

        {updateSuccess && (
          <div className="alert alert-success" style={{ marginBottom: '1rem', backgroundColor: '#d1fae5', color: '#065f46' }}>
            ✅ {updateSuccess}
          </div>
        )}

        {!editing ? (
          <div>
            {/* School Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem', fontWeight: '600' }}>
                School Name
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {school.name}
              </div>
            </div>

            {/* Contact Information */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              {/* Address */}
              {(school.address || school.city || school.state || school.postalCode || school.country) && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                    📍 Address
                  </div>
                  <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {school.address && <div>{school.address}</div>}
                    <div>
                      {school.city && <span>{school.city}</span>}
                      {school.city && school.state && <span>, </span>}
                      {school.state && <span>{school.state}</span>}
                      {school.postalCode && <span> {school.postalCode}</span>}
                    </div>
                    {school.country && <div>{school.country}</div>}
                  </div>
                </div>
              )}

              {/* Contact Details */}
              <div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                  📞 Contact Details
                </div>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
                  {school.phone ? (
                    <div>
                      <span style={{ fontWeight: '600' }}>Phone:</span> {school.phone}
                    </div>
                  ) : (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>No phone number</div>
                  )}
                  {school.email ? (
                    <div>
                      <span style={{ fontWeight: '600' }}>Email:</span> {school.email}
                    </div>
                  ) : (
                    <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>No email address</div>
                  )}
                  {school.website && (
                    <div>
                      <span style={{ fontWeight: '600' }}>Website:</span>{' '}
                      <a 
                        href={school.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}
                      >
                        {school.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {school.description && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: '600' }}>
                  ℹ️ About
                </div>
                <div style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                }}>
                  {school.description}
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {/* School Name */}
              <div>
                <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                  School Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.6rem', fontSize: '1rem' }}
                />
              </div>

              {/* Address Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    style={{ width: '100%', padding: '0.6rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      style={{ width: '100%', padding: '0.6rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      style={{ width: '100%', padding: '0.6rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="12345"
                      style={{ width: '100%', padding: '0.6rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      style={{ width: '100%', padding: '0.6rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    style={{ width: '100%', padding: '0.6rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="school@example.com"
                    style={{ width: '100%', padding: '0.6rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.school.com"
                    style={{ width: '100%', padding: '0.6rem' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.85rem', marginBottom: '0.25rem', display: 'block', fontWeight: '600' }}>
                  About the School
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell parents and students about your school..."
                  rows="4"
                  style={{ width: '100%', padding: '0.6rem', fontSize: '1rem', resize: 'vertical' }}
                />
              </div>

              {updateError && (
                <div className="alert alert-error">⚠️ {updateError}</div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" type="submit" disabled={updating}>
                  {updating ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={cancelEdit}
                  style={{ backgroundColor: '#6b7280' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Classes Section */}
      {school.classes && school.classes.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>📚 Classes at this School ({school.classes.length})</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {school.classes.map(cls => (
              <div
                key={cls.id}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '1.05rem' }}>📖 {cls.name}</strong>
                      {cls.level && (
                        <span style={{ 
                          marginLeft: '0.5rem',
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.75rem',
                          backgroundColor: '#eff6ff',
                          color: '#1e40af',
                          borderRadius: '0.25rem',
                          fontWeight: '600',
                        }}>
                          {cls.level}
                        </span>
                      )}
                    </div>
                    
                    {cls.description && (
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.5rem 0' }}>
                        {cls.description}
                      </p>
                    )}

                    {cls.teacher && (
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#6b7280', 
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}>
                        <span>👨‍🏫</span>
                        <span>Teacher: {cls.teacher.name}</span>
                      </div>
                    )}

                    <div style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginTop: '0.5rem',
                      fontSize: '0.85rem',
                    }}>
                      {cls.enrollmentFee && (
                        <div>
                          <span style={{ fontWeight: '600' }}>Enrollment:</span>{' '}
                          {cls.enrollmentFee.amount.toLocaleString()} {cls.enrollmentFee.currency}
                        </div>
                      )}
                      {cls.tuitionFee && (
                        <div>
                          <span style={{ fontWeight: '600' }}>Tuition:</span>{' '}
                          {cls.tuitionFee.amount.toLocaleString()} {cls.tuitionFee.currency}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolInfo;
