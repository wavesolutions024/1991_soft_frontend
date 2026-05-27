import { useState } from "react";
import MainPanel from "../../comp/Main_panel/MainPanel"
import "./Consent.scss"

const Consent = () => {
      const [modal, setModal] = useState(false);
      const [data,setData] = useState();

  return (
    <>
       <MainPanel>
        <div class="table-page-header">
          <div>
            <h1>Consent Management</h1>
            <p>
              Review the client directory here. Click “Add New Consent to open
              the registration form.
            </p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="add-artiss-btn btn"
            type="button"
          >
            Add New Consent
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
                <h1>Add Artists</h1>
                <div class="cross" >
                  <RxCross2 />
                </div>
              </div>
              <form action="">
                <div className="form-group">
                  <label>
                    Name
                    <span className="required">*</span>
                  </label>
                  <input
                    
                    type="text"
                    name="artistName"
                    placeholder="John Doe"
                   
                  />
                
                </div>
                <div className="form-group">
                  <label>
                    Contact Number
                    <span className="required">*</span>
                  </label>
                  <input
                  
                    type="number"
                    name="artistNumber"
                    placeholder="John Doe"
                  
                  />
          
                 
                </div>
                <div className="form-group">
                  <label>
                    Login Username
                    <span className="required">*</span>
                  </label>
                  <input
                  
                    type="text"
                    name="username"
                    placeholder="John Doe"
                   
                  />
              
                </div>
                <div className="form-group">
                  <label>
                    Login Password
                    <span className="required">*</span>
                  </label>
                  <input
                   
                    type="text"
                    name="password"
                    placeholder="John Doe"
                    
                  />
                
                </div>
                <button className="btn" type="submit">
                  {" "}
                  Add Artist
                </button>
              </form>
            </div>
          </div>
        )}
      </MainPanel>
    </>
  )
}

export default Consent
