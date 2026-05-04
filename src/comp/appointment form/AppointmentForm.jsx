import React, { useState } from 'react'
import './AppointmentForm.scss'

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    artistAssigned: '',
    appointmentDate: '',
    timeSlot: '',
    tattooType: '',
    bodyPlacement: '',
    sessionDuration: '',
    status: 'pending',
  })

  const [submitted, setSubmitted] = useState(false)

  // Sample data - in a real app, this would come from your backend
  const clients = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' },
  ]

  const artists = [
    'Alex Rivera',
    'Maya Chen',
    'Carlos Santos',
    'Luna Garcia',
    'Jake Thompson',
  ]

  const tattooTypes = [
    'Small (1-3 hours)',
    'Medium (3-6 hours)',
    'Large (6+ hours)',
    'Custom (Quote required)',
  ]

  const bodyPlacements = [
    'Arm (Upper)',
    'Arm (Lower)',
    'Forearm',
    'Bicep',
    'Shoulder',
    'Back (Upper)',
    'Back (Lower)',
    'Full Back',
    'Chest',
    'Ribs',
    'Leg (Upper)',
    'Leg (Lower)',
    'Thigh',
    'Calf',
    'Foot',
    'Hand',
    'Neck',
    'Other',
  ]

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#ffa502' },
    { value: 'confirmed', label: 'Confirmed', color: '#24b5ff' },
    { value: 'completed', label: 'Completed', color: '#02c076' },
    { value: 'cancelled', label: 'Cancelled', color: '#ff4757' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      status
    }))
  }

  const handleReset = () => {
    setFormData({
      clientName: '',
      artistAssigned: '',
      appointmentDate: '',
      timeSlot: '',
      tattooType: '',
      bodyPlacement: '',
      sessionDuration: '',
      status: 'pending',
    })
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.clientName || !formData.artistAssigned || !formData.appointmentDate ||
        !formData.timeSlot || !formData.tattooType || !formData.bodyPlacement || !formData.sessionDuration) {
      alert('Please fill in all required fields')
      return
    }

    console.log('Appointment submitted:', formData)
    setSubmitted(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      handleReset()
    }, 2000)
  }

  const getSelectedClient = () => {
    return clients.find(client => client.id.toString() === formData.clientName)
  }

  const formatTimeWithAMPM = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`
  }

  return (
    <div className="appointment-form-container">
      <div className="form-header">
        <h1>Schedule New Appointment</h1>
        <p>Book a tattoo session for an existing client</p>
      </div>

      {submitted && <div className="success-message">✓ Appointment scheduled successfully!</div>}

      <form onSubmit={handleSubmit}>

        {/* Appointment Details Section */}
        <div className="form-section">
          <h2 className="section-title">Appointment Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>
                Client Name
                <span className="linked">(Linked)</span>
                <span className="required">*</span>
              </label>
              <select
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {getSelectedClient() && (
                <small className="client-link">
                  📧 {getSelectedClient().email}
                </small>
              )}
            </div>
            <div className="form-group">
              <label>
                Artist Assigned
                <span className="required">*</span>
              </label>
              <select
                name="artistAssigned"
                value={formData.artistAssigned}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Artist</option>
                {artists.map(artist => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Appointment Date
                <span className="required">*</span>
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Time Slot
                <span className="required">*</span>
              </label>
              <div className="time-input-wrapper">
                <input
                  type="time"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  required
                />
                {formData.timeSlot && (
                  <span className="time-display">
                    {formatTimeWithAMPM(formData.timeSlot)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tattoo Details Section */}
        <div className="form-section">
          <h2 className="section-title">Tattoo Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>
                Tattoo Type
                <span className="required">*</span>
              </label>
              <select
                name="tattooType"
                value={formData.tattooType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                {tattooTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>
                Body Placement
                <span className="required">*</span>
              </label>
              <select
                name="bodyPlacement"
                value={formData.bodyPlacement}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Placement</option>
                {bodyPlacements.map(placement => (
                  <option key={placement} value={placement}>
                    {placement}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Session Duration (hours)
                <span className="required">*</span>
              </label>
              <input
                type="number"
                name="sessionDuration"
                placeholder="2"
                min="1"
                max="12"
                step="0.5"
                value={formData.sessionDuration}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="form-section">
          <h2 className="section-title">Appointment Status</h2>

          <div className="form-row full">
            <div className="form-group">
              <label>Status</label>
              <div className="status-options">
                {statusOptions.map(option => (
                  <div
                    key={option.value}
                    className={`status-option ${formData.status === option.value ? 'selected' : ''}`}
                    onClick={() => handleStatusChange(option.value)}
                  >
                    <input
                      type="radio"
                      id={`status-${option.value}`}
                      name="status"
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={() => handleStatusChange(option.value)}
                    />
                    <label htmlFor={`status-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="reset" className="reset-btn" onClick={handleReset}>
            Clear Form
          </button>
          <button type="submit" className="submit-btn">
            Schedule Appointment
          </button>
        </div>
      </form>
    </div>
  )
}

export default AppointmentForm