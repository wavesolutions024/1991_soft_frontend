import { useEffect, useRef, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./Consent.scss";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { api } from "../../Api";
import { RxCross2 } from "react-icons/rx";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Consent = () => {
  const payload = {
    clientId: "",
    idProofType: "",
    idProofNumber: "",
  };
  const [modal, setModal] = useState(false);
  const [data, setData] = useState();
  const [values, setValues] = useState(payload);
  const [errors, setErrors] = useState(payload);
  const [client, setClient] = useState();
  const sigCanvas = useRef(null);
  const [idprooffile, setIdprooffile] = useState();
  const navigate = useNavigate();
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const closeModal = () => {
    setModal(false);

    navigate("/consent");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const getAllClient = async () => {
    try {
      const response = await api.get("api/client/getAllClients");
      setClient(response?.data?.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (sigCanvas.current.isEmpty()) {
        toast.error("Please sign first");
        return;
      }

      let validationError = false;

      if (!values.clientId?.trim()) {
        validationError = true;

        setErrors((prev) => ({
          ...prev,
          clientId: "Client Id is required",
        }));
      }

      if (!values.idProofType?.trim()) {
        validationError = true;

        setErrors((prev) => ({
          ...prev,
          idProofType: "Id Proof Type is required",
        }));
      }

      if (!values.idProofNumber?.trim()) {
        validationError = true;

        setErrors((prev) => ({
          ...prev,
          idProofNumber: "Id Proof Number is required",
        }));
      }

      if (validationError) return;

      const canvas = sigCanvas.current.getCanvas();

      const dataUrl = canvas.toDataURL("image/jpeg");

      console.log("helloo");
      // Convert Base64 to File
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const file = new File([blob], `${values.clientId}.jpeg`, {
        type: "image/jpeg",
      });

      const formData = new FormData();

      formData.append("signature", file);
      formData.append("idproof", idprooffile);
      formData.append("consent", JSON.stringify(values));

      const response = await api.post("api/consent/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Consent Added Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllConsent

  useEffect(() => {
    const fetchClients = async () => {
      await getAllClient();
    };
    fetchClients();
  }, []);

  return (
    <>
      <MainPanel>
        <div class="table-page-header">
          <div>
            <h1>Consent Management</h1>
            <p>
              Review the client directory here. Click “Add New Consent to open
              the registration form.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="add-artiss-btn btn"
            type="button"
          >
            Add New Consent
          </button>
        </div>

        <div class="artist_table">
          <div className="client-table-wrapper">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data ? (
                  data.map((client) => (
                    <tr key={client.id}>
                      <td>{client.artistName}</td>
                      <td>{client.artistNumber}</td>
                      <td>{client.username}</td>
                      <td>{client.role}</td>

                      <td
                        style={{
                          width: "200px",
                        }}
                      >
                        <span
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        >
                          <MdModeEditOutline />
                        </span>
                        <span style={{ cursor: "pointer" }}>
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
        </div>

        {modal && (
          <div class="artist_form">
            <div class="overlay"></div>
            <div class="artist_form_content">
              <div class="top_side">
                <h1>Add Consent</h1>
                <div class="cross" onClick={closeModal}>
                  <RxCross2 />
                </div>
              </div>
              <form action="" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    Client Name
                    <span className="required">*</span>
                  </label>
                  <select
                    onChange={handleInputChange}
                    value={values.clientId}
                    type="text"
                    name="clientId"
                    placeholder="John Doe"
                  >
                    <option style={{ color: "black" }} value="">
                      Select Client
                    </option>
                    {client &&
                      client?.map((item, index) => (
                        <option
                          style={{ color: "black" }}
                          key={index}
                          value={item.id}
                        >
                          {" "}
                          {item.name}{" "}
                        </option>
                      ))}
                  </select>
                  {errors?.clientId && (
                    <small className="field-error">{errors?.clientId}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    id Proof Type
                    <span className="required">*</span>
                  </label>
                  <select
                    onChange={handleInputChange}
                    value={values.idProofType}
                    type="text"
                    name="idProofType"
                    placeholder="John Doe"
                  >
                    <option style={{ color: "black" }} value="">
                      Select Type
                    </option>
                    <option style={{ color: "black" }} value="Aadhar Card">
                      Aadhar Card
                    </option>
                    <option style={{ color: "black" }} value="Pan Card">
                      Pan Card
                    </option>
                    <option style={{ color: "black" }} value="Passport">
                      Passport
                    </option>
                  </select>
                  {errors?.idProofType && (
                    <small className="field-error">{errors?.idProofType}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Id Proof Number
                    <span className="required">*</span>
                  </label>
                  <input
                    onChange={handleInputChange}
                    value={values.idProofNumber}
                    type="text"
                    name="idProofNumber"
                    placeholder="John Doe"
                  />
                  {errors?.idProofNumber && (
                    <small className="field-error">
                      {errors?.idProofNumber}
                    </small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Id Proof File
                    <span className="required">*</span>
                  </label>
                  <input
                    onChange={(e) => setIdprooffile(e.target.files[0])}
                    type="file"
                    name="password"
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Signature
                    <span className="required">*</span>
                  </label>
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                      width: 500,
                      height: 200,
                      className: "signatureCanvas",
                    }}
                  />

                  <div
                    onClick={clearSignature}
                    style={{ width: "auto" }}
                    className="btn"
                  >
                    Clear Signature
                  </div>
                </div>
                <button className="btn" type="submit">
                  {" "}
                  Add Consent
                </button>
              </form>
            </div>
          </div>
        )}
      </MainPanel>
    </>
  );
};

export default Consent;
