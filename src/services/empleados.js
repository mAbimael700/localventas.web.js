import { API_URL } from "../auth/constants";

export async function createSolicitudEmpleo({ input, tiendaId, accessToken }) {
  try {
    const response = await fetch(
      `${API_URL}/tiendas/${tiendaId}/solicitudes-empleo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...input }),
      }
    );
    return response;
  } catch (error) {
    throw Error("Ocurrió un error al enviar la solicitud.");
  }
}

export async function getEmpleadosByTienda({ tiendaId, accessToken }) {
  try {
    const response = await fetch(`${API_URL}/tiendas/${tiendaId}/empleados`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw Error("Ocurrió un error al enviar la solicitud.");
  }
}

export async function deactivatedEmpleado({
  tiendaId,
  empleadoId,
  accessToken,
}) {
  let URL = `${API_URL}/tiendas/${tiendaId}/empleados/${empleadoId}`;

  const response = await fetch(URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

export async function activateEmpleado({ tiendaId, empleadoId, accessToken }) {
  let URL = `${API_URL}/tiendas/${tiendaId}/empleados/${empleadoId}`;

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
