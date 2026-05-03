import React from "react";
import { FaShoppingCart } from "react-icons/fa";

function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-200 bg-white">
      {/* Logo */}
      <div className="text-lg sm:text-xl font-semibold tracking-widest text-gray-900 mb-2 sm:mb-0">
        DILAWAR <span className="text-blue-600">CARPET</span>
      </div>

      {/* Arama kutusu */}
      <div className="w-full sm:flex-1 sm:mx-6 mb-2 sm:mb-0">
        <input
          type="text"
          placeholder="Ürün ara..."
          className="w-full px-3 py-2 text-sm  border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Dil ve sepet */}
      <div className="flex items-center gap-4">
        <select className=" border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option>TR</option>
          <option>EN</option>
        </select>
        <button className="flex items-center justify-center px-3 py-2 border border-gray-700 text-gray-700 rounded hover:bg-gray-100 transition">
          <FaShoppingCart size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
