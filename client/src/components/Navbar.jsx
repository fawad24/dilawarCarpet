import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";
import { useTranslation } from "../context/TranslationContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { t, lang, toggleLanguage } = useTranslation();

  const { cart } = useContext(CartContext);
  const { searchTerm, setSearchTerm } = useContext(ProductContext);


  const [openDesktop, setOpenDesktop] = useState(false);
const [openMobile, setOpenMobile] = useState(false);
  

  const desktopRef = useRef(null);
const mobileRef = useRef(null);


 useEffect(() => {
  const handleClickOutside = (e) => {
    const isOutsideDesktop = desktopRef.current
      ? !desktopRef.current.contains(e.target)
      : true;

    const isOutsideMobile = mobileRef.current
      ? !mobileRef.current.contains(e.target)
      : true;

    if (isOutsideDesktop && isOutsideMobile) {
      setOpenDesktop(false);
      setOpenMobile(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const navItems = [
    { path: "/", label: "Home", show: true },
    { path: "/cart", label: "Cart", show: true },
    { path: "/admin/products", label: "Admin", show: user?.email === "fawaddilawar24@gmail.com" },
    { path: "/login", label: "Login", show: !user },
    { path: "/signup", label: "Signup", show: !user },
  ];

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="bg-slate-100 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 sm:px-4 py-3 relative overflow-visible">

          {/* LOGO */}
          <h1 className="text-xs sm:text-xl px-8 py-1 font-semibold whitespace-nowrap text-slate-800 rounded-2xl shadow bg-slate-50">
            DILAWAR <span className="text-blue-500">CARPET</span>
          </h1>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-2xl px-2 sm:px-3 py-1 w-32 sm:w-1/2 md:w-1/3 focus:outline-none focus:ring-blue-400 shadow bg-slate-50 hover:bg-white text-xs sm:text-sm"
          />

          {/* DESKTOP MENU */}
          <ul className="hidden mt-2 sm:flex items-center gap-3 md:gap-3 lg:gap-3">

            {user && (
              <li className="relative mt-0" ref={desktopRef}>
                <span
                  onClick={() => setOpenDesktop(!openDesktop)}
                  className="text-sm font-semibold px-3 py-2 text-gray-700 bg-slate-50 rounded-2xl shadow hover:bg-white"
                >
                  {t("Hi")} {user.firstName}
                </span>

                {openDesktop && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50">
                    <button onClick={() => { navigate("/bilgilerim"); setOpenDesktop(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{t("myInfo")}</button>
                    <button onClick={() => { navigate("/orders"); setOpenDesktop(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">{t("myOrders")}</button>
                   <button
  onClick={async () => {
    await logout();
    setOpenDesktop(false);
    setOpenMobile(false);
    navigate("/");
  }}
  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
>
  {t("logout")}
</button>
                    
                  </div>
                )}
              </li>
            )}

            {navItems.filter(i => i.show).map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path)
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                  } hover:bg-white shadow py-1 px-3 rounded-2xl bg-slate-50 font-semibold`}
                >
                  {t(item.label.toLowerCase())}

                  {item.path === "/cart" && cart.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-xs">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </li>
            ))}

            <li>
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 shadow rounded-2xl bg-slate-50 hover:bg-white font-semibold"
              >
                {lang === "tr" ? "EN" : "TR"}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* MOBILE ALT MENU (ŞEFFAF BAR + STYLED BUTTONS) */}

     <div className="sm:hidden fixed top-[60px] left-0 w-full z-40 py-4 overflow-hidden">
  {/* 🎥 VIDEO BACKGROUND */}
  <video
  autoPlay
  loop
  muted
  playsInline
  webkit-playsinline="true"
  preload="auto"
  disablePictureInPicture
  controls={false}
  className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
>
    <source src="/videos/reklam1.mp4" type="video/mp4" />
  </video>

  {/* CONTENT */}
  <ul className="relative z-10 flex justify-center items-center gap-3 flex-wrap">

    {navItems.filter(i => i.show).map((item) => (
      <li key={item.path}>
        <Link
          to={item.path}
          className={`${
            location.pathname === item.path ||
            location.pathname.startsWith(item.path)
              ? "text-blue-600 font-semibold"
              : "text-gray-700"
          } text-xs px-3 py-1 bg-white/40 backdrop-blur-md rounded-2xl shadow hover:bg-white/60 whitespace-nowrap`}
        >
          {t(item.label.toLowerCase())}

          {item.path === "/cart" && cart.length > 0 && (
            <span className="ml-1 bg-red-500 text-white rounded-full px-2 text-[10px]">
              {cart.length}
            </span>
          )}
        </Link>
      </li>
    ))}

    {user && (
      <li className="relative" ref={mobileRef}>
        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="text-xs px-3 py-1 bg-white/40 backdrop-blur-md rounded-2xl shadow hover:bg-white"
        >
          {t("Hi")} {user.firstName}
        </button>

        {openMobile && (
          <div className="fixed top-[120px] right-4 w-40 bg-white border rounded shadow-md z-[9999]">
            <button
              onClick={() => { navigate("/bilgilerim"); setOpenMobile(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {t("myInfo")}
            </button>

            <button
              onClick={() => { navigate("/orders"); setOpenMobile(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              {t("myOrders")}
            </button>

            <button
              onClick={async () => {
                await logout();
                setOpenDesktop(false);
                setOpenMobile(false);
                navigate("/");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
            >
              {t("logout")}
            </button>
          </div>
        )}
      </li>
    )}

    <li>
      <button
        onClick={toggleLanguage}
        className="text-xs px-3 py-1 bg-white/40 backdrop-blur-md rounded-2xl shadow hover:bg-white/60"
      >
        {lang === "tr" ? "EN" : "TR"}
      </button>
    </li>

  </ul>
</div>

    </>
  );
}