import api from "./axios";

import type {
    Sale,
    SaleCreate,
    SaleSummary,
} from "../types/sale";

export interface SaleFilterParams {
    keyword?: string;
    category_id?: number;
    sales_channel?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
    sort_by?: string;
}


export const getSales = async (): Promise<Sale[]> => {
    const res = await api.get("/sales/");
    return res.data;
};

export const getSale = async (
    id: number
): Promise<Sale> => {
    const res = await api.get(`/sales/${id}`);
    return res.data;
};

export const createSale = async (
    data: SaleCreate
): Promise<Sale> => {

    const res = await api.post(
        "/sales/",
        data,
    );
    return res.data;
};

export const updateSale = async (
    id: number,
    data: SaleCreate
): Promise<Sale> => {

    const res = await api.put(
        `/sales/${id}/`,
        data,
    );
    return res.data;
};

export const deleteSale = async (id: number,) => {
    const res = await api.delete(
        `/sales/${id}/`,
    );
    return res.data;
};

export const getSummary =
    async (): Promise<SaleSummary> => {

        const res = await api.get(
            "/sales/summary/dashboard",
        );

        return res.data;
    };

export const searchSales = async (
    keyword: string,
): Promise<Sale[]> => {

    const res = await api.get("/sales/search",{
    params:{
        keyword,
    },
});
    return res.data;
};

export const filterSales = async (
    params: SaleFilterParams,
): Promise<Sale[]> => {

    const res = await api.get(
        "/sales/filter",
        {
            params,
        },
    );
    return res.data;
};