import React, { useState } from "react";
import "./Landing.scss";
import Loader from "../../comp/Loader/Loader";
import MainPanel from "../Main_panel/MainPanel";

const Landing = () => {
  const [data, setData] = useState([]);

  return (
    <>
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
      </MainPanel>
    </>
  );
};

export default Landing;
