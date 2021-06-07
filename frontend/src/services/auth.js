import api from "./api";

export async function signInRequest(data) {
  const response = await api.post("/users/auth", {
    email: data.email,
    password: data.password,
  });

  return response.data;
}

export async function signUpRequest(data) {
  const response = await api.post("/users", {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return response.data;
}

export async function recoveryUserData(token) {
  const response = await api.get("/users/auth/token", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
