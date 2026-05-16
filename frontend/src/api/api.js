const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

const api = {
  get: (url) =>
    fetch(`${BASE_URL}${url}`, {
      headers: { Authorization: getToken() },
    }).then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }),

  post: (url, body) =>
    fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: { Authorization: getToken() },
      body: body,
    }).then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }),

  put: (url, body) =>
    fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: { Authorization: getToken() },
      body: body,
    }).then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }),

  delete: (url) =>
    fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: { Authorization: getToken() },
    }).then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res;
    }),
};

export default api;