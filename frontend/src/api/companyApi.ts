import api from "./axios";

export const getCompany = async () => {

    const response = await api.get("/companies/me");

    return response.data;
};

export const getCompanies = async () => {

    const response = await api.get("/companies");

    return response.data;
};