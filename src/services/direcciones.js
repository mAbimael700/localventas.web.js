import { API_URL } from "../auth/constants";

export async function getPaises() {
  try {
    const response = await fetch(`${API_URL}/direcciones/paises`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      const { data } = json.body;
      return data;
    } else {
      const errorMessage = `Failed to fetch stores. Status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw error;
  }
}

export async function getEstadosByPais({ paisId }) {
  try {
    const response = await fetch(
      `${API_URL}/direcciones/paises/${paisId}/estados`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      const { data } = json.body;
      return data;
    } else {
      const errorMessage = `Failed to fetch stores. Status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw error;
  }
}
