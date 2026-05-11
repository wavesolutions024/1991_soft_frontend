import { useState } from 'react'
import './AppointmentForm.scss'

const sampleAppointments = [
  {
    id: 1,
    clientName: 'John Doe',
    artistAssigned: 'Alex Rivera',
    appointmentDate: '2026-06-12',
    timeSlot: '14:30',
    tattooType: 'Medium (3-6 hours)',
    bodyPlacement: 'Forearm',
    sessionDuration: '4',
    status: 'pending',
  },
  {
    id: 2,
    clientName: 'Maya Chen',
    artistAssigned: 'Luna Garcia',
    appointmentDate: '2026-06-15',
    timeSlot: '11:00',
    tattooType: 'Small (1-3 hours)',
    bodyPlacement: 'Wrist',
    sessionDuration: '2',
    status: 'confirmed',
  },
]

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
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const initialFormData = {
  clientName: '',
  artistAssigned: '',
  appointmentDate: '',
  timeSlot: '',
  tattooType: '',
  bodyPlacement: '',
  sessionDuration: '',
  status: 'pending',
}

const AppointmentForm = () => {
  const [appointments, setAppointments] = useState(sampleAppointments)
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (status) => {
    setFormData(prev => ({ ...prev, status }))
  }

  const handleReset = () => {
    setFormData(initialFormData)
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
    if (!formData.clientName || !formData.artistAssigned || !formData.appointmentDate ||
        !formData.timeSlot || !formData.tattooType || !formData.bodyPlacement || !formData.sessionDuration) {
      alert('Please fill in all required fields')
      return
    }

    const nextAppointment = {
      ...formData,
      id: Date.now(),
    }

    setAppointments(prev => [nextAppointment, ...prev])
    setShowModal(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2800)
  }

  const getSelectedClient = () => clients.find(client => client.id.toString() === formData.clientName)

  const formatTimeWithAMPM = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`
  }

  const getStatusClass = (status) => `status-pill status-${status}`

  return (
    <div className="appointment-form-container">
      <div className="table-page-header">
        <div>
          <h1>Appointment Management</h1>
          <p>View scheduled appointments and add new sessions in the dashboard.</p>
        </div>
        <button type="button" className="add-client-btn" onClick={openModal}>
          Add New Appointment
        </button>
      </div>

      {submitted && <div className="success-message">✓ Appointment created successfully!</div>}

      <div className="appointment-table-wrapper">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Artist</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Placement</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.clientName}</td>
                <td>{appointment.artistAssigned}</td>
                <td>{appointment.appointmentDate}</td>
                <td>{formatTimeWithAMPM(appointment.timeSlot)}</td>
                <td>{appointment.tattooType}</td>
                <td>{appointment.bodyPlacement}</td>
                <td>{appointment.sessionDuration}h</td>
                <td>
                  <span className={getStatusClass(appointment.status)}>
                    {appointment.status}
                  </span>
                </td>
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
              <h1>New Appointment</h1>
              <p>Fill in the appointment details and save the session.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2 className="section-title">Appointment Details</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Client Name
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
                      <small className="client-link">📧 {getSelectedClient().email}</small>
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

              <div className="form-section">
                <h2 className="section-title">Appointment Status</h2>
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

              <div className="form-actions">
                <button type="button" className="reset-btn" onClick={handleReset}>
                  Reset
                </button>
                <button type="submit" className="submit-btn">
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentForm