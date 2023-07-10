import apiClient from "./services";

export default {
  getEdges() {
    return apiClient.get("edges");
  },
  getEdge(id) {
    return apiClient.get("edges/" + id);
  },
  addEdge(edge) {
    return apiClient.post("edges", edge);
  },
  updateEdge(edge) {
    return apiClient.put("edges/" + edge.id, edge);
  },
  deleteEdge(edgeId) {
    return apiClient.delete("edges/" + edgeId);
  },
};