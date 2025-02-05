import { Outlet } from "react-router-dom"
import DevHeader from "./DevHeader"
import DevFooter from "./DevFooter"

const DevLayouts = () => {
    return (
        <div>
            <DevHeader />
            <Outlet />
            <DevFooter />
        </div>
    )
}

export default DevLayouts