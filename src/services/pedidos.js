import { API_URL } from "../auth/constants";

export const getPedidosByTienda = async ({ tiendaId, accessToken }) => {
  try {
    const response = await fetch(`${API_URL}/tiendas/${tiendaId}/pedidos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      // Assuming the response body contains the stores data

      return json.body.data;
    } else {
      // Throw an error if the response is not ok
      throw new Error(`Failed to fetch stores. Status: ${response.status}`);
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw error;
  }
};
