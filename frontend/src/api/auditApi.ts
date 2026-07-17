import axios from "./axios";

export const getAuditLogs = (
    search = ""
) =>
  axios.get("/audit-logs", 
    {
    params: { search },
  });