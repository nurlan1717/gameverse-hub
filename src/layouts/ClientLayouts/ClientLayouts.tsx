import { Outlet } from "react-router-dom"
import ClientFooter from "./ClientFooter"
import ClientHeader from "./ClientHeader"

const ClientLayouts = () => {
    return (
        <div>
            <ClientHeader />
            <Outlet />
            <ClientFooter />
        </div>
    )
}

export default ClientLayouts