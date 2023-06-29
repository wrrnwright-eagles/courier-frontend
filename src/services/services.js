import axios from "axios";

var baseurl = "";
if (process.env.NODE_ENV === "development") {


  baseurl = "http://localhost/courierapi/";

} else {
  baseurl = "/courierapi/";
}

const apiClient = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    crossDomain: true,
  },
  transformRequest: (data, headers) => {
    let token = null;
    if (localStorage.getItem("user") !== null) {
      token = JSON.parse(localStorage.getItem("user")).token;
    }
    let authHeader = "";
    if (token !== null && token !== "") {
      authHeader = "Bearer " + token;
      headers["Authorization"] = authHeader;
    }
    return JSON.stringify(data);
  },
  transformResponse: function (data) {
    try {
      data = JSON.parse(data);
      if (!data.success && data.code === "expired-session") {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Could not parse response as JSON", error);
      // Optionally, set data to a safe default if JSON parsing fails
      data = {};
    }
    return data;
  },
});

export default apiClient;
