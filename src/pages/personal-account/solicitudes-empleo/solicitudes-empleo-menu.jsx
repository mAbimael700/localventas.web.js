import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SolicitudEmpleoCard } from "../../../components/user/solicitudes-empleo/solicitud-empleo-card";
import { useAuth } from "../../../auth/auth-provider";
import { getSolicitudesEmpleoByUser } from "../../../services/solicitudes-empleo";
import { LazyCargandoLoader } from "../../../components/loaders/lazy-text-loader";

export const SolicitudesEmpleoMenu = () => {
  const [solicitudesEmpleo, setSolicitudesEmpleo] = useState(null);
  const { getAccessToken } = useAuth();

  async function getSolicitudesEmpleo() {
    const solicitudes = await getSolicitudesEmpleoByUser({
      accessToken: getAccessToken(),
    });

    if (solicitudes) {
      setSolicitudesEmpleo(solicitudes);
    } else {
      setSolicitudesEmpleo([]);
    }
  }

  useEffect(() => {
    getSolicitudesEmpleo();
  }, []);
  return solicitudesEmpleo ? (
    <div className="space-y-3">
      <header>
        <h1 className="font-semibold text-xl">Tus solicitudes de empleo</h1>
        <p className="text-sm text-muted-foreground">
          Las solicitudes de empleo aparecerán aquí
        </p>
      </header>

      <Separator />

      <section>
        {solicitudesEmpleo.length > 0 ? (
          solicitudesEmpleo.map((solicitud) => (
            <SolicitudEmpleoCard key={solicitud.id} solicitud={solicitud} />
          ))
        ) : (
          <span className="text-sm text-muted-foreground">
            ¡Todo bien! No hay solicitudes de empleo por contestar.
          </span>
        )}
      </section>
    </div>
  ) : (
    <LazyCargandoLoader />
  );
};
