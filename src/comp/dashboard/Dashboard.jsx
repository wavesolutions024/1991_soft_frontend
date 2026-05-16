
import "./Dashboard.scss";
import { IoNotificationsOutline } from "react-icons/io5";

const Dashboard = () => {
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
          <article className="stat-card blue">
            <p>Total Clients</p>
            <h2>24</h2>
            <span>+2.0% last month</span>
          </article>
          <article className="stat-card violet">
            <p>Today’s Appointments</p>
            <h2>12</h2>
            <span>+1.0% last month</span>
          </article>
          <article className="stat-card orange">
            <p>Total Enquires</p>
            <h2>36</h2>
            <span>+4.0% last month</span>
          </article>
          <article className="stat-card pink">
            <p>Total Consultants</p>
            <h2>142%</h2>
            <span>+12% last month</span>
          </article>
        </section>

        <section className="graph-card">
          <div className="card card-graph">
            <div className="card-title">
              <div>
                <h3>12-Month Client Growth</h3>
                <p>Monthly active clients</p>
              </div>
              <span className="tag">+18% YoY</span>
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
                  <div className="graph-col">
                    <div className="bar" style={{ height: "40%" }}></div>
                    <span>Jan</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "50%" }}></div>
                    <span>Feb</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "60%" }}></div>
                    <span>Mar</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "68%" }}></div>
                    <span>Apr</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "74%" }}></div>
                    <span>May</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "82%" }}></div>
                    <span>Jun</span>
                  </div>
                  <div className="graph-col">
                    <div
                      className="bar bar-highlight"
                      style={{ height: "90%" }}
                    ></div>
                    <span>Jul</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "78%" }}></div>
                    <span>Aug</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "72%" }}></div>
                    <span>Sep</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "65%" }}></div>
                    <span>Oct</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "58%" }}></div>
                    <span>Nov</span>
                  </div>
                  <div className="graph-col">
                    <div className="bar" style={{ height: "70%" }}></div>
                    <span>Dec</span>
                  </div>
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
                <h3>Client Calendar</h3>
                <p>Client meetings, tasks, and deadlines</p>
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
                <div className="day empty"></div>
                <div className="day day-event">
                  <strong>2</strong>
                  <p>Client: Sarah</p>
                  <small>Intro call</small>
                </div>
                <div className="day day-event">
                  <strong>3</strong>
                  <p>Client: David</p>
                  <small>Proposal review</small>
                </div>
                <div className="day">
                  <strong>4</strong>
                </div>
                <div className="day day-event">
                  <strong>5</strong>
                  <p>Client: Emma</p>
                  <small>Campaign launch</small>
                </div>
                <div className="day">
                  <strong>6</strong>
                </div>
                <div className="day day-event">
                  <strong>7</strong>
                  <p>Client: Max</p>
                  <small>Report sent</small>
                </div>

                <div className="day">
                  <strong>8</strong>
                </div>
                <div className="day day-event">
                  <strong>9</strong>
                  <p>Client: Olivia</p>
                  <small>Feedback review</small>
                </div>
                <div className="day">
                  <strong>10</strong>
                </div>
                <div className="day day-event">
                  <strong>11</strong>
                  <p>Client: Jacob</p>
                  <small>Contract sign</small>
                </div>
                <div className="day">
                  <strong>12</strong>
                </div>
                <div className="day day-event">
                  <strong>13</strong>
                  <p>Client: Mia</p>
                  <small>Performance check</small>
                </div>
                <div className="day">
                  <strong>14</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
