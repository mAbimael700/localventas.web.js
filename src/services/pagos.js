import { API_URL } from "../auth/constants";

export function getAbonosByTienda({ tiendaId, accessToken }) {
  const response = fetch(`${API_URL}/tiendas/${tiendaId}/abonos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export function getAbonosByVenta({ tiendaId, ventaId, accessToken }) {
  const response = fetch(
    `${API_URL}/tiendas/${tiendaId}/ventas/${ventaId}/abonos`,
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

export function getAbonoById({ tiendaId, ventaId, abonoId, accessToken }) {
  const response = fetch(
    `${API_URL}/tiendas/${tiendaId}/abonos/${abonoId}`,
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
