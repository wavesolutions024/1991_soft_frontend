import React, { useState } from 'react'
import './ArtistManagement.scss'

const sampleArtists = [
  { id: 1, name: 'Alex Rivera', specialty: 'Blackwork, Fine line', availability: 'Full time' },
  { id: 2, name: 'Maya Chen', specialty: 'Neo-traditional, Color', availability: 'Part time' },
  { id: 3, name: 'Carlos Santos', specialty: 'Realism, Portrait', availability: 'Full time' },
]

const initialArtistData = {
  name: '',
  specialty: '',
  yearsExperience: '',
  availability: 'full-time',
  bio: '',
}

const ArtistManagement = () => {
  const [artists, setArtists] = useState(sampleArtists)
  const [artistData, setArtistData] = useState(initialArtistData)
  const [submitted, setSubmitted] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setArtistData(prev => ({ ...prev, [name]: value }))
  }

  const openModal = () => {
    setArtistData(initialArtistData)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!artistData.name || !artistData.specialty || !artistData.yearsExperience) {
      alert('Please complete the required artist fields')
      return
    }
    setArtists(prev => [{
      id: Date.now(),
      name: artistData.name,
      specialty: artistData.specialty,
      availability: artistData.availability === 'full-time' ? 'Full time' : artistData.availability === 'part-time' ? 'Part time' : 'Off duty',
      yearsExperience: artistData.yearsExperience,
      bio: artistData.bio,
    }, ...prev])
    setShowModal(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2800)
  }

  const handleReset = () => {
    setArtistData(initialArtistData)
    setSubmitted(false)
  }

  return (
    <div className="artist-management-container">
      <div className="table-page-header">
        <div>
          <h1>Artist Management</h1>
          <p>Manage artist profiles and add new talent in the same polished dashboard.</p>
        </div>
        <button type="button" className="add-client-btn" onClick={openModal}>
          Add New Artist
        </button>
      </div>

      {submitted && <div className="success-message">✓ Artist added successfully!</div>}

      <div className="artist-table-wrapper">
        <table className="artist-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Experience</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {artists.map(artist => (
              <tr key={artist.id}>
                <td>{artist.name}</td>
                <td>{artist.specialty}</td>
                <td>{artist.yearsExperience} years</td>
                <td>{artist.availability}</td>
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
              <h1>New Artist</h1>
              <p>Enter the artist profile details to add them to the roster.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2 className="section-title">Artist Profile</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Artist Name
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Alex Rivera"
                      value={artistData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Specialty
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      placeholder="Blackwork, Portrait, Color"
                      value={artistData.specialty}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Years of Experience
                      <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      name="yearsExperience"
                      placeholder="5"
                      value={artistData.yearsExperience}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Availability</label>
                    <select
                      name="availability"
                      value={artistData.availability}
                      onChange={handleChange}
                    >
                      <option value="full-time">Full time</option>
                      <option value="part-time">Part time</option>
                      <option value="off">Off duty</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Notes</h2>
                <div className="form-group">
                  <label>Profile Notes</label>
                  <textarea
                    name="bio"
                    placeholder="Add artist background, awards, or signature styles..."
                    value={artistData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary" onClick={handleReset}>Reset</button>
                <button type="submit">Save Artist</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtistManagement
