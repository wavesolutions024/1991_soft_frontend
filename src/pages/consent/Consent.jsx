import { useContext, useEffect, useRef, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./Consent.scss";
import { MdModeEditOutline } from "react-icons/md";

import { api } from "../../Api";
import { RxCross2 } from "react-icons/rx";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../Context";
import { MdCameraAlt } from "react-icons/md";

const Consent = () => {
  const payload = {
    username: "",
    clientId: "",
    idProofType: "",
    idProofNumber: "",
    medicalDesc: {
      diabetes: false,
      skinCondition: false,
      allergies: false,
      bloodThinningMedication: false,
      pregnancyBreastfeeding: false,
      otherMedicalCondition: false,
    },
  };
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState(payload);
  const [errors, setErrors] = useState(payload);
  const [client, setClient] = useState();
  const sigCanvas = useRef(null);
  const [idprooffile, setIdprooffile] = useState();
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: "",
    totalPages: "",
  });

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const closeModal = () => {
    setModal(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setShowCamera(false);
    }
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
  const getAllConsent = async () => {
    try {
      const response = await api.get(
        `api/consent/getAllConsent?page=${pagination.page}&size=${pagination.size}`,
      );
      if (response.status === 200) {
        setData(response?.data?.data || []);

        setPagination((prev) => ({
          ...prev,
          total: response?.data?.pagination?.total,
          totalPages: response?.data?.pagination?.totalPages,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (sigCanvas.current.isEmpty() && !id) {
        toast.error("Please sign first");
        return;
      }

      let validationError = false;

      if (!values.clientId) {
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

      // Convert Base64 to File
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const date = new Date();

      const file = new File([blob], `${values.clientId}_${date}.jpeg`, {
        type: "image/jpeg",
      });

      const formData = new FormData();

      formData.append("signature", file);
      formData.append("idproof", idprooffile);
      const filterValues = {
        ...values,
        medicalDesc: JSON.stringify(values.medicalDesc),
      };
      formData.append("consent", JSON.stringify(filterValues));

      let response;
      if (id) {
        response = await api.put(`api/consent/editConsent?id=${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("api/consent/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200) {
        id
          ? toast.success("Consent Edit Successfully")
          : toast.success("Consent Added Successfully");
        setModal(false);
        setValues({
          clientId: "",
          idProofType: "",
          idProofNumber: "",
        });
        navigate("/consent");
        getAllConsent();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getConsentById = async (id) => {
    try {
      const response = await api.get(`api/consent/getConsentById?id=${id}`);

      const data = response?.data?.data;
      setValues((prev) => ({
        ...prev,
        username: userData?.username,
        clientId: data.clientId,
        idProofType: data.idProofType,
        idProofNumber: data.idProofNumber,
      }));
      navigate(`/consent?id=${id}`);
      setModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      await getAllClient();
      await getAllConsent();
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchConsent = async () => {
      if (pagination.page || pagination.size) {
        await getAllConsent();
      }
    };

    fetchConsent();
  }, [pagination.page || pagination.size]);

  useEffect(() => {
    const getConsetId = () => {
      if (id) {
        getConsentById(id);
      }
    };

    getConsetId();
  }, []);

  const handleMedicalChange = (e) => {
    const { name, checked } = e.target;

    setValues((prev) => ({
      ...prev,
      medicalDesc: {
        ...prev.medicalDesc,
        [name]: checked,
      },
    }));
  };

  useEffect(() => {
    if (userData) {
      setValues((prev) => ({
        ...prev,
        username: userData?.username,
      }));
    }
  }, []);

  // camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use rear camera on mobile
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      alert("Unable to access camera: " + err.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob/file
    canvas.toBlob(
      (blob) => {
        const fileName = `id_proof_${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });

        setIdprooffile(file);

        // Generate preview URL
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        stopCamera();
      },
      "image/jpeg",
      0.9,
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdprooffile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setIdprooffile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

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
                  <th>Id Proof Type</th>
                  <th>Id Proof Number</th>
                  <th>Medical Desc</th>
                  <th>Id Proof Image</th>

                  <th>Signature</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.idProofType}</td>
                      <td>{item.idProofNumber}</td>
                      <td>
                        {" "}
                        {Object.entries(JSON.parse(item.medicalDesc))
                          .filter(([_, value]) => value)
                          .map(([key]) => key)
                          .join(", ")}
                      </td>
                      <td>
                        {item.idProofImage ? (
                          <img
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "contain",
                            }}
                            src={item.idProofImage}
                            alt=""
                          />
                        ) : (
                          <p>No Image</p>
                        )}
                      </td>
                      <td>
                        {item.signature ? (
                          <img
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "contain",
                            }}
                            src={item.signature}
                            alt=""
                          />
                        ) : (
                          <p>No Image</p>
                        )}
                      </td>

                      <td style={{ width: "200px" }}>
                        <span
                          onClick={() => getConsentById(item.id)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        >
                          <MdModeEditOutline />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ padding: "16px" }}>
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {data.length > 0 && (
              <div className="custom-pagination">
                <span className="pagination-summary">
                  Total {data.length} items
                </span>

                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(prev.page - 1, 1),
                      }))
                    }
                    disabled={pagination.page === 1}
                    type="button"
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, index) => index + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      className={`pagination-btn ${page === pagination.page ? "active" : ""}`}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page }))
                      }
                      type="button"
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(prev.page + 1, pagination.total),
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
                  <label>Id Proof File</label>

                  {!showCamera ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={startCamera}
                        className="btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <MdCameraAlt /> Capture Document
                      </button>
                      <label
                        className="btn"
                        style={{ cursor: "pointer", margin: 0 }}
                      >
                        Upload Document
                        <input
                          onChange={handleFileUpload}
                          type="file"
                          name="idprooffile"
                          accept="image/*,.pdf"
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div style={{ marginBottom: "15px" }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{
                          width: "100%",
                          maxWidth: "500px",
                          borderRadius: "4px",
                          marginBottom: "10px",
                          border: "2px solid #007bff",
                        }}
                      />
                      <canvas ref={canvasRef} style={{ display: "none" }} />
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="button"
                          onClick={captureImage}
                          className="btn"
                        >
                          📸 Take Picture
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="btn"
                          style={{ backgroundColor: "#dc3545" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ✅ Preview Section */}
                  {previewUrl && idprooffile && (
                    <div
                      style={{
                        marginTop: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                        maxWidth: "500px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "8px",
                        }}
                      >
                        <p
                          style={{ color: "green", margin: 0, fontWeight: 500 }}
                        >
                          ✓ {idprooffile.name}
                        </p>
                        <button
                          type="button"
                          onClick={removeFile}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc3545",
                            cursor: "pointer",
                            fontSize: "18px",
                            fontWeight: "bold",
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Image Preview */}
                      {idprooffile.type.startsWith("image/") && (
                        <img
                          src={previewUrl}
                          alt="ID Proof Preview"
                          style={{
                            width: "100%",
                            borderRadius: "4px",
                            objectFit: "contain",
                            maxHeight: "300px",
                          }}
                        />
                      )}

                      {/* PDF Preview */}
                      {idprooffile.type === "application/pdf" && (
                        <div style={{ textAlign: "center", padding: "20px" }}>
                          <span style={{ fontSize: "48px" }}>📄</span>
                          <p style={{ color: "#555" }}>PDF Document</p>
                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#007bff" }}
                          >
                            View PDF
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Signature
                    <span className="required">*</span>
                  </label>
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="red"
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
            <div class="notes">
              <h1>Notes</h1>
              <div className="medical_declaration">
                <h4>Do you have any of the following ?</h4>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="diabetes"
                    checked={values.medicalDesc.diabetes}
                    onChange={handleMedicalChange}
                  />
                  <label>Diabetes</label>
                </div>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="skinCondition"
                    checked={values.medicalDesc.skinCondition}
                    onChange={handleMedicalChange}
                  />
                  <label>Skin Condition</label>
                </div>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="allergies"
                    checked={values.medicalDesc.allergies}
                    onChange={handleMedicalChange}
                  />
                  <label>Allergies</label>
                </div>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="bloodThinningMedication"
                    checked={values.medicalDesc.bloodThinningMedication}
                    onChange={handleMedicalChange}
                  />
                  <label>Blood Thinning Medication</label>
                </div>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="pregnancyBreastfeeding"
                    checked={values.medicalDesc.pregnancyBreastfeeding}
                    onChange={handleMedicalChange}
                  />
                  <label>Pregnancy/Breastfeeding</label>
                </div>

                <div className="form-group">
                  <input
                    type="checkbox"
                    name="otherMedicalCondition"
                    checked={values.medicalDesc.otherMedicalCondition}
                    onChange={handleMedicalChange}
                  />
                  <label>Other Medical Condition</label>
                </div>
              </div>
              <div class="info">
                <h4>PLease Read All Of Things</h4>
                <ul>
                  <li>
                    I am at least 18 years old and voluntarily choosing to
                    receive a tattoo.
                  </li>
                  <li>
                    I have disclosed all relevant medical conditions and
                    medications.
                  </li>
                  <li>
                    I understand that tattooing involves risks including
                    infection, allergic reactions, swelling, discomfort, and
                    possible scarring.
                  </li>
                  <li>
                    I have approved the tattoo design, size, placement,
                    spelling, and artwork before the procedure.
                  </li>
                  <li>
                    I understand that tattoos are permanent and may require
                    laser or surgical procedures for removal.
                  </li>
                  <li>
                    I agree to follow all aftercare instructions provided by the
                    tattoo artist.
                  </li>
                  <li>
                    I understand that healed tattoo results may vary depending
                    on skin type, placement, and aftercare.
                  </li>
                  <li>
                    I release the tattoo artist and studio from liability
                    resulting from undisclosed medical conditions or failure to
                    follow aftercare instructions.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </MainPanel>
    </>
  );
};

export default Consent;
