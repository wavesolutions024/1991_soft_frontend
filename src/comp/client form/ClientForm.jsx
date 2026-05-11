import React, { useState } from 'react'
import './ClientForm.scss'

const initialFormData = {
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
}

const sampleClients = [
  {
    id: 1,
    fullName: 'John Doe',
    phone: '+1 (555) 000-0000',
    email: 'john@example.com',
    instagram: '@johndoe',
    dob: '1990-02-18',
    gender: 'Male',
  },
  {
    id: 2,
    fullName: 'Maya Chen',
    phone: '+1 (555) 333-1234',
    email: 'maya@example.com',
    instagram: '@mayart',
    dob: '1992-08-09',
    gender: 'Female',
  },
  {
    id: 3,
    fullName: 'Luna Garcia',
    phone: '+1 (555) 777-7777',
    email: 'luna@example.com',
    instagram: '@luna_ink',
    dob: '1988-12-30',
    gender: 'Female',
  },
]

const ClientForm = () => {
  const [clients, setClients] = useState(sampleClients)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(initialFormData)
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
    setFormData(initialFormData)
    setFileSelected(false)
    setSubmitted(false)
  }

  const openModal = () => {
    handleReset()
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.fullName || !formData.phone || !formData.email || !formData.instagram || !formData.dob) {
      alert('Please fill in all required fields')
      return
    }

    if (!formData.consent) {
      alert('Please accept the consent form')
      return
    }

    const newClient = {
      id: Date.now(),
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      instagram: formData.instagram,
      dob: formData.dob,
      gender: formData.gender || 'Not specified',
    }

    setClients(prev => [newClient, ...prev])
    setShowModal(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2800)
  }

  return (
    <div className="client-form-container">
      <div className="table-page-header">
        <div>
          <h1>Client Management</h1>
          <p>Review the client directory here. Click “Add New Client” to open the registration form.</p>
        </div>
        <button className="add-client-btn" type="button" onClick={openModal}>
          Add New Client
        </button>
      </div>

      {submitted && <div className="success-message">✓ Client added successfully!</div>}

      <div className="client-table-wrapper">
        <table className="client-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Instagram</th>
              <th>DOB</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.fullName}</td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
                <td>{client.instagram}</td>
                <td>{client.dob}</td>
                <td>{client.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="form-header">
              <h1>New Client Registration</h1>
              <p>Please fill in your information to register a new client.</p>
            </div>

            {submitted && <div className="success-message">✓ Form submitted successfully!</div>}

            <form onSubmit={handleSubmit}>
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
                      placeholder="Please list any allergies or skin conditions..."
                      value={formData.allergies}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>

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

              <div className="form-actions">
                <button type="button" className="reset-btn" onClick={handleReset}>
                  Clear Form
                </button>
                <button type="submit" className="submit-btn">
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientForm