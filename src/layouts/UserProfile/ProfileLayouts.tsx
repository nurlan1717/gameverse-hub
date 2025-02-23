import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserSettings from "./UserSettings";

const ProfileLayouts = () => {
    return (
        <div className="flex-c h-full">
            <UserHeader />

            <div className="mt-20 flex">
                <UserSettings />
                <div className="flex-grow p-5">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default ProfileLayouts;
