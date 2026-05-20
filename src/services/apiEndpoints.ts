export const API_ENDPOINTS = {
  auth: {
    login: "/auth/user/log-in",
    logout: "/auth/user/logout",
    refresh: "/auth/user/refreshToken",
    user: "/auth/user/profile",
  },
  dashBoard: {
    info: "/people/dashboard/info",
  },
  family: {
    list: "/people/getPeople",
    member: "/people/info",
    ancestors: "/people/ancestors", // (get) need to pass person id and level as query params
    descendents: "/people/descendants", // (get) need to pass person id and level as query params
    businessDirectory: "/people/businessDirectory",
    addPerson: "/people/addPerson",
    updateMember: "/people/updateMember",
    getFamilies: "/people/getFamilies",
  },
  edit: {
    personalDetails: "people/updatePerson", //(put),
  },
  asset: {
    uploadFile: "/asset/uploadFile",
  },
  business: {
    addBusiness: "/people/addBusiness",
    updateBusiness: "/people/updateBusiness",
  },
  music: {
    list: "/music/getMusic",
    addMusic: "/music/addMusic",
    deleteMusic: "/music/deleteMusic",
  },
  filters: `/filters/getFilters`,
  downloadProfilePdf: "/people/generatePdf",
};
