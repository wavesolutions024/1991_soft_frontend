import { useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel";
import "./AddExpense.scss";
import { MdOutlineFileUpload } from "react-icons/md";
import { api } from "../../Api";
import { toast } from "react-toastify";
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

  const [payload, setPayload] = useState({
    expenseType: "",
    amount: "",
    description: "",
    paymentMethod: "",
  });
  const [reciept, setReceipt] = useState();

  const handleSubmit = async (e) => {
    try {
        e.preventDefault()
      const formdata = new FormData();
      formdata.append("payload", JSON.stringify(payload));
      formdata.append("receipt", reciept);

      const response = await api.post(`api/expense/addExpense`,formdata);

      if(response?.status === 200){
        toast.success("Expense Addedd Successfully");
        setPayload({
            expenseType: "",
    amount: "",
    description: "",
    paymentMethod: "",
        })
      }
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <>
      <MainPanel>
        <div class="add_exp">
          <h1 class="tagline">Add Expense</h1>

          <form class="form" onSubmit={handleSubmit}>
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

            <div class="reciept">
              <input
                type="file"
                onChange={(e) => setReceipt(e.target.files[0])}
              />
              <span>
                <MdOutlineFileUpload />
              </span>
              <p>Upload Recipet photo</p>
            </div>
            <button type="submit" className="btn">Add Expense </button>
          </form>
        </div>
      </MainPanel>
    </>
  );
};

export default AddExpense;
