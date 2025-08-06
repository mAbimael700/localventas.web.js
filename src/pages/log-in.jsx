
import { UserAuthForm } from "../components/form/user-auth-form";
import { AuthUserFormLayout } from "./auth-user-form-layout";
import { Link } from "react-router-dom";


export default function AuthenticationPage() {
  return (
    <AuthUserFormLayout>
      
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
              ¿Aún no tienes una cuenta?
              <Link
                to="/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Registrate aquí
              </Link>
            </p>
    </AuthUserFormLayout>
  );
}
