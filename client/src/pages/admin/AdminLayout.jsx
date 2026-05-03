import { Outlet, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function AdminLayout() {
  return (
    <>
      {/* ÜST NAVBAR (SABİT) */}
      <Navbar />

      {/* Navbar fixed olduğu için boşluk */}
      <div className="pt-20 flex min-h-screen bg-gray-100">

        {/* SOL MENU */}
        <aside className="w-60 bg-gray-900 text-white rounded-full p-14 fixed top-24 left-0 h-[calc(100vh-7rem)]">
          <h2 className="text-xl font-bold mb-6 shadow">Admin Panel</h2>

          <nav className="space-y-4">
            <Link to="/admin" className="block hover:bg-slate-800  mt-36 bg-slate-700 rounded-3xl shadow py-1 px-6">
              Dashboard
            </Link>

            <Link to="/admin/products" className="block  hover:bg-slate-800  bg-slate-700 rounded-3xl shadow py-1 px-6">
              Ürünler
            </Link>

            <Link to="/admin/products/new" className="block  hover:bg-slate-800  bg-slate-700 rounded-3xl shadow py-1 px-6">
              Ürün Ekle
            </Link>

            <Link to="/admin/orders" className="block  hover:bg-slate-800  bg-slate-700 rounded-3xl shadow py-1 px-6">
              Siparişler
            </Link>
          </nav>
        </aside>

        {/* SAĞ İÇERİK */}
        <main className="ml-64 flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </>
  );
}
