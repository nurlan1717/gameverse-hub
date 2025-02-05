const routes = {
    user: [
        { path: "/", element: "ClientPage" },
        { path: "/profile", element: "ProfilePage" },
    ],
    developer: [
        { path: "/developer", element: "DeveloperPage" },
        { path: "/dev-tools", element: "DevToolsPage" },
    ],
    admin: [
        { path: "/admin", element: "AdminPage" },
        { path: "/admin/users", element: "UserManagementPage" },
    ],
};

export default routes;
