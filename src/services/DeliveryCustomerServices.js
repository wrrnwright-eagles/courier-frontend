import apiClient from "./services";

export default {
  getDeliveryCustomers() {
    return apiClient.get("deliveryCustomers");
  },
  getDeliveryCustomer(id) {
    return apiClient.get("deliveryCustomers/" + id);
  },
  addDeliveryCustomer(customer) {
    return apiClient.post("deliveryCustomers", customer);
  },
  updateDeliveryCustomer(customer) {
    return apiClient.put("deliveryCustomers/" + customer.id, customer);
  },
  deleteDeliveryCustomer(customerId) {
    return apiClient.delete("deliveryCustomers/" + customerId);
  },
};