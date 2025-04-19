/**
 * User related functions
 * 
 * This file contains functions to fetch, create, update, and delete users.
 */
import API from "./api";

export const getUser = async () => {
    try {
        const response = await API.get(`/user`);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch user");
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
    }
}