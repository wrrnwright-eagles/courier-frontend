import apiClient from "./services";

export default {
  getPickupCustomers() {
    return apiClient.get("pickupCustomers");
  },
  getPickupCustomer(id) {
    return apiClient.get("pickupCustomers/" + id);
  },
  addPickupCustomer(customer) {
    return apiClient.post("pickupCustomers", customer);
  },
  updatePickupCustomer(customer) {
    return apiClient.put("pickupCustomers/" + customer.id, customer);
  },
  deletePickupCustomer(customerId) {
    return apiClient.delete("pickupCustomers/" + customerId);
  },
};