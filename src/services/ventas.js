import { API_URL } from "../auth/constants";

export function getVentasByTienda({ tiendaId, accessToken }) {
  const response = fetch(`${API_URL}/tiendas/${tiendaId}/ventas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export function getVentasCountByTienda({ tiendaId, accessToken }) {
  const response = fetch(`${API_URL}/tiendas/${tiendaId}/cantidad-ventas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}
export function getGananciasByTienda({ tiendaId, accessToken }) {
  const response = fetch(`${API_URL}/tiendas/${tiendaId}/ganancias`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export function getVentaById({ tiendaId, ventaId, accessToken }) {
  const response = fetch(
    `${API_URL}/tiendas/${tiendaId}/ventas/${ventaId}/detalles`,
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
