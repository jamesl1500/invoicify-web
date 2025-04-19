/**
 * Dashboard related functions
 * 
 * This file contains functions to fetch dashboard data.
 */
import API from "./api";

export const fetchDashboardData = async () => {
    try{
        const response = await API.get('/dashboard');

        if(response.status === 200){
            return response.data;
        }else{
            throw new Error("Failed to fetch dashboard data" + response.status);
        }
    } catch(error){
        console.error("Error fetching dashboard data:", error);
        throw new Error("Failed to fetch dashboard data");
    }
};