
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

  const [expandedAppointmentEvent, setExpandedAppointmentEvent] = useState(null);

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

  const handleOpenAppointmentModal = (event) => {
    setExpandedAppointmentEvent(event);
  };

  const handleCloseAppointmentModal = () => {
    setExpandedAppointmentEvent(null);
  };

  const yearOptions = [
    selectedYear - 2,
    selectedYear - 1,
    selectedYear,
    selectedYear + 1,
    selectedYear + 2,
  ];

  const chartData = monthlyGrowth.chartData || [];

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
      key: "totalArtists",
      title: "Total Artists",
      value: stats.totalConsultants.count,
      growth: stats.totalConsultants.growth,
      label: stats.totalConsultants.label,
      className: "pink",
    },
  ];
 const MAX_VAL = Math.max(...monthlyGrowth.chartData.map(d => d.activeClients), 100);
  const ticks = [0, Math.round(MAX_VAL * 0.25), Math.round(MAX_VAL * 0.5), Math.round(MAX_VAL * 0.75), MAX_VAL];
  console.log(chartData, "chartData")

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

        <section style={{ padding: "1rem 0" }}>
      <div style={{
        background: "#141414",
        borderRadius: 12,
        padding: "1.25rem 1.5rem",
        border: "0.5px solid rgba(255,255,255,0.08)",
        fontFamily: "'Courier New', monospace",
      }}>
        {/* Card Title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 500, margin: "0 0 4px" }}>
              {monthlyGrowth.title}
            </h3>
            <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
              {monthlyGrowth.subtitle}
            </p>
          </div>
          <span style={{
            background: "rgba(50,200,120,0.12)",
            color: "#3ecf72",
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 20,
            border: "0.5px solid rgba(62,207,114,0.3)",
            whiteSpace: "nowrap",
          }}>
            {monthlyGrowth.yoyGrowth}
          </span>
        </div>

        {/* Chart Area */}
        <div style={{ position: "relative", height: 260, display: "flex", alignItems: "flex-end", gap: 6, paddingBottom: 28, paddingRight: 44 }}>
          
          {/* Grid Lines */}
          <div style={{ position: "absolute", left: 0, right: 44, top: 0, bottom: 28, pointerEvents: "none" }}>
            {ticks.map((t, i) => (
              <div key={i} style={{
                position: "absolute",
                left: 0, right: 0,
                bottom: `${(t / MAX_VAL) * 100}%`,
                height: "0.5px",
                background: "rgba(255,255,255,0.06)",
              }} />
            ))}
          </div>

          {/* Y Axis */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 28, width: 40 }}>
            {ticks.map((t, i) => (
              <div key={i} style={{
                position: "absolute",
                bottom: `calc(${(t / MAX_VAL) * 100}% - 7px)`,
                right: 4,
                fontSize: 11,
                color: "#555",
              }}>
                {t}
              </div>
            ))}
          </div>

          {/* Bars */}
          {monthlyGrowth.chartData.map((item, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}>
              
              {/* Bar */}
              <div style={{
                width: "100%",
                height: `${(item.activeClients / MAX_VAL) * 100}%`,
                background: "#fff",
                borderRadius: "2px 2px 0 0",
                position: "relative",
                minHeight: item.activeClients > 0 ? 2 : 0,
                transition: "height 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              }}>
                {/* Value Label (only show if > 0) */}
                {item.activeClients > 0 && (
                  <div style={{
                    position: "absolute",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%) rotate(-90deg)",
                    fontSize: 11,
                    color: "#9dff7a",
                    whiteSpace: "nowrap",
                  }}>
                    {item.activeClients}
                  </div>
                )}
              </div>

              {/* Month Label */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 11,
                color: "#666",
                whiteSpace: "nowrap",
              }}>
                {item.month}
              </div>
            </div>
          ))}
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
                    {event.appointments?.length > 0 && (
                      <>
                        {event.appointments.slice(0, 5).map((appointment, idx) => (
                          <div className="day_data" key={idx}>
                            <p>{appointment.clientName || "Appointment"}</p>
                            <small>{appointment.subtitle || appointment.time || appointment.description || ""}</small>
                          </div>
                        ))}
                        {event.appointments.length > 5 && (
                          <button
                            className="read-more-button"
                            onClick={() => handleOpenAppointmentModal(event)}
                          >
                            Read more
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      {expandedAppointmentEvent && (
        <div className="appointment-modal-overlay" onClick={handleCloseAppointmentModal}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="appointment-modal-header">
              <div>
                <h2>{calendar.title || "Event Appointments"}</h2>
                <p>Day {expandedAppointmentEvent.dayOfMonth} • {expandedAppointmentEvent.appointments.length} appointments</p>
              </div>
              <button className="modal-close-button" onClick={handleCloseAppointmentModal}>
                ✕
              </button>
            </div>
            <div className="appointment-modal-list">
              {expandedAppointmentEvent.appointments.map((appointment, idx) => (
                <div className="appointment-modal-item" key={idx}>
                  <p>{appointment.clientName || "Appointment"}</p>
                  <small>{appointment.subtitle || appointment.time || appointment.description || "No details available"}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
   
    </div>
  );
};

export default Dashboard;
