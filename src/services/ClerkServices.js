import apiClient from "./services";

export default {
  getClerks() {
    return apiClient.get("clerks");
  },
  getClerk(id) {
    return apiClient.get("clerks/" + id);
  },
  addClerk(clerk) {
    return apiClient.post("clerks", clerk);
  },
  updateClerk(clerk) {
    return apiClient.put("clerks/" + clerk.id, clerk);
  },
  deleteClerk(clerkId) {
    return apiClient.delete("clerks/" + clerkId);
  },
};
