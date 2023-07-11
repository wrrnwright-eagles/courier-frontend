import apiClient from "./services";

export default {
  getPaths() {
    return apiClient.get("paths");
  },
  getPath(id) {
    return apiClient.get("paths/" + id);
  },
  addPath(path) {
    return apiClient.post("paths", path);
  },
  updatePath(path) {
    return apiClient.put("paths/" + path.id, path);
  },
  deletePath(pathId) {
    return apiClient.delete("paths/" + pathId);
  },
};