import apiClient from "./services";

export default {
  getOrders() {
    return apiClient.get("/orders");
  },
  getOrder(id) {
    return apiClient.get("/orders/" + id);
  },
  getPickupCustomersFromOrders(id) {
    return apiClient.get("/orders/" + id + "/ordersWithPickupCustomers");
  },
  addOrder(order) {
    return apiClient.post("/orders", order);
  },
  updateOrder(order) {
    return apiClient.put("/orders/" + order.id, order);
  },
  deleteOrder(orderId) {
    return apiClient.delete("/orders/" + orderId);
  },
  getRecentOrders() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return apiClient.get(`/orders?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
  },
};