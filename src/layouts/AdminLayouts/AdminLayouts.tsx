import { Outlet } from "react-router-dom"
import AdminFooter from "./AdminFooter"
import AdminHeader from "./AdminHeader"

const AdminLayouts = () => {
    return (
        <div>
            <AdminHeader />
            <Outlet />
            <AdminFooter />
        </div>
    )
}

export default AdminLayouts