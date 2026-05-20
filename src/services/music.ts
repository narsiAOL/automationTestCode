import { API_ENDPOINTS } from "./apiEndpoints";
import httpClient from "./http";

class MusicService {
  async getAllMusic(params?: any) {
    try {
      const response = await httpClient.get(API_ENDPOINTS.music.list, {
        params,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching music data:", error);
    }
  }
  async addMusic(params: any) {
    try {
      const response = await httpClient.post(
        API_ENDPOINTS.music.addMusic,
        params,
      );
      return response.data;
    } catch (error) {
      console.error("Error adding music:", error);
    }
  }
  async deleteMusic(musicId: string) {
    try {
      const response = await httpClient.delete(
        `${API_ENDPOINTS.music.deleteMusic}?music_id=${encodeURIComponent(musicId)}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting music:", error);
    }
  }
}

const musicService = new MusicService();
export default musicService;
