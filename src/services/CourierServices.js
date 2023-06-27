import apiClient from "./services";

export default {
  getCouriers() {
    return apiClient.get("couriers");
  },
  getCourier(id) {
    return apiClient.get("couriers/" + id);
  },
  addCourier(courier) {
    return apiClient.post("couriers", courier);
  },
  updateCourier(courier) {
    return apiClient.put("couriers/" + courier.id, courier);
  },
  deleteCourier(courierId) {
    return apiClient.delete("couriers/" + courierId);
  },
};