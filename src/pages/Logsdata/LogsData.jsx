import { useEffect, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./LogsData.scss";
import { api } from "../../Api";

const LogsData = () => {
  const [data, setData] = useState();

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: "",
    totalPages: "",
  });

  const getAllLogs = async () => {
    try {
      const response = await api.get(
        `api/franchies/getAllLogs?page=${pagination.page}&size=${pagination.size}`,
      );

      console.log(response)
      setPagination((prev) => ({
        ...prev,
        total: response?.data?.pagination?.total,
        totalPages: response?.data?.pagination?.totalPages,
      }));
      setData(response?.data?.data);
   
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getlogs = async () => {
      if (pagination.page || pagination.size) {
        getAllLogs();
      }
    };

    getlogs();
  }, [pagination.page , pagination.size]);

  return (
    <MainPanel>
      <div class="table-page-header">
        <div>
          <h1>Logs Management</h1>
          <p>Review the Logs directory here.</p>
        </div>
      </div>

      <div class="artist_table">
        <div className="client-table-wrapper">
          <table className="client-table">
            <thead>
              <tr>
                <th>user</th>
                <th>Action</th>
                <th>service</th>
                <th>tableNames</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.user}</td>
                    <td>{item.action}</td>
                    <td>{item.service}</td>
                    <td>{item.tableNames}</td>
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

          {data?.length > 0 && (
            <div className="custom-pagination">
              <span className="pagination-summary">
                Total {data?.length} items
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
                    onClick={() => setPagination((prev) => ({ ...prev, page }))}
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
    </MainPanel>
  );
};

export default LogsData;
