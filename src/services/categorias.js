import { API_URL } from "../auth/constants";

export function getCategoriasByTienda({ tiendaId, accessToken, params }) {
  let queryParams = params && params.join('&') || `activo=true`;


  
  const response = fetch(
    `${API_URL}/tiendas/${tiendaId}/categorias?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
}

export async function createCategoriasByTienda({ input, accessToken }) {
  try {
    const response = await fetch(`${API_URL}/categorias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...input }),
    });
    return response;
  } catch (error) {
    console.error("Error fetching stores:", error);
    // You might want to throw or return the error depending on your use case
    throw new Error(error);
  }
}

export function getCategoriaById({ tiendaId, categoriaId, accessToken }) {
  const response = fetch(
    `${API_URL}/tiendas/${tiendaId}/categorias/${categoriaId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
}



export async function deactivateCategoria({
  tiendaId,
  categoriaId,
  accessToken,
}) {
  let URL = `${API_URL}/tiendas/${tiendaId}/categorias/${categoriaId}`;

  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export async function activateCategoria({ tiendaId, categoriaId, accessToken }) {
  let URL = `${API_URL}/tiendas/${tiendaId}/categorias/${categoriaId}`;

  const response = await fetch(URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      activo: true,
    }),
  });
  return response;
}