import RegisterView from "@/views/register-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | Tienda UCN",
  description: "Crea tu cuenta en Tienda UCN",
};

export default function RegisterPage() {
  return <RegisterView />;
}
