import React, { useState } from 'react'
import './Artists.scss'

const sampleArtists = [
  { id: 1, name: 'Alex Rivera', speciality: 'Blackwork, Fine line', status: 'Full time' },
  { id: 2, name: 'Maya Chen', speciality: 'Neo-traditional, Color', status: 'Part time' },
  { id: 3, name: 'Carlos Santos', speciality: 'Realism, Portrait', status: 'Full time' },
  { id: 4, name: 'Luna Garcia', speciality: 'Script, Minimal', status: 'Off duty' },
]

const initialArtist = {
  name: '',
  speciality: '',
  status: 'Full time',
}

const Artists = () => {
  const [artists, setArtists] = useState(sampleArtists)
  const [artistData, setArtistData] = useState(initialArtist)
  const [showModal, setShowModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setArtistData(prev => ({ ...prev, [name]: value }))
  }

  const openModal = () => {
    setArtistData(initialArtist)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!artistData.name || !artistData.speciality) {
      alert('Please enter artist name and specialty')
      return
    }
    setArtists(prev => [{
      id: Date.now(),
      ...artistData,
    }, ...prev])
    setShowModal(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2800)
  }

  return (
    <div className="artists-container">
      <div className="table-page-header">
        <div>
          <h1>Artists</h1>
          <p>Browse the artist roster in a table and add new artists with the same UI.</p>
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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {artists.map(artist => (
              <tr key={artist.id}>
                <td>{artist.name}</td>
                <td>{artist.speciality}</td>
                <td>{artist.status}</td>
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
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Name
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
                      name="speciality"
                      placeholder="Blackwork, Fine line"
                      value={artistData.speciality}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={artistData.status} onChange={handleChange}>
                      <option value="Full time">Full time</option>
                      <option value="Part time">Part time</option>
                      <option value="Off duty">Off duty</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="secondary" onClick={() => setArtistData(initialArtist)}>
                  Clear
                </button>
                <button type="submit">Save Artist</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Artists
