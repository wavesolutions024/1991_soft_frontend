import { useContext, useEffect, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./Appoinments.scss";
import { api } from "../../Api";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { UserContext } from "../../Context";
import Loader from "../../comp/Loader/Loader";
const initialPayload = {
  name: "",
  date: "",
  time: "",
  contactNumber: "",
  advanceAmount: 0,
  visitPlatform: "",
};

const Appoinments = () => {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [values, setValues] = useState(initialPayload);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const idFromQuery = searchParams.get("id");
  const [loader, setLoader] = useState(false);
  const getAllAppointments = async () => {
    try {
      setLoader(true);
      const res = await api.get(
        `api/appointments/getAll?page=${pagination.page}&size=${pagination.size}`,
      );
      if (res.status === 200) {
        const respData = res?.data?.data;
        if (Array.isArray(respData)) setData(respData);
        else if (respData) setData([respData]);

        setPagination((prev) => ({
          ...prev,
          total: res?.data?.pagination?.total || prev.total,
          totalPages: res?.data?.pagination?.totalPages || prev.totalPages,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  const getAppointmentById = async (id) => {
    try {
      const res = await api.get(`api/appointments/detail?id=${id}`);
      if (res.status === 200) {
        const d = res?.data?.data;
        if (d) {
          setValues({
            name: d.name || "",
            date: d.date ? d.date.split("T")[0] : "",
            time: d.time || "",
            contactNumber: d.contactNumber || "",
            advanceAmount: d.advanceAmount || 0,
            visitPlatform: d.visitPlatform || "",
          });
          setEditingId(d.id || id);
          setModal(true);
          navigate(`/appoinments?id=${d.id || id}`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name])
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    const err = {};
    if (!values.name.trim()) err.name = "Name required";
    if (!values.date) err.date = "Date required";
    if (!values.time) err.time = "Time required";
    if (Object.keys(err).length) return setErrors(err);

    try {
      setLoader(true);
      let res;
      if (editingId) {
        res = await api.put(
          `api/appointments/edit?id=${editingId}&username=${userData?.username}`,
          values,
        );
      } else {
        res = await api.post(
          `api/appointments/add?username=${userData?.username}`,
          values,
        );
      }

      if (res.status === 200) {
        toast.success("Appointment saved successfully");
        setModal(false);
        setValues(initialPayload);
        setEditingId(null);
        navigate("/appoinments");
        getAllAppointments();
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      // console.error(err.response);
      // toast.error("Failed to save appointment");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, [pagination.page, pagination.size]);

  useEffect(() => {
    if (idFromQuery) getAppointmentById(idFromQuery);
  }, [idFromQuery]);

  // delete appoinment
  const deleteAppoinment = async (id) => {
    try {
      const confirm = window.confirm("Are you confirm delete appoinment");

      if (!confirm) return;

      setLoader(true);

      const response = await api.delete(
        `api/appointments/delete?id=${id}&username=${userData?.username}`,
      );

      if (response?.status === 200) {
        toast.success("Appoinment delete successfully");
        getAllAppointments()
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <MainPanel>
        <div className="table-page-header">
          <div>
            <h1>Appointments</h1>
            <p>
              Manage appointments. Click “Add New Appointment” to open the form.
            </p>
          </div>
          <button
            onClick={() => {
              setModal(true);
              setEditingId(null);
              setValues(initialPayload);
            }}
            className="add-artiss-btn btn"
            type="button"
          >
            Add New Appointment
          </button>
        </div>

        <div className="artist_table">
          <div className="client-table-wrapper">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Contact</th>
                  <th>Advance</th>
                  <th>Platform</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.date ? item.date.split("T")[0] : item.date}</td>
                      <td>{item.time}</td>
                      <td>{item.contactNumber}</td>
                      <td>{item.advanceAmount}</td>
                      <td>{item.visitPlatform}</td>
                      <td>
                        <span
                          onClick={() => getAppointmentById(item.id)}
                          style={{ marginRight: 8, cursor: "pointer" }}
                        >
                          <MdModeEditOutline />
                        </span>
                        <span
                          onClick={() => deleteAppoinment(item.id)}
                          style={{ marginRight: 8, cursor: "pointer" }}
                        >
                          <MdDelete />
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ padding: 16 }}>
                      Data not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {data.length > 0 && (
              <div className="custom-pagination">
                <span className="pagination-summary">
                  Total {pagination.total || data.length} items
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
                    { length: Math.max(1, pagination.totalPages || 1) },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      className={`pagination-btn ${p === pagination.page ? "active" : ""}`}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page: p }))
                      }
                      type="button"
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(
                          prev.page + 1,
                          pagination.totalPages || prev.page,
                        ),
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
          <div className="artist_form">
            <div className="overlay"></div>
            <div className="artist_form_content">
              <div className="top_side">
                <h1>{editingId ? "Edit Appointment" : "Add Appointment"}</h1>
                <div
                  className="cross"
                  onClick={() => {
                    setModal(false);
                    navigate("/appoinments");
                  }}
                >
                  &times;
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    Name <span className="required">*</span>
                  </label>
                  <input
                    placeholder="Enter Client Name"
                    name="name"
                    value={values.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <small className="field-error">{errors.name}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleInputChange}
                  />
                  {errors.date && (
                    <small className="field-error">{errors.date}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Time <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={values.time}
                    onChange={handleInputChange}
                  />
                  {errors.time && (
                    <small className="field-error">{errors.time}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    placeholder="Enter Contact Number"
                    name="contactNumber"
                    value={values.contactNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Advance Amount</label>
                  <input
                    type="number"
                    name="advanceAmount"
                    value={values.advanceAmount}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Visit Platform</label>
                  <select
                    name="visitPlatform"
                    value={values.visitPlatform}
                    onChange={handleInputChange}
                  >
                    <option value="" style={{ color: "black" }}>
                      Select Platform
                    </option>
                    <option value="Walk in" style={{ color: "black" }}>
                      Walk in
                    </option>
                    <option value="Instagram" style={{ color: "black" }}>
                      Instagram
                    </option>
                    <option value="Google" style={{ color: "black" }}>
                      Goggle
                    </option>
                  </select>
                </div>

                <button className="btn" type="submit">
                  {editingId ? "Save Changes" : "Add Appointment"}
                </button>
              </form>
            </div>
          </div>
        )}
      </MainPanel>
    </>
  );
};

export default Appoinments;
