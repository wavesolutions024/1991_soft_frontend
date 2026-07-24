
import "./MainPanel.scss"
import Sidebar from '../sidebar/Sidebar'
import { useState } from "react"
import { FaArrowAltCircleRight } from "react-icons/fa";

const MainPanel = ({children}) => {
 const [active,setActive] = useState(false)

  return (
    <>
      <div class="main_panel parent">
        <div class={active ?  "mainsidebar active" : "mainsidebar"}>
            <Sidebar/>
        </div>
        <div class="children">
         
          
             {children}

             <div class={active ? "toggle_btn active" : "toggle_btn"} onClick={()=>setActive(!active)}>
              <FaArrowAltCircleRight />
             </div>
          
        </div>
      </div>
    </>
  )
}

export default MainPanel
