import { API_URL } from "../auth/constants";

export async function getCurrentCartTienda({ tiendaId, accessToken }) {
  try {
    const response = await fetch(`${API_URL}/usuarios/cart/${tiendaId}`, {
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
}

export async function createCart({ accessToken, input }) {
  try {
    const response = await fetch(`${API_URL}/usuarios/cart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(input),
    });
    const json = await response.json();

    if (response.ok) {
      // Assuming the response body contains the stores data
      return "Carrito creado con éxito.";
    } else {
      // Throw an error if the response is not ok
      console.log(json);
      throw new Error(`Failed to fetch stores. Status: ${response.status}`);
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw new Error(error);
  }
}

export async function setItemCart({ accessToken, tiendaId, input }) {
  try {
    const response = await fetch(`${API_URL}/usuarios/cart/${tiendaId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(input),
    });

    if (response.ok) {
      // Assuming the response body contains the stores data
      return "Elemento insertado con éxito.";
    } else {
      // Throw an error if the response is not ok
      throw new Error(`Failed to fetch stores. Status: ${response.status}`);
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw new Error(error);
  }
}

export async function deleteItemCart({
  accessToken,
  cartId,
  itemId,
}) {
  try {
    const response = await fetch(
      `${API_URL}/usuarios/cart/${cartId}/items/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }
    );
    const json = await response.json();

    if (response.ok) {
      // Assuming the response body contains the stores data
      console.log(json);
      return "Elemento eliminado con éxito.";
    } else {
      // Throw an error if the response is not ok
      console.log(json);
      throw new Error(`Failed to fetch stores. Status: ${response.status}`);
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw new Error(error);
  }
}
