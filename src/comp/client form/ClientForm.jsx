import { useEffect, useState } from "react";
import "./ClientForm.scss";
import { api } from "../../Api";

const initialFormData = {
  name: "",
  email: "",
  mobileno: "",
  gender: "",
  address: "",
  dob: "",
  tattoodetails: "",
  inch: "",
  price: "",
};

const sampleClients = [
  {
    id: 1,
    fullName: "John Doe",
    phone: "+1 (555) 000-0000",
    email: "john@example.com",
    instagram: "@johndoe",
    dob: "1990-02-18",
    gender: "Male",
  },
  {
    id: 2,
    fullName: "Maya Chen",
    phone: "+1 (555) 333-1234",
    email: "maya@example.com",
    instagram: "@mayart",
    dob: "1992-08-09",
    gender: "Female",
  },
  {
    id: 3,
    fullName: "Luna Garcia",
    phone: "+1 (555) 777-7777",
    email: "luna@example.com",
    instagram: "@luna_ink",
    dob: "1988-12-30",
    gender: "Female",
  },
];

const ClientForm = () => {
  const [tattooImage, setTattooImage] = useState(null);
  // const [clients, setClients] = useState(sampleClients)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTattooImage(file);
    setFileSelected(!!file);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFileSelected(false);
    setSubmitted(false);
  };

  const openModal = () => {
    handleReset();
    localStorage.setItem("modal", true);

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    localStorage.removeItem("modal");
  };

  const modal = localStorage.getItem("modal");

  useEffect(() => {
    if (modal) {
      setShowModal(true);
    }
  }, [modal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData();

      formdata.append("clients", JSON.stringify(formData));
      formdata.append("tattooImage", tattooImage);
      const response = await api.post("api/client/add", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tattooImage, "tattooImage");

  return (
    <div className="client-form-container">
      <div className="table-page-header">
        <div>
          <h1>Client Management</h1>
          <p>
            Review the client directory here. Click “Add New Client” to open the
            registration form.
          </p>
        </div>
        <button className="add-client-btn" type="button" onClick={openModal}>
          Add New Client
        </button>
      </div>

      {submitted && (
        <div className="success-message">✓ Client added successfully!</div>
      )}

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
            {sampleClients.map((client) => (
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

            {submitted && (
              <div className="success-message">
                ✓ Form submitted successfully!
              </div>
            )}

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
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
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
                      type="number"
                      name="mobileno"
                      placeholder="+1 (555) 000-0000"
                      value={formData.mobileno}
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
                      <option value="" style={{ color: "black" }}>
                        Select Gender
                      </option>
                      <option value="Male" style={{ color: "black" }}>
                        Male
                      </option>
                      <option value="Female" style={{ color: "black" }}>
                        Female
                      </option>
                      <option value="Other" style={{ color: "black" }}>
                        Other
                      </option>
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
                <h2 className="section-title">Tattoo Information</h2>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Tattoo Details</label>
                    <input
                      type="text"
                      name="Tattoo Details"
                      placeholder="123 Main Street, City, State, ZIP"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Tattoo Image</h2>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Upload Consent Form</label>
                    <div className="file-upload">
                      <label
                        htmlFor="consent-file"
                        className={fileSelected ? "file-selected" : ""}
                      >
                        {fileSelected
                          ? "✓ File Selected"
                          : "📎 Upload Tattoo Image"}
                      </label>
                      <input
                        type="file"
                        id="consent-file"
                        name="tattooImage"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      {fileSelected && tattooImage && (
                        <div className="file-name">{tattooImage.name}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">Additional Details</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tattoo Inch</label>
                    <input
                      type="text"
                      name="inch"
                      placeholder="Tattoo Inch"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tattoo Price</label>
                    <input
                      type="text"
                      name="price"
                      placeholder="Tattoo Price"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="reset-btn"
                  onClick={handleReset}
                >
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
  );
};

export default ClientForm;
