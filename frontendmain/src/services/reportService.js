import api from "./api";

const reportService = {
  getSalesReport(params = {}) {
    return api.get("/reports/sales", { params });
  },

  getRevenueReport(params = {}) {
    return api.get("/reports/revenue", { params });
  }
};

export default reportService;
