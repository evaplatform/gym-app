import { AuthContext } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useApi } from "@/hooks/useApi";
import { log } from "@/shared/utils/log";

export default function Logout() {
  const { logOut } = useContext(AuthContext);
  const router = useRouter();
  const { call } = useApi();

  useEffect(() => {
    const performLogout = async () => {
      call({
        loading: true,
        try: async (toast) => {
          // 1. Primeiro, desconecte o Google
          await GoogleSignin.signOut();

          // 2. Limpe os dados da autenticação
          await logOut();

          // 3. Depois redirecione (faça isso no componente, não no contexto)
          setTimeout(() => {
            router.replace("/login");
          }, 100);
        },
        catch: (error) => {
          log("Erro ao fazer logout:", error);
          // Ainda assim tente navegar para login em caso de erro
          router.replace("/login");
        },
      });
    };

    performLogout();
  }, []);

  return null;
}
