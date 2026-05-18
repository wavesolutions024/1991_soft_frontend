import { useEffect, useState } from "react";
import "./ClientForm.scss";
import { api } from "../../Api";
import { validateClient } from "../../validate/Client";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";

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

const ClientForm = () => {
  const [tattooImage, setTattooImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState({});
  const popup = localStorage.getItem("modal");
  const [clients, setClients] = useState();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const navigate = useNavigate();
  const [searchparams] = useSearchParams();
  const clientid = searchparams.get("id");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error[name]) {
      setError((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
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
    navigate("/cleints");
  };

  useEffect(() => {
    if (popup || clientid) {
      setShowModal(true);
    }
  }, [popup]);

  // get all clients

  const getAllClient = async () => {
    try {
      setLoader(true);
      const response = await api.get("api/client/getAllClients");
      setClients(response?.data?.data);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateClient(formData);
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoader(true);
      const formdata = new FormData();
      formdata.append("clients", JSON.stringify(formData));
      formdata.append("tattooImage", tattooImage);

      let response;
      if (clientid) {
        response = await api.put(
          `api/client/editClient?clientId=${clientid}`,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        response = await api.post("api/client/add", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200) {
        setShowModal(false);
        setSubmitted(true);
        handleReset();
        if (clientid) {
          toast.success("Client Updated successfully");
        } else {
          toast.success("Client added successfully");
        }

        getAllClient();
        navigate("/cleints");
      }
    } catch (error) {
      console.log(error.response);
      const errorDe = error.response;
      if (
        errorDe?.data?.message ===
        "Duplicate entry 'ketandudka566123@gmail.com' for key 'clients.email'"
      ) {
        setError({
          email: errorDe?.data?.message,
        });
      }

      if (errorDe) {
        toast.error(errorDe?.data?.message);
      }
    } finally {
      setLoader(false);
    }
  };

  const editClient = (id) => {
    navigate(`/cleints?id=${id}`);
  };

  const getClientById = async (id) => {
    try {
      const response = await api.get(`api/client/getClientById?id=${id}`);
      const data = response?.data?.data;
      setFormData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        mobileno: data.mobileno,
        gender: data.gender,
        address: data.address,
        dob: data.dob,
        tattoodetails: data.tattoodetails,
        inch: data.inch,
        price: data.price,
      }));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllClient();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (clientid) {
      getClientById(clientid);
    }
  }, [searchparams]);

  // delete client

  const deleteClient = async (id) => {
    try {
      if (!id) {
        toast.error("Id is required");
        return;
      }

      const confirm = window.confirm("Are you sure want to delete this client");

      if (!confirm) return;

      const response = await api.delete(`api/client/deleteClient?id=${id}`);

      if (response.status === 200) {
        toast.success("Deleted Successfully");
        getAllClient();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div className="client-form-container">
        <div className="table-page-header">
          <div>
            <h1>Client Management</h1>
            <p>
              Review the client directory here. Click “Add New Client” to open
              the registration form.
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
                <th>Tattoo Details</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Tattoo Inch</th>
                <th>Tattoo Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients ? (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.mobileno}</td>
                    <td>{client.email}</td>
                    <td>{client.tattoodetails}</td>
                    <td>{client.dob}</td>
                    <td>{client.gender}</td>
                    <td>{client.inch}</td>
                    <td>{client.price}</td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => editClient(client.id)}
                      >
                        <MdModeEditOutline />
                      </span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteClient(client.id)}
                      >
                        <MdDelete />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <p style={{ padding: "10px" }}>Data not found</p>
              )}
            </tbody>
          </table>
        </div>

        {(showModal || clientid) && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

              <div className="form-header">
                <h1>New Client Registration</h1>
                <p>Please fill in your information to register a new client.</p>
              </div>

              {Object.keys(error).length > 0 && (
                <div className="error-message">
                  Please fix the highlighted fields before submitting.
                </div>
              )}

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
                      />
                      {error.name && (
                        <small className="field-error">{error.name}</small>
                      )}
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
                      />
                      {error.mobileno && (
                        <small className="field-error">{error.mobileno}</small>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Email
                       
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {error.email && (
                        <small className="field-error">{error.email}</small>
                      )}
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
                      />
                      {error.dob && (
                        <small className="field-error">{error.dob}</small>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        Gender
                        <span className="required">*</span>
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
                      {error.gender && (
                        <small className="field-error">{error.gender}</small>
                      )}
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
                      <label>
                        Tattoo Details
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="tattoodetails"
                        placeholder="123 Main Street, City, State, ZIP"
                        value={formData.tattoodetails}
                        onChange={handleInputChange}
                      />
                      {error.tattoodetails && (
                        <small className="field-error">
                          {error.tattoodetails}
                        </small>
                      )}
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
                        value={formData.inch}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tattoo Price</label>
                      <input
                        type="text"
                        name="price"
                        placeholder="Tattoo Price"
                        value={formData.price}
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
    </>
  );
};

export default ClientForm;
