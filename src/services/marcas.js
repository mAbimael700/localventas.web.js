import { API_URL } from "../auth/constants";

export function getMarcasByTienda({ tiendaId, accessToken }) {
  const response = fetch(`${API_URL}/marcas/?tienda=${tiendaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export function getMarcaById({ tiendaId, marcaId, accessToken }) {
  const response = fetch(`${API_URL}/tiendas/${tiendaId}/marcas/${marcaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}


export async function deactivateMarca({
  tiendaId,
  marcaId,
  accessToken,
}) {
  let URL = `${API_URL}/tiendas/${tiendaId}/marcas/${marcaId}`;

  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export async function activateMarca({ tiendaId, marcaId, accessToken }) {
  let URL = `${API_URL}/tiendas/${tiendaId}/marcas/${marcaId}`;

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