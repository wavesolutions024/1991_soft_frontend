import React, { useState } from 'react'
import './ClientForm.scss'

const ClientForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    instagram: '',
    dob: '',
    gender: '',
    address: '',
    allergies: '',
    consent: false,
    notes: '',
    consentFile: null,
  })

  const [submitted, setSubmitted] = useState(false)
  const [fileSelected, setFileSelected] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({
      ...prev,
      consentFile: file
    }))
    setFileSelected(!!file)
  }

  const handleReset = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      instagram: '',
      dob: '',
      gender: '',
      address: '',
      allergies: '',
      consent: false,
      notes: '',
      consentFile: null,
    })
    setFileSelected(false)
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.email || !formData.instagram || !formData.dob) {
      alert('Please fill in all required fields')
      return
    }

    if (!formData.consent) {
      alert('Please accept the consent form')
      return
    }

    console.log('Form submitted:', formData)
    setSubmitted(true)
    
    // Reset form after 2 seconds
    setTimeout(() => {
      handleReset()
    }, 2000)
  }

  return (
    <div className="client-form-container">
      <div className="form-header">
        <h1>New Client Registration</h1>
        <p>Please fill in your information to register as a new client</p>
      </div>

      {submitted && <div className="success-message">✓ Form submitted successfully!</div>}

      <form onSubmit={handleSubmit}>
        
        {/* Personal Information Section */}
        <div className="form-section">
          <h2 className="section-title">Personal Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>
                Full Name
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Phone Number
                <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Email
                <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Instagram Handle
                <span className="required">*</span>
                <span className="warning">⚠️</span>
              </label>
              <input
                type="text"
                name="instagram"
                placeholder="@username"
                value={formData.instagram}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="form-section">
          <h2 className="section-title">Additional Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>
                Date of Birth
                <span className="required">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Gender
                <span className="optional">(Optional)</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-row full">
            <div className="form-group">
              <label>
                Address
                <span className="optional">(Optional)</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Main Street, City, State, ZIP"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Health Information Section */}
        <div className="form-section">
          <h2 className="section-title">Health Information</h2>

          <div className="form-row full">
            <div className="form-group">
              <label>
                Allergies / Skin Conditions
                <span className="warning">⚠️</span>
              </label>
              <textarea
                name="allergies"
                placeholder="Please list any allergies or skin conditions (e.g., sensitive skin, keloid prone, latex allergy)..."
                value={formData.allergies}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Consent Section */}
        <div className="form-section">
          <h2 className="section-title">Consent & Documentation</h2>

          <div className="form-row full">
            <div className="form-group">
              <label>Upload Consent Form</label>
              <div className="file-upload">
                <label htmlFor="consent-file" className={fileSelected ? 'file-selected' : ''}>
                  {fileSelected ? '✓ File Selected' : '📎 Upload Consent Form'}
                </label>
                <input
                  type="file"
                  id="consent-file"
                  name="consentFile"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {fileSelected && formData.consentFile && (
                  <div className="file-name">{formData.consentFile.name}</div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row full">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="consent-check"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
              />
              <label htmlFor="consent-check">
                I agree to the consent form and understand the risks involved in tattoo procedures
                <span className="required">*</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="form-section">
          <h2 className="section-title">Additional Notes</h2>

          <div className="form-row full">
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                placeholder="Any additional information or special requests..."
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="reset" className="reset-btn" onClick={handleReset}>
            Clear Form
          </button>
          <button type="submit" className="submit-btn">
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClientForm