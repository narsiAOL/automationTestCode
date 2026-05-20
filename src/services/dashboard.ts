import { API_ENDPOINTS } from "./apiEndpoints";
import httpClient from "./http";

class DashBoardService {
  async getDashboardInfo() {
    try {
      const response = await httpClient.get(API_ENDPOINTS.dashBoard.info);
      console.log("Dashboard info response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch dashboard info:", error);
      throw error;
    }
  }
  async getFamilies() {
    try {
      const response = await httpClient.get(API_ENDPOINTS.family.getFamilies);
      console.log("Get families response::", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch families:", error);
      throw error;
    }
  }
}
const dashBoardService = new DashBoardService();
export default dashBoardService;
