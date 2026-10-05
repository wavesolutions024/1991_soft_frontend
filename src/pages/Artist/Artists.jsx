import { useEffect, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./Artists.scss";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { api } from "../../Api";
import { RxCross2 } from "react-icons/rx";

import Loader from "../../comp/Loader/Loader";
import { validateArtists } from "../../validate/Artists";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PiSelectionThin } from "react-icons/pi";
const Artists = () => {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState();
  const payload = {
    artistName: "",
    artistNumber: "",
    username: "",
    password: "",
    salary: "",
    role: "",
  };
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState(payload);
  const [errors, setErrors] = useState(payload);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const getAllArtists = async () => {
    try {
      setLoader(true);
      const response = await api.get("api/artists/getAllArtists");
      if (response?.status === 200) {
        setData(response?.data?.data);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoader(false);
    }
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const validateErrors = validateArtists(values, id);
      setErrors(validateErrors);

      if (Object.keys(validateErrors).length > 0) {
        return;
      }
      let response;

      if (id) {
        response = await api.put(`api/artists/editArtist?id=${id}`, values);
      } else {
        response = await api.post("api/artists/add", values);
      }

      if (response.status === 200) {
        getAllArtists();
        setModal(false);
        setValues(payload);
        id
          ? toast.success("Artist Updated Successfully")
          : toast.success("Artist Added Successfully");
        navigate("/artists");
      }
    } catch (error) {
      console.log(error.response);
      const errorRes = error.response.data;
      if (errorRes?.message === "Username already registed") {
        setErrors((prev) => ({
          ...prev,
          username: errorRes?.message,
        }));
      }
    }
  };

  // delete artists
  const deleteArtist = async (id) => {
    try {
      const confirm = window.confirm("Are You Sure delete artist");

      if (!confirm) return;

      if (!id) {
        toast.error("id is required");

        return;
      }

      const response = await api.delete(`/api/artists/deleteArtist?id=${id}`);

      if (response.status === 200) {
        getAllArtists();
        toast.success("Artist Delete Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getArtistbyId = async (id) => {
    try {
      const response = await api.get(`/api/artists/getArtistById?id=${id}`);

      const data = response?.data?.data;

      setValues((prev) => ({
        ...prev,
        artistName: data.artistName,
        artistNumber: data?.artistNumber,
        username: data?.username,
        salary: data?.salary,
        role: data?.role,
      }));

      navigate(`/artists?id=${id}`);
      setModal(true);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    const fetchArtits = async () => {
      await getAllArtists();
    };
    fetchArtits();
  }, []);

  useEffect(() => {
    const fetchArtits = async () => {
      if (id) {
        await getArtistbyId(id);
      }
    };
    fetchArtits();
  }, [id]);

  const handleClosePop = () => {
    setModal(false);
    navigate("/artists");
  };

  console.log(errors,"erros")

  return (
    <>
      {loader && <Loader />}
      <MainPanel>
        <div class="table-page-header">
          <div>
            <h1>Artists Management</h1>
            <p>
              Review the client directory here. Click “Add New Artists to open
              the registration form.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="add-artiss-btn btn"
            type="button"
          >
            Add New Artists
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
                  <th>Salary</th>
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
                      <td>{client.salary}</td>

                      <td
                        style={{
                          width: "200px",
                        }}
                      >
                        <span
                          style={{ cursor: "pointer", marginRight: "10px" }}
                          onClick={() => getArtistbyId(client.id)}
                        >
                          <MdModeEditOutline />
                        </span>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteArtist(client.id)}
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
        </div>

        {modal && (
          <div class="artist_form">
            <div class="overlay"></div>
            <div class="artist_form_content">
              <div class="top_side">
                <h1> {id ? "Edit Artist" : "Add Artists"} </h1>
                <div class="cross" onClick={handleClosePop}>
                  <RxCross2 />
                </div>
              </div>
              <form action="" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    Name
                    <span className="required">*</span>
                  </label>
                  <input
                    value={values.artistName}
                    type="text"
                    name="artistName"
                    placeholder="Enter Artist Name"
                    onChange={handleInputChange}
                  />
                  {errors.artistName && (
                    <small className="field-error">{errors.artistName}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Contact Number
                    <span className="required">*</span>
                  </label>
                  <input
                    value={values.artistNumber}
                    type="number"
                    name="artistNumber"
                    placeholder="Enter Artist Contact Number"
                    onChange={handleInputChange}
                  />
                  {errors.artistNumber && (
                    <small className="field-error">{errors.artistNumber}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Login Username
                    <span className="required">*</span>
                  </label>
                  <input
                    value={values.username}
                    type="text"
                    name="username"
                    placeholder="Enter Login Username"
                    onChange={handleInputChange}
                  />
                  {errors.username && (
                    <small className="field-error">{errors.username}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Login Password
                    <span className="required">*</span>
                  </label>
                  <input
                    value={values.password}
                    type="text"
                    name="password"
                    placeholder="Enter Login Password"
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <small className="field-error">{errors.password}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Role
                    <span className="required">*</span>
                  </label>
                  <select
                   name="role"
                   value={values.role}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Role</option>
                    <option value="Artist">Artist</option>
                    <option value="Sales">Sales</option>
                  </select>

                  {errors.role && (
                    <small className="field-error">{errors.role}</small>
                  )}
                </div>
                <div className="form-group">
                  <label>
                    Salary
                    <span className="required">*</span>
                  </label>
                  <input
                    value={values.salary}
                    type="number"
                    name="salary"
                    placeholder="Enter Artist Salary"
                    onChange={handleInputChange}
                  />
                  {errors.salary && (
                    <small className="field-error">{errors.salary}</small>
                  )}
                </div>
                <button className="btn" type="submit">
                  {id ? "Edit Artist" : "Add Artist"}
                </button>
              </form>
            </div>
          </div>
        )}
      </MainPanel>
    </>
  );
};

export default Artists;
