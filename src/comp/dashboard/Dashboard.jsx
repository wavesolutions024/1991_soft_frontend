
import { useEffect, useState } from "react";
import "./Dashboard.scss";
import { IoNotificationsOutline } from "react-icons/io5";
import { api } from "../../Api";

const months = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalClients: { count: 0, growth: "+0%", label: "" },
    todayAppointments: { count: 0, growth: "+0%", label: "" },
    totalEnquiries: { count: 0, growth: "+0%", label: "" },
    totalConsultants: { count: 0, growth: "+0%", label: "" },
  });
  const [monthlyGrowth, setMonthlyGrowth] = useState({
    title: "",
    subtitle: "",
    yoyGrowth: "",
    chartData: [],
  });
  const [calendar, setCalendar] = useState({
    title: "",
    subtitle: "",
    calendarEvents: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("api/dashboard/dashboard");
        const dashboardData = response?.data?.data;
        if (dashboardData) {
          setStats(dashboardData.stats || {});
          setMonthlyGrowth(dashboardData.monthlyGrowth || {});
            const calendarData = dashboardData.calendar || {};
            setCalendar(calendarData);
            if (calendarData.month) {
              const monthItem = months.find((item) => item.label === calendarData.month);
              if (monthItem) {
                setSelectedMonth(monthItem.value);
              }
            }
            if (calendarData.year) {
              setSelectedYear(calendarData.year);
            }
        }
      } catch (error) {
        console.error("Dashboard API error:", error);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const response = await api.get(
          `api/dashboard/calendar?month=${selectedMonth}&year=${selectedYear}`,
        );
        const calendarData = response?.data?.data;
        if (calendarData) {
          setCalendar(calendarData);
        }
      } catch (error) {
        console.error("Calendar API error:", error);
      }
    };

    if (selectedMonth && selectedYear) {
      loadCalendar();
    }
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const yearOptions = [
    selectedYear - 2,
    selectedYear - 1,
    selectedYear,
    selectedYear + 1,
    selectedYear + 2,
  ];

  const chartData = monthlyGrowth.chartData || [];
  const maxValue = Math.max(...chartData.map((item) => item.activeClients || 0), 1);
  const statCards = [
    {
      key: "totalClients",
      title: "Total Clients",
      value: stats.totalClients.count,
      growth: stats.totalClients.growth,
      label: stats.totalClients.label,
      className: "blue",
    },
    {
      key: "todayAppointments",
      title: "Today’s Appointments",
      value: stats.todayAppointments.count,
      growth: stats.todayAppointments.growth,
      label: stats.todayAppointments.label,
      className: "violet",
    },
    {
      key: "totalEnquiries",
      title: "Total Enquiries",
      value: stats.totalEnquiries.count,
      growth: stats.totalEnquiries.growth,
      label: stats.totalEnquiries.label,
      className: "orange",
    },
    {
      key: "totalConsultants",
      title: "Total Consultants",
      value: stats.totalConsultants.count,
      growth: stats.totalConsultants.growth,
      label: stats.totalConsultants.label,
      className: "pink",
    },
  ];

  return (
    <div>
      <main className="dashboard">
        <header className="dashboard-header">
          <div className="notify">
            <div className="number">3</div>
            <span className="ghanta">
              <IoNotificationsOutline />
            </span>
          </div>
          <div className="profile">
            <div>
              <p>Admin Users</p>
              <small>admin@lifestarter.com</small>
            </div>
            <div className="avatar">AU</div>
          </div>
        </header>

        <section className="top-cards">
          {statCards.map((card) => (
            <article key={card.key} className={`stat-card ${card.className}`}>
              <p>{card.title}</p>
              <h2>{card.value}</h2>
              <span>{`${card.growth || "+0%"} ${card.label || "last month"}`}</span>
            </article>
          ))}
        </section>

        <section className="graph-card">
          <div className="card card-graph">
            <div className="card-title">
              <div>
                <h3>{monthlyGrowth.title || "12-Month Client Growth"}</h3>
                <p>{monthlyGrowth.subtitle || "Monthly active clients"}</p>
              </div>
              <span className="tag">{monthlyGrowth.yoyGrowth || "+0% YoY"}</span>
            </div>
            <div className="graph-wrapper">
              <div className="graph-y-axis">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>
              <div className="graph-area">
                <div className="graph-bars">
                  {chartData.map((item) => {
                    const height = `${Math.max(((item.activeClients || 0) / maxValue) * 100, 8)}%`;
                    return (
                      <div key={item.month} className="graph-col">
                        <div className="bar" style={{ height }}></div>
                        <span>{item.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="graph-xline"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="calendar-card">
          <div className="card card-calendar">
            <div className="card-title">
              <div>
                <h3>{calendar.title || "Client Calendar"}</h3>
                <p>{calendar.subtitle || "Client meetings, tasks, and deadlines"}</p>
              </div>
              <div className="calendar-controls">
                <select value={selectedMonth} onChange={handleMonthChange}>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                <select value={selectedYear} onChange={handleYearChange}>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="calendar-grid">
              <div className="calendar-weekdays">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
              <div className="calendar-days">
                {calendar.calendarEvents?.map((event, index) => (
                  <div
                    key={`${event.dayOfMonth}-${index}`}
                    className={`day ${event.appointments?.length ? "day-event" : ""}`}
                  >
                    <strong>{event.dayOfMonth}</strong>
                    {event.appointments?.length > 0
                      ? event.appointments.slice(0, 2).map((appointment, idx) => (
                          <div key={idx}>
                            <p>{appointment.title || appointment.client || "Appointment"}</p>
                            <small>{appointment.subtitle || appointment.time || appointment.description || ""}</small>
                          </div>
                        ))
                      : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
