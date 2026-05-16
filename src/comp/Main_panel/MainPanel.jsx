
import "./MainPanel.scss"
import Sidebar from '../sidebar/Sidebar'
import { useState } from "react"

const MainPanel = ({children}) => {
 const [active,setActive] = useState(false)

  return (
    <>
      <div class="main_panel parent">
        <div class="mainsidebar">
            <Sidebar/>
        </div>
        <div class="children">
            {children}
        </div>
      </div>
    </>
  )
}

export default MainPanel
