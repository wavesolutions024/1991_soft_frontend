import React, { useState } from 'react'
import './ConsultantForm.scss'

const sampleConsultants = [
  { id: 1, fullName: 'Jamie Cole', email: 'jamie@example.com', phone: '+1 (555) 123-4567', areaOfExpertise: 'Workflow, Scheduling', meetingType: 'Virtual' },
  { id: 2, fullName: 'Taylor Reed', email: 'taylor@example.com', phone: '+1 (555) 987-6543', areaOfExpertise: 'Client relations', meetingType: 'In person' },
]

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  areaOfExpertise: '',
  meetingType: 'virtual',
  notes: '',
}

const ConsultantForm = () => {
  const [consultants, setConsultants] = useState(sampleConsultants)
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const openModal = () => {
    setFormData(initialFormData)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.phone || !formData.areaOfExpertise) {
      alert('Please fill in all required consultant fields')
      return
    }

    setConsultants(prev => [{
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      areaOfExpertise: formData.areaOfExpertise,
      meetingType: formData.meetingType === 'in-person' ? 'In person' : formData.meetingType === 'hybrid' ? 'Hybrid' : 'Virtual',
    }, ...prev])

    setShowModal(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2800)
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setSubmitted(false)
  }

  return (
    <div className="consultant-form-container">
      <div className="table-page-header">
        <div>
          <h1>Consultant Management</h1>
          <p>See consultants by default, then click to add new consultant details.</p>
        </div>
        <button type="button" className="add-client-btn" onClick={openModal}>
          Add New Consultant
        </button>
      </div>

      {submitted && <div className="success-message">✓ Consultant added successfully!</div>}

      <div className="consultant-table-wrapper">
        <table className="consultant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Expertise</th>
              <th>Meeting Type</th>
            </tr>
          </thead>
          <tbody>
            {consultants.map(consultant => (
              <tr key={consultant.id}>
                <td>{consultant.fullName}</td>
                <td>{consultant.email}</td>
                <td>{consultant.phone}</td>
                <td>{consultant.areaOfExpertise}</td>
                <td>{consultant.meetingType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="form-header">
              <h1>New Consultant</h1>
              <p>Fill in the consultant details to add a new team member.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2 className="section-title">Consultant Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Full Name
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Jamie Cole"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Email
                      <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="jamie@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Phone Number
                      <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Area of Expertise
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="areaOfExpertise"
                      placeholder="Client relations, scheduling, workflow"
                      value={formData.areaOfExpertise}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Meeting Preference</h2>
                <div className="form-row full">
                  <div className="form-group">
                    <label>Preferred Meeting Type</label>
                    <select
                      name="meetingType"
                      value={formData.meetingType}
                      onChange={handleChange}
                    >
                      <option value="virtual">Virtual</option>
                      <option value="in-person">In person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      placeholder="Add consultation details, goals, or follow-up items..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary" onClick={handleReset}>Clear</button>
                <button type="submit">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultantForm
