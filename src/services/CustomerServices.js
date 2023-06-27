import apiClient from "./services";

export default {
  getCustomers() {
    return apiClient.get("customers");
  },
  getCustomer(id) {
    return apiClient.get("customers/" + id);
  },
  addCustomer(customer) {
    return apiClient.post("customers", customer);
  },
  updateCustomer(customer) {
    return apiClient.put("customers/" + customer.id, customer);
  },
  deleteCustomer(customerId) {
    return apiClient.delete("customers/" + customerId);
  },
};