import { API_URL } from "../auth/constants";

export async function getProductosByTienda({
  tiendaId,
  queryParams,
  accessToken,
}) {
  let URL = `${API_URL}/tiendas/${tiendaId}/productos`;

  if (queryParams) {
    URL = URL.concat(`?`, queryParams.join("&"));
  }

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export async function getProductosPublicByTienda({ tiendaId, queryParams }) {
  let URL = `${API_URL}/tiendas/${tiendaId}/public/productos`;

  if (queryParams) {
    URL = URL.concat(`?`, queryParams.join("&"));
  }

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export async function getProductoById({ tiendaId, productoId, accessToken }) {
  let URL = `${API_URL}/tiendas/${tiendaId}/productos/${productoId}`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export async function getProductoPublicById({ tiendaId, productoId }) {
  let URL = `${API_URL}/tiendas/${tiendaId}/public/productos/${productoId}`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}

export async function deactivateProducto({
  tiendaId,
  productoId,
  accessToken,
}) {
  let URL = `${API_URL}/tiendas/${tiendaId}/productos/${productoId}`;

  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export async function activateProducto({ productoId, accessToken }) {
  let URL = `${API_URL}/productos/${productoId}`;

  const response = await fetch(URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      estado: true,
    }),
  });
  return response;
}
