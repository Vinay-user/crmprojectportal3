const config = {
  appName: "CRM Portal",

  apiUrl:
    import.meta.env.VITE_API_URL || "http://localhost:8080/api",

  environment:
    import.meta.env.MODE || "development",

  tokenKey: "crm_access_token",
  userKey: "crm_user",

  pagination: {
    defaultPageSize: 10,
    pageSizes: [10, 20, 50, 100]
  }
};

export default config;