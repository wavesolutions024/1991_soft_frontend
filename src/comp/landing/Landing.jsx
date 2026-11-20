import { useEffect, useState } from "react";
import "./Landing.scss";
import Loader from "../../comp/Loader/Loader";
import MainPanel from "../Main_panel/MainPanel";
import { api } from "../../Api";
import { toast } from "react-toastify";
// import { MdModeEditOutline } from "react-icons/md";
const Landing = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [statustoggle, setStatusToggle] = useState();
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: "",
    totalPages: "",
  });

  const getAllEnquiry = async () => {
    try {
      setLoader(true);
      const response = await api.get(
        `/api/enquiry/getAllLandingPageEnquiry?page=${pagination.page}&size=${pagination.size}`,
      );
      console.log(response);

      const data = response?.data?.data;
      const totalData = response?.data?.pagination?.total;
      setData(data);
      setPagination((prev) => ({
        ...prev,
        total: totalData,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchEnquiry = async () => {
      if (pagination.page || pagination.size) {
        await getAllEnquiry();
      }
    };
    fetchEnquiry();
  }, [pagination.page || pagination.size]);


    const handleStatus = async (id, status) => {
      try {
        const response = await api.patch(
          `api/enquiry/updateStatus?id=${id}&status=${status}`,
        );
        if (response.status === 200) {
          toast.success("Status Changed");
          await getAllEnquiry();
          setStatusToggle();
        }
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      {loader && <Loader />}
      <MainPanel>
        <div className="table-page-header">
          <div>
            <h1>Landing Page Data</h1>
          </div>
        </div>

        <div className="artist_table">
          <div className="client-table-wrapper">
            <table className="client-table">
              <thead>
                <tr>
                  <th>Name</th>
                  {/* <th>Email</th>/ */}
                  <th>Mobile Number</th>
                  {/* <th>Gender</th> */}
                  <th>Service</th>
                  {/* <th>Tattoo Style</th> */}
                  {/* <th>Tattoo Description</th> */}
                  {/* <th>Platform</th> */}
                  {/* <th>Budget</th> */}
                  <th>Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      {/* <td>{item.email}</td> */}
                      <td>{item.mobileNo}</td>
                      {/* <td>{item.gender}</td> */}
                      <td>{item.serviceType}</td>
                      {/* <td>{item.tattooStyle}</td> */}
                      {/* <td>{item.tattooDescription}</td> */}
                      {/* <td>{item.enquiryType ? item.enquiryType : "none"}</td> */}
                      {/* <td>{item.budget}</td> */}
                      <td style={{ textTransform: "capitalize" }}>
                        {statustoggle === item?.id ? (
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatus(item.id, e.target.value)
                            }
                            name=""
                            id=""
                          >

                            <option value="">Select All</option>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                               <option value="booked">Booked</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <p onClick={() => setStatusToggle(item.id)}>
                            {item.status}
                          </p>
                        )}
                      </td>
                      {/* <td style={{ width: "200px" }}>
                        <span
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        >
                          <MdModeEditOutline />
                        </span>
                      </td> */}
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
      </MainPanel>
    </>
  );
};

export default Landing;
