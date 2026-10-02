import MainPanel from "../../comp/Main_panel/MainPanel";
import { FiChevronDown } from "react-icons/fi";
import "./FinDashboard.scss";
import { useContext, useEffect, useState } from "react";
import { api } from "../../Api";
import { truncateAmt } from "../../comp/truncateAmount/truncateAmount";
import { UserContext } from "../../Context";
import { Link } from "react-router-dom";






const FinDashboard = () => {
  const [countStats, setCountStats] = useState();
  const { setLoader } = useContext(UserContext);
const [monthlyStats , setmonthlyStats] = useState([]);
  const [datePopup, setDatePopup] = useState(false);
  const [artistData,setArtistData] = useState();
  const [paymentbreak,setPaymentBreak] = useState();
  const [recentData,setRecentData] = useState()


  const [payload, setPayload] = useState({
    date: new Date(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, index) => 2000 + index,
  );

  

  const getStats = async () => {
    try {
      const response = await api.get(
        `api/finDash/dashboardCtrlStats?month=${payload.month}&year=${payload.year}`,
      );

      const data = response?.data || [];

      console.log(data, "data");

      setCountStats([
        {
          label: "Revenue",
          value: data?.data?.totalRevenue || 0,
          accent: "blue",
        },
        {
          label: "Expenses",
          value: Number(data?.data?.totalExpenses) || 0,
          accent: "orange",
        },
        {
          label: "Net Profit",
          value: Number(data?.data?.netRevenue) || 0,
          accent: "green",
        },
      ]);

      setRecentData(data?.recentClients || [])

      setPaymentBreak(data?.paymentMethods || [])

      setArtistData(data?.revenueByArtist || [])

      setmonthlyStats(data?.monthlyStats || [])
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      await getStats();
    };

    fetchStats();
  }, [payload.month, payload.year]);



  return (
    <MainPanel>
      <div className="finance-dashboard">
        <header className="finance-header">
          <h1>Finance Dashboard</h1>
          {datePopup ? (
            <div class="select_input">
              <select
                name=""
                id=""
                value={payload.month}
                onChange={(e) =>
                  setPayload({ ...payload, month: e.target.value })
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
                value={payload.year}
                onChange={(e) =>
                  setPayload({ ...payload, year: e.target.value })
                }
              >
                <option value="">Select Year</option>

                {years &&
                  years?.map((item, index) => (
                    <option value={item}>{item}</option>
                  ))}
              </select>
            </div>
          ) : (
            <button
              className="finance-period"
              type="button"
              onClick={() => setDatePopup(true)}
            >
              <span style={{display:"flex", gap:"10px"}}>
                {" "}
               <span> {payload.month
                  ? new Date(2000, payload.month - 1).toLocaleString("en-US", {
                      month: "long",
                    })
                  : ""} </span>
               <span> {payload.year}</span>
              </span>
              <FiChevronDown />
            </button>
          )}
        </header>

        <section className="finance-stats">
          {countStats &&
            countStats?.map((item) => (
              <article
                key={item.label}
                className={`finance-stat ${item.accent}`}
              >
                <p>{item.label}</p>
                <h2>{truncateAmt(item.value)}</h2>
              </article>
            ))}
        </section>

    <section className="card-panel finance-chart-panel">
  <div className="panel-header">
    <div className="panel-title-wrap">
      <h3>Revenue vs Expense</h3>
    </div>

    <div className="chart-legend">
      <span className="legend-pill revenue">Revenue</span>
      <span className="legend-pill expense">Expense</span>
    </div>
  </div>

  <div className="chart-surface">
    <div className="chart-grid-lines" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>

    <div
      className="chart-bars"
      aria-label="Revenue vs expense bar chart"
    >
      {monthlyStats?.map((item, index) => {
        const revenue = Number(item.revenue) || 0;
        const expense = Number(item.expense) || 0;

        // Find highest value so bars are scaled relative to the data
        const maxValue = Math.max(
          ...monthlyStats.map((x) =>
            Math.max(Number(x.revenue) || 0, Number(x.expense) || 0)
          ),
          1
        );

        const revenueHeight = (revenue / maxValue) * 100;
        const expenseHeight = (expense / maxValue) * 100;

        return (
          <div key={item.month} className="bar-pair">
            <div className="bar-group">
              <span
                className="bar revenue-bar"
                style={{
                  height: `${revenueHeight}%`,
                }}
                title={`Revenue: ₹${revenue.toLocaleString("en-IN")}`}
              />

              <span
                className="bar expense-bar"
                style={{
                  height: `${expenseHeight}%`,
                }}
                title={`Expense: ₹${expense.toLocaleString("en-IN")}`}
              />
            </div>

            <small>{item.monthName}</small>
          </div>
        );
      })}
    </div>
  </div>
</section>

        <section className="finance-breakdown-grid">
          <article className="card-panel breakdown-card">
            <div className="panel-header compact">
              <h3>Revenue by Artist</h3>
            </div>

            <div className="list-stack">
              {artistData && artistData.map((artist, index) => (
                <div key={artist.artist} className="list-row">
                  <div className="artist-meta">
                    <span className={`artist-dot dot-${index + 1}`} />
                    <span>{artist.artist}</span>
                  </div>
                  <strong>{truncateAmt(artist.revenue)}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="card-panel breakdown-card">
            <div className="panel-header compact">
              <h3>Payment Methods</h3>
            </div>

            <div className="payment-stack">
              {paymentbreak && paymentbreak.map((item,index) => (
                <div key={item.paymentType} className="payment-row">
                  <div className="payment-label-wrap">
                    <span className="payment-label">{item.paymentType}</span>
                    <strong> {`(${truncateAmt(item.amount)})`} - {item.percentage}%</strong>
                  </div>
                  <div className="progress-track">
                    <span
                      style={{
                        width: `${item.percentage}%`,
                        
                      }}

                      className={`bar-${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="card-panel transactions-panel">
          <div className="panel-header compact">
            <h3>Recent Transactions</h3>
            <Link to="/cleints" type="button" className="ghost-button">
              View all
            </Link>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentData && recentData?.map((row) => (
                  <tr key={`${row.client}`}>
                    <td>{row?.created_at?.split(" ")[0]}</td>
                    <td>{row.name}</td>
                    <td>{row.clientType}</td>
                    <td>{row.price}</td>
                    <td>{row.paymentType}</td>
                    <td>
                      <span
                        className={`status-badge ${row.status.toLowerCase()}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainPanel>
  );
};

export default FinDashboard;
