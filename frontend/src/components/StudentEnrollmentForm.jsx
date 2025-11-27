import { useState } from 'react';
import './StudentEnrollmentForm.css';

const StudentEnrollmentForm = ({ onSubmit, onCancel, API_URL, token }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    bloodGroup: '',
    
    // Contact Information
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    
    // Guardian Information
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Medical Information
    allergies: '',
    medicalConditions: '',
    medications: '',
    doctorName: '',
    doctorPhone: '',
    
    // Previous School Information
    previousSchool: '',
    previousGrade: '',
    transferReason: '',
    
    // Additional Information
    specialNeeds: '',
    notes: '',
  });

  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      file,
      type: 'other',
      description: '',
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const updateDocumentType = (index, type) => {
    setDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, type } : doc
    ));
  };

  const updateDocumentDescription = (index, description) => {
    setDocuments(prev => prev.map((doc, i) => 
      i === index ? { ...doc, description } : doc
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Create student
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const student = await response.json();

      // Step 2: Upload documents if any
      if (documents.length > 0) {
        const uploadFormData = new FormData();
        const types = [];
        const descriptions = [];

        documents.forEach(doc => {
          uploadFormData.append('files', doc.file);
          types.push(doc.type);
          descriptions.push(doc.description);
        });

        uploadFormData.append('documentTypes', JSON.stringify(types));
        uploadFormData.append('descriptions', JSON.stringify(descriptions));

        await fetch(`${API_URL}/students/${student.id}/documents`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        });
      }

      onSubmit(student);
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to create student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Contact' },
    { number: 3, title: 'Guardian & Emergency' },
    { number: 4, title: 'Medical & Previous School' },
    { number: 5, title: 'Documents & Notes' },
  ];

  return (
    <div className="enrollment-form-container">
      <div className="enrollment-form">
        {/* Progress Steps */}
        <div className="steps-container">
          {steps.map(step => (
            <div
              key={step.number}
              className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-title">{step.title}</div>
            </div>
          ))}
        </div>

        <div className="enrollment-form-header">
          <h2>Student Enrollment Form</h2>
          <button type="button" onClick={onCancel} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="enrollment-form-content">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h3>Contact Information</h3>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Step 3: Guardian & Emergency Contact */}
        {currentStep === 3 && (
          <div className="form-step">
            <h3>Guardian Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Relation</label>
                <input
                  type="text"
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  placeholder="e.g., Father, Mother, Uncle"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Guardian Phone</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Guardian Email</label>
                <input
                  type="email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Guardian Address</label>
              <input
                type="text"
                name="guardianAddress"
                value={formData.guardianAddress}
                onChange={handleChange}
              />
            </div>

            <h3 style={{ marginTop: '2rem' }}>Emergency Contact</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Emergency Contact Relation</label>
              <input
                type="text"
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Step 4: Medical & Previous School */}
        {currentStep === 4 && (
          <div className="form-step">
            <h3>Medical Information</h3>
            <div className="form-group">
              <label>Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="2"
                placeholder="List any known allergies"
              />
            </div>

            <div className="form-group">
              <label>Medical Conditions</label>
              <textarea
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                rows="2"
                placeholder="List any medical conditions"
              />
            </div>

            <div className="form-group">
              <label>Medications</label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                rows="2"
                placeholder="List any medications being taken"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Doctor Name</label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Doctor Phone</label>
                <input
                  type="tel"
                  name="doctorPhone"
                  value={formData.doctorPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h3 style={{ marginTop: '2rem' }}>Previous School Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Previous School</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Previous Grade</label>
                <input
                  type="text"
                  name="previousGrade"
                  value={formData.previousGrade}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Transfer</label>
              <textarea
                name="transferReason"
                value={formData.transferReason}
                onChange={handleChange}
                rows="2"
              />
            </div>
          </div>
        )}

        {/* Step 5: Documents & Notes */}
        {currentStep === 5 && (
          <div className="form-step">
            <h3>Upload Documents</h3>
            <div className="form-group">
              <label>Student Documents</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <small>Upload birth certificate, ID, medical records, photos, etc. (Max 10MB per file)</small>
            </div>

            {documents.length > 0 && (
              <div className="documents-list">
                <h4>Selected Documents ({documents.length})</h4>
                {documents.map((doc, index) => (
                  <div key={index} className="document-item">
                    <div className="document-info">
                      <span className="document-name">{doc.file.name}</span>
                      <span className="document-size">
                        ({(doc.file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <div className="document-details">
                      <select
                        value={doc.type}
                        onChange={(e) => updateDocumentType(index, e.target.value)}
                        className="doc-type-select"
                      >
                        <option value="birth_certificate">Birth Certificate</option>
                        <option value="id_card">ID Card</option>
                        <option value="medical_record">Medical Record</option>
                        <option value="photo">Photo</option>
                        <option value="transcript">Transcript</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={doc.description}
                        onChange={(e) => updateDocumentDescription(index, e.target.value)}
                        className="doc-description"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="remove-doc-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ marginTop: '2rem' }}>Additional Information</h3>
            <div className="form-group">
              <label>Special Needs</label>
              <textarea
                name="specialNeeds"
                value={formData.specialNeeds}
                onChange={handleChange}
                rows="2"
                placeholder="Describe any special needs or accommodations required"
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any other information you'd like to provide"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </button>
          )}
          <div className="nav-spacer"></div>
          {currentStep < 5 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
            </button>
          )}
        </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEnrollmentForm;
