import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams(); // URL'den ürün ID
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    images: [] // artık tüm resimler array olarak tutuluyor
  });

  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState([]); // Yeni eklenen resimler için

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name,
          price: data.price,
          description: data.description || "",
          images: data.images || []
        });
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  // Form input değişimleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Yeni resim seçimi
  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  // Resim silme (mevcut resimler)
  const handleRemoveExistingImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Backend için FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("description", formData.description);

      // Mevcut resimleri de gönderiyoruz (backend’de eski resimler korunacak şekilde)
      formData.images.forEach(imgPath => data.append("existingImages", imgPath));

      // Yeni resimler
      if (newImages.length > 0) {
        newImages.forEach(file => data.append("images", file));
      }

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Güncelleme başarısız");

      alert("Ürün güncellendi!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Hata oluştu");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-slate-200 rounded-3xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center bg-slate-50 rounded-3xl shadow">Ürünü Düzenle</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ürün Adı */}
        <div>
          <label className="block mb-1 font-semibold bg-slate-50 rounded-3xl shadow max-w-24 px-3 py-1">Ürün Adı</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border p-2 w-full bg-slate-50 rounded-3xl shadow hover:bg-white"
            required
          />
        </div>

        {/* Fiyat */}
        <div>
          <label className="block mb-1 font-semibold  bg-slate-50 rounded-3xl shadow max-w-24 px-3 py-1">Fiyat</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="border p-2 w-full bg-slate-50 rounded-3xl shadow hover:bg-white"
            required
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block mb-1 font-semibold  bg-slate-50 rounded-3xl shadow max-w-24 px-3 py-1">Açıklama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 w-full bg-slate-50 rounded-3xl shadow hover:bg-white"
          />
        </div>

        {/* Mevcut Resimler */}
        <div className="bg-slate-100 rounded-3xl shadow py-2 px-3">
          <label className="block mb-1 font-semibold  bg-slate-100 shadow rounded-3xl max-w-36 py-1 px-2">Mevcut Resimler</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={`${API_URL}${img}`}
                  className="w-32 h-32 object-contain border rounded-3xl shadow"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Yeni Resimler */}
        <div>
          <label className="block mb-1 font-semibold bg-slate-50 rounded-3xl shadow max-w-32 px-3 py-1">Yeni Resimler</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
          {newImages.length > 0 && (
            
            <div className="flex flex-wrap gap-2 mt-2">
              {newImages.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  className="w-32 h-32 object-contain border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          className="bg-lime-400 shadow text-white px-4 py-2 rounded-3xl hover:bg-lime-500 font-semibold"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
