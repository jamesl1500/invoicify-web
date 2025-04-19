import axios from "axios";
import { Session } from "next-auth";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const setApiToken = (token: string) => {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default API;