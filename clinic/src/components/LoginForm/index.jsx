import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { InputHandler } from "./InputHandler";
import { toast } from "react-toastify";
import { Modal } from "../Modal";

import { Link, useNavigate } from "react-router";
import axios from "axios";
import RegisterUser from "../RegisterUser";
import apiClient from "../../api/api";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
  const { login, logout, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  //   modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // auth do usuario (verifica se o usuario esta logado)
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/login", {
          email,
          senha: password,
      });

      console.log("response", response)

      // console.log("params", params)

      if (response.data.length === 0) {
        toast.error("Usuário não encontrado. Verifique o email e senha", {
          autoClose: 3000,
          hideProgressBar: true,
        });
        return;
      }

      const tokenAcesso = localStorage.getItem("accessToken")
      localStorage.setItem("accessToken", response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken)

      console.log("Token", tokenAcesso)
      const payload = jwtDecode(tokenAcesso)

      login(payload.email);

      toast.success("Login realizado com sucesso!", {
        autoClose: 2000,
      });

      setTimeout(() => navigate("/dashboard", 2000));
      
    } catch (error) {
      console.error("Erro ao verificar usuário", error);
      toast.error("Erro ao verificar usuário", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <section
        className="w-full flex justify-center items-center"
      >
        <form className="flex flex-col justify-center items-center bg-white px-12 h-[400px] rounded-md shadow-md" onSubmit={handleLogin}>
          <h2 className="font-bold text-2xl mb-4">Login</h2>
          <InputHandler
            label={"Email"}
            type={"email"}
            required
            id={"email"}
            value={email}
            setValue={setEmail}
          />
          <InputHandler
            label={"Senha"}
            type={"password"}
            required
            id={"senha"}
            value={password}
            setValue={setPassword}
            min={8}
          />
          <button
            className="text-lg text-white mt-2 py-2 w-full rounded-md bg-cyan-700 cursor-pointer hover:bg-cyan-800 transition-colors"
            type="submit"
          >
            Entrar
          </button>
          <p className="mt-4">
            Não possui login?{" "}
            <a
              className="text-blue-600 hover:cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Cadastre-se
            </a>
          </p>
          <div className="flex justify-between mt-2 text-sm">
            <button
              onClick={() => toast.info("function WIP")}
              className="text-blue-600 hover:cursor-pointer"
            >
              Esqueceu sua senha?
            </button>
          </div>
        </form>
      </section>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <RegisterUser onClose={() => setIsModalOpen(false)}/>
      </Modal>
    </div>
  );
};

export default LoginForm;
