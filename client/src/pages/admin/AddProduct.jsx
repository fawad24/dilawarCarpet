import { useContext, useState } from "react";
import { ProductContext } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const { addProduct } = useContext(ProductContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 6) {
      alert("En az 6 resim seçmelisiniz");
      return;
    }

    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Ürün adı ve fiyat zorunlu");
      return;
    }

    if (imageFiles.length < 6) {
      alert("En az 6 resim yüklemelisiniz");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", Number(form.price));
    formData.append("description", form.description);

    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const savedProduct = await res.json();
      addProduct(savedProduct);
      navigate("/admin/products");
    } catch {
      alert("Ürün eklenirken hata oluştu");
    }
  };

  return (
    <div className="bg-slate-200 rounded-3xl shadow ">
      <h1 className="text-2xl font-semibold mb-6 bg-slate-100 text-center rounded-3xl shadow py-1">Yeni Ürün Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Ürün adı"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-3xl  shadow bg-slate-100 ml-96"
        />

        <input
          type="number"
          name="price"
          placeholder="Fiyat"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-3xl bg-slate-100 ml-96 shadow"
        />

        <input
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={handleImageChange}
          className="w-full ml-96"
        />

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {imagePreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="preview"
                className="w-32 h-32 object-cover  rounded bg-slate-100"
              />
            ))}
          </div>
        )}

        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-3xl shadow bg-slate-100 ml-96"
        />

        <button
          type="submit"
          className=" text-white px-4 py-2 rounded-3xl mx-96 bg-lime-400"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
