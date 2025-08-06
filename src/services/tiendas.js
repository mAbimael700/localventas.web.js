import { API_URL } from "../auth/constants";
export const getTiendasByUser = async ({ userid }) => {
  try {
    const response = await fetch(`${API_URL}/tiendas/?usuario=${userid}`, {
      method: "GET",
    });

    if (response.ok) {
      const json = await response.json();

      // Assuming the response body contains the stores data

      return json;
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

export const getAllTiendas = async () => {
  try {
    const response = await fetch(`${API_URL}/tiendas`, {
      method: "GET",
    });

    if (response.ok) {
      const json = await response.json();

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

export async function getTiendaById({ tiendaId, accessToken }) {
  try {
    const response = await fetch(`${API_URL}/tiendas/${tiendaId}`, {
      method: "GET",
    });

    if (response.ok) {
      const json = await response.json();

      // Assuming the response body contains the stores data

      return json;
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
}

export async function updateTienda({ tiendaId, accessToken, input }) {
  const response = await fetch(`${API_URL}/tiendas/${tiendaId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "PATCH",
    body: JSON.stringify(input),
  });
  try {
    return response;
  } catch (error) {
    throw new Error(`Failed to fetch stores. Status: ${response.status}`);
  }
}

export const createDireccionTienda = async ({
  tiendaId,
  accessToken,
  input,
}) => {
  try {
    const response = await fetch(`${API_URL}/tiendas/${tiendaId}/direcciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(input),
    });

    const json = await response.json();
    if (response.ok) {
      return json.body.data;
    } else {
      throw new Error(
        json.body.message ||
          json.body.error.message ||
          `Failed to fetch stores. Status: ${response.status}`
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteDireccionTienda = async ({
  tiendaId,
  direccionId,
  accessToken,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/tiendas/${tiendaId}/direcciones/${direccionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const json = await response.json();
    if (response.ok) {
      return json.body.data;
    } else {
      throw new Error(
        json.body.message ||
          json.body.error.message ||
          `Failed to fetch stores. Status: ${response.status}`
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateDireccionTienda = async ({
  tiendaId,
  direccionId,
  accessToken,
  input,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/tiendas/${tiendaId}/direcciones/${direccionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(input),
      }
    );

    const json = await response.json();
    if (response.ok) {
      return json.body.data;
    } else {
      throw new Error(
        json.body.message ||
          json.body.error.message ||
          `Failed to fetch stores. Status: ${response.status}`
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getDireccionesByTienda = async ({ tiendaId }) => {
  try {
    const response = await fetch(`${API_URL}/tiendas/${tiendaId}/direcciones`, {
      method: "GET",
    });
    const json = await response.json();
    if (response.ok) {
      // Assuming the response body contains the stores data

      if (json.body.data) {
        return json.body.data;
      } else {
        return [];
      }
    } else {
      // Throw an error if the response is not ok

      throw new Error(
        json.body.message ||
          json.body.error.message ||
          `Failed to fetch stores. Status: ${response.status}`
      );
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw error;
  }
};
