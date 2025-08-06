import { API_URL } from "../auth/constants";

export const getSolicitudesEmpleoByUser = async ({ accessToken }) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/solicitudes-empleo`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const json = await response.json();
      // Assuming the response body contains the stores data
      return json.body.data;
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw error;
  }
};

export const getSolicitudesEmpleoById = async ({
  accessToken,
  solicitudEmpleoId,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/usuarios/solicitudes-empleo/${solicitudEmpleoId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.ok) {
      const json = await response.json();
      // Assuming the response body contains the stores data
      return json.body.data;
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw error;
  }
};

export const responseSolicitudEmpleo = async ({
  accessToken,
  solicitudEmpleoId,
  input,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/solicitudes-empleo/${solicitudEmpleoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ input }),
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw error;
  }
};
