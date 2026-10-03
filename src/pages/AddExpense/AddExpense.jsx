import { useContext, useEffect, useRef, useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./AddExpense.scss";
import { MdOutlineFileUpload } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { api } from "../../Api";
import { toast } from "react-toastify";
import "../../comp/client_form/ClientForm.scss";
import { FiChevronDown } from "react-icons/fi";
import { UserContext } from "../../Context";
import { MdOutlineCameraAlt } from "react-icons/md";
const AddExpense = () => {
  const expType = [
    "Rent",
    "Electricity",
    "Internet",
    "Tattoo Supplies",
    "Needles",
    "Ink",
    "Equipment",
    "Marketing",
    "Salary",
    "Commission",
    "Maintenance",
    "Travel",
    "Other",
  ];
  const [datePopup, setDatePopup] = useState(false);
  const [expenselist, setExpenseList] = useState();
  const [expensePop, setExpensePop] = useState(false);
  const fileInputRef = useRef(null);
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };
  const [payload, setPayload] = useState({
    expenseType: "",
    amount: "",
    description: "",
    paymentMethod: "",
  });

  const [params, setParams] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [reciept, setReceipt] = useState();

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, index) => 2000 + index,
  );

  const getExpenses = async () => {
    try {
      const response = await api.get(
        `api/expense/getAllExpense?month=${params.month}&year=${params.year}`,
      );
      setExpenseList(response?.data?.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchExpense = async () => {
      await getExpenses();
    };

    fetchExpense();
  }, [params]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formdata = new FormData();
      formdata.append("payload", JSON.stringify(payload));
      formdata.append("receipt", reciept);

      const response = await api.post(`api/expense/addExpense`, formdata);

      if (response?.status === 200) {
        toast.success("Expense Addedd Successfully");
        setPayload({
          expenseType: "",
          amount: "",
          description: "",
          paymentMethod: "",
        });
        setExpensePop(false);
        await getExpenses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this expense?",
      );
      if (!confirm) return;
      const response = await api.delete(`api/expense/deleteExpense?id=${id}`);

      if (response?.status === 200) {
        toast.success("Expense Deleted Successfully");
        await getExpenses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MainPanel>
        <div className="table-page-header">
          <div>
            <h1>Exepnse Management</h1>
            <p>
              Review the Expense directory here. Click “Add New Expense to open
              the registration form.
            </p>
          </div>
          <div class="btn_list">
            <button
              className="add-client-btn"
              type="button"
              onClick={() => setExpensePop(true)}
            >
              Add New Expense
            </button>

            {datePopup ? (
              <div class="select_input">
                <select
                  name=""
                  id=""
                  value={params.month}
                  onChange={(e) =>
                    setParams({ ...params, month: e.target.value })
                  }
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <select
                  name=""
                  id=""
                  value={params.year}
                  onChange={(e) =>
                    setParams({ ...params, year: e.target.value })
                  }
                >
                  <option value="">Select Year</option>

                  {years &&
                    years?.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <button
                className="finance-period"
                type="button"
                onClick={() => setDatePopup(true)}
              >
                <span style={{ display: "flex", gap: "10px" }}>
                  {" "}
                  <span>
                    {" "}
                    {params.month
                      ? new Date(2000, params.month - 1).toLocaleString(
                          "en-US",
                          {
                            month: "long",
                          },
                        )
                      : ""}{" "}
                  </span>
                  <span> {params.year}</span>
                </span>
                <FiChevronDown />
              </button>
            )}
          </div>
        </div>

        <div className="client-table-wrapper">
          <table className="client-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Expense Type</th>
                <th>Amount</th>

                <th>Description</th>
                <th>Payment Method</th>
                <th>Receipt Image</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenselist ? (
                expenselist.map((item) => (
                  <tr key={item.id}>
                    <td>{item?.created_at?.split(" ")[0]}</td>
                    <td style={{ position: "relative" }}>{item.expenseType}</td>
                    <td>{item?.amount}</td>
                    {/* <td>{client.email}</td> */}
                    <td>{item?.description}</td>
                    <td>{item?.paymentMethod}</td>
                    <td>
                      {item?.recietImage ? (
                        <img
                          style={{
                            width: "50px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                          src={item?.recietImage}
                          alt=""
                        />
                      ) : (
                        <p>No Image</p>
                      )}
                    </td>

                    {/* <td>
                              {" "}
                              {client.tattooImage ? (
                                <img
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                  src={client.tattooImage}
                                  alt=""
                                />
                              ) : (
                                <p>No Image </p>
                              )}{" "}
                            </td> */}
                    <td style={{}}>
                      <span style={{ cursor: "pointer", marginRight: "15px" }}>
                        <MdModeEditOutline />
                      </span>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteExpense(item.id)}
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
          {expenselist?.length > 0 && (
            <div className="custom-pagination">
              <span className="pagination-summary">
                Total {expenselist?.length} items
              </span>

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  // onClick={() =>
                  //   setPagination((prev) => ({
                  //     ...prev,
                  //     page: Math.max(prev.page - 1, 1),
                  //   }))
                  // }
                  // disabled={pagination.page === 1}
                  type="button"
                >
                  Previous
                </button>

                {/* {Array.from(
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
                        ))} */}

                {/* <button
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
                        </button> */}
              </div>
            </div>
          )}
        </div>

        {expensePop && (
          <div class="add_exp">
            <div class="overlay" onClick={() => setExpensePop(false)}></div>

            <form class="form" onSubmit={handleSubmit}>
              <h1>Add Expense</h1>
              <div class="row">
                <label for="">Expense Type</label>
                <select
                  name=""
                  id=""
                  value={payload.expenseType}
                  required
                  onChange={(e) =>
                    setPayload({ ...payload, expenseType: e.target.value })
                  }
                >
                  <option value=""> Select Expense Type </option>
                  {expType?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div class="row">
                <label for="">Amount</label>
                <input
                  value={payload.amount}
                  required
                  onChange={(e) =>
                    setPayload({ ...payload, amount: e.target.value })
                  }
                  placeholder="Enter Amount"
                  type="number"
                />
              </div>
              <div class="row">
                <label for="">Description</label>
                <textarea
                  placeholder="Enter Expense Description"
                  name=""
                  required
                  id=""
                  value={payload.description}
                  onChange={(e) =>
                    setPayload({ ...payload, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div class="row">
                <label for="">Payment Method</label>
                <select
                  name=""
                  id=""
                  value={payload.paymentMethod}
                  required
                  onChange={(e) =>
                    setPayload({ ...payload, paymentMethod: e.target.value })
                  }
                >
                  <option value=""> Select Payment Method</option>

                  <option value="Cash"> Cash </option>
                  <option value="Card"> Card </option>
                  <option value="UPI"> UPI </option>
                </select>
              </div>

              <div className="reciept_section">
                {/* Upload from gallery / file */}
                <div
                  className="reciept"
                  onClick={() =>
                    document.getElementById("receipt-upload").click()
                  }
                >
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setReceipt(file);
                      }
                    }}
                  />

                  <span>
                    <MdOutlineFileUpload />
                  </span>

                  <p>Upload Receipt Photo</p>
                </div>

                {/* Camera */}
                <div className="camera" onClick={handleCameraClick}>
                  <span>
                    <MdOutlineCameraAlt />
                  </span>

                  <p>Click to Capture Receipt</p>
                </div>

                {/* Hidden camera input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setReceipt(file);
                    }
                  }}
                />
              </div>
              <button type="submit" className="btn">
                Add Expense{" "}
              </button>
            </form>
          </div>
        )}
      </MainPanel>
    </>
  );
};

export default AddExpense;
