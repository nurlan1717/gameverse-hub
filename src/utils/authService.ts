import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const setAuth = (token: string, role: string) => {
    Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: "Strict" });
    Cookies.set(ROLE_KEY, role, { expires: 7, secure: true, sameSite: "Strict" });
};

export const getToken = () => Cookies.get(TOKEN_KEY);
export const getRole = () => Cookies.get(ROLE_KEY);

export const removeAuth = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(ROLE_KEY);
};
