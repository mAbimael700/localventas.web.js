import { API_URL } from "../auth/constants";

export function getMetodosPago({ accessToken }) {
  const response = fetch(`${API_URL}/metodos-pago`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, 
    },
  });
  return response;
}
