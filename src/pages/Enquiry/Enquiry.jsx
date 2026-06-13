import { useContext, useEffect, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./Enquiry.scss";
import { MdModeEditOutline } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { api } from "../../Api";
import { validateEnquiry } from "../../validate/Enquiry";
import Loader from "../../comp/Loader/Loader";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../Context";
const Enquiry = () => {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const { userData } = useContext(UserContext);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: "",
    totalPages: "",
  });

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const payload = {
    name: "",
    email: "",
    mobileNo: "",
    gender: "",
    tattooStyle: "",
    tattooDescription: "",
    budget: "",
  };

  const [values, setValues] = useState(payload);
  const [errors, setErrors] = useState(payload);

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

  const closeModal = () => {
    setModal(false);
    navigate("/enquiry");
  };

  //   get all enquiry
  const getAllEnquiry = async () => {
    try {
      const response = await api.get(
        `/api/enquiry/getAllEnquiry?page=${pagination.page}&size=${pagination.size}`,
      );
      const data = response?.data?.data;
      const totalData = response?.data?.pagination?.total;
      setData(data);
      setPagination((prev) => ({
        ...prev,
        total: totalData,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const editEnquiry = (id) => {
    navigate(`/enquiry?id=${id}`);
    setModal(true);
  };

  useEffect(() => {
    const fetchEnquiry = async () => {
      if (pagination.page || pagination.size) {
        await getAllEnquiry();
      }
    };
    fetchEnquiry();
  }, [pagination.page || pagination.size]);

  // Add Enquiry
  const handleEnquiry = async (e) => {
    try {
      e.preventDefault();
      const validateErrors = validateEnquiry(values);
      setErrors(validateErrors);

      if (Object.keys(validateErrors).length > 0) {
        return;
      }
      setLoader(true);

      let response;

      if (id) {
        response = await api.put(
          `/api/enquiry/updateEnquiry?id=${id}&username=${userData?.username}`,
          values,
        );
      } else {
        response = await api.post(
          `/api/enquiry/add?username=${userData?.username}`,
          values,
        );
      }

      if (response?.status === 200) {
        toast.success("Enquiry Added Successfully");
        setModal(false);
        getAllEnquiry();
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoader(false);
    }
  };
  // getEnquiry by id

  const getEnquiryById = async (id) => {
    try {
      const response = await api.get(`/api/enquiry/getEnquiryById?id=${id}`);
      const data = response?.data?.data;

      if (response?.status === 200) {
        setModal(true);
        setValues((prev) => ({
          ...prev,
          name: data?.name,
          email: data?.email,
          mobileNo: data?.mobileNo,
          gender: data?.gender,
          tattooStyle: data?.tattooStyle,
          tattooDescription: data?.tattooDescription,
          budget: data?.budget,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchEnquiryById = async () => {
      if (id) {
        await getEnquiryById(id);
      }
    };
    fetchEnquiryById();
  }, [id]);



  return (
    <>
      {loader && <Loader />}
      <MainPanel>
        <div class="table-page-header">
          <div>
            <h1>Enquiry Management</h1>
            <p>
              Review the client directory here. Click “Add New Enquiry to open
              the registration form.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="add-artiss-btn btn"
            type="button"
          >
            Add New Enquiry
          </button>
        </div>
        <div class="artist_table">
          <div className="client-table-wrapper">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Gender</th>
                  <th>Tattoo Style</th>

                  <th>Tattoo Description</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.mobileNo}</td>
                      <td>{item.gender}</td>
                      <td>{item.tattooStyle}</td>
                      <td>{item.tattooDescription}</td>
                      <td>{item.budget}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {item.status}
                      </td>

                      <td style={{ width: "200px" }}>
                        <span
                          style={{ cursor: "pointer", marginRight: "10px" }}
                          onClick={() => editEnquiry(item.id)}
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
              <form action="" onSubmit={handleEnquiry}>
                <div className="form-group">
                  <label>
                    Client Name
                    <span className="required">*</span>
                  </label>
                  <input
                    value={values.name}
                    name="name"
                    placeholder="Enter Client Name"
                    onChange={handleInputChange}
                  />
                  {errors?.name && (
                    <small className="field-error">{errors?.name}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={values.email}
                    name="email"
                    placeholder="Enter Client Email"
                    onChange={handleInputChange}
                  />
               
                </div>
                <div className="form-group">
                  <label>
                    Mobile Number
                    <span className="required">*</span>
                  </label>
                  <input
                    onChange={handleInputChange}
                    value={values.mobileNo}
                    type="text"
                    name="mobileNo"
                    placeholder="Enter Mobile Number"
                  />
                  {errors?.mobileNo && (
                    <small className="field-error">{errors?.mobileNo}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={values.gender}
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

                  {errors?.gender && (
                    <small className="field-error">{errors?.gender}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Tattoo Style
                    <span className="required">*</span>
                  </label>
                  <input
                    onChange={handleInputChange}
                    value={values.tattooStyle}
                    type="text"
                    name="tattooStyle"
                    placeholder="Enter Tattoo Style"
                  />
                  {errors?.tattooStyle && (
                    <small className="field-error">{errors?.tattooStyle}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>Tattoo Description</label>
                  <input
                    onChange={handleInputChange}
                    value={values.tattooDescription}
                    type="text"
                    name="tattooDescription"
                    placeholder="Enter Tattoo Description"
                  />
                </div>
                <div className="form-group">
                  <label>Tattoo Budget</label>
                  <input
                    onChange={handleInputChange}
                    value={values.budget}
                    type="number"
                    name="budget"
                    placeholder="Enter Tattoo Budget"
                  />
                </div>

                <button className="btn" type="submit">
                  {" "}
                  Add Enquiry
                </button>
              </form>
            </div>
          </div>
        )}
      </MainPanel>
    </>
  );
};

export default Enquiry;
