import apiClient from "./services";

export default {
  getNodes() {
    return apiClient.get("nodes");
  },
  getNode(id) {
    return apiClient.get("nodes/" + id);
  },
  addNode(node) {
    return apiClient.post("nodes", node);
  },
  updateNode(node) {
    return apiClient.put("nodes/" + node.id, node);
  },
  deleteNode(nodeId) {
    return apiClient.delete("nodes/" + nodeId);
  },
};