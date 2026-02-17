import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

// Import your navigation data structure
import { navigationData } from '@/data/navigation'; // Adjust path if needed

// --- CONFIGURATION ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function CreateProduct() {
  const navigate = useNavigate();
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Image States
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    material: '',
    price: '',
    gender: 'women', // Default value matching your data keys
    category: '',
    subCategory: '',
    bigSizes: false,
    cod:''
  });

  // --- DERIVED DATA ---
  
  // 1. Get Categories based on selected Gender
  const availableCategories = useMemo(() => {
    return navigationData[formData.gender] || [];
  }, [formData.gender]);

  // 2. Get Subcategories based on selected Category
  const availableSubcategories = useMemo(() => {
    const categoryObj = availableCategories.find(c => c.slug === formData.category);
    return categoryObj?.subcategories || [];
  }, [availableCategories, formData.category]);


  // --- HANDLERS ---

  // Generic Input Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gender Change: Resets Category & SubCategory
  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    const genderCategories = navigationData[newGender] || [];
    
    setFormData((prev) => ({
      ...prev,
      gender: newGender,
      // Automatically select the first category to be helpful, or leave empty
      category: genderCategories.length > 0 ? genderCategories[0].slug : '',
      subCategory: '' 
    }));
  };

  // Category Change: Resets SubCategory
  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
      subCategory: ''
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, bigSizes: e.target.checked }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        alert('Te rog selectează un fișier imagine');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      let finalImageUrl = null;

      // STEP 1: Upload Image to Cloudflare
      if (imageFile) {
        // A. Get Presigned URL
        const presignRes = await fetch(`${API_URL}/products/admin/upload-url`, {
          method: 'POST',
          credentials: "include", 
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileType: imageFile.type }),
        });
        
        if (!presignRes.ok) throw new Error("Nu s-a putut genera URL-ul de încărcare");
        
        const { uploadUrl, publicUrl } = await presignRes.json();

        // B. Upload File directly to Cloudflare R2
        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 
            'Content-Type': imageFile.type 
          },
          body: imageFile,
          credentials: "omit" // CRITICAL
        });

        if (!uploadRes.ok) throw new Error("Nu s-a putut încărca imaginea pe serverul de stocare");
        
        finalImageUrl = publicUrl;
      }

      // STEP 2: Create Product in Database
      const productPayload = {
        ...formData,
        price: Number(formData.price), // Backend handles the *100 multiplication
        
        // Ensure empty strings are sent as null for validation
        subCategory: formData.subCategory === "" ? null : formData.subCategory,
        description: formData.description === "" ? null : formData.description,
        material: formData.material === "" ? null : formData.material,

        image: finalImageUrl,
      };

      const productRes = await fetch(`${API_URL}/products/admin`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload),
        credentials: "include"
      });

      if (!productRes.ok) {
        const errorData = await productRes.json();
        const message = errorData.details 
          ? `Eroare de validare: ${JSON.stringify(errorData.details)}` 
          : errorData.message || "Nu s-a putut crea produsul";
        throw new Error(message);
      }

      // Success
      toast.success('Produs creat cu succes!');
      navigate('/admin/products'); 

    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Adaugă Produs Nou</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Eroare</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-8 space-y-8">
        
        {/* --- IMAGE UPLOAD SECTION --- */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Imagine Produs</label>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors duration-200">
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                <div className="bg-blue-50 p-4 rounded-full mb-3">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <span className="text-base font-medium text-gray-700">Apasă pentru a încărca imaginea</span>
                <span className="text-sm text-gray-400 mt-1">SVG, PNG, JPG sau WEBP</span>
              </label>
            </div>
          ) : (
            <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={imagePreview} alt="Previzualizare" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
              <button 
                type="button" 
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 my-6"></div>

        {/* --- FORM FIELDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume Produs</label>
            <input
              required
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              placeholder="ex. Set Pijamale Mătase"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preț (RON/EUR)</label>
            <input
              required
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cod Produs</label>
          <input
            name="cod"
            type="text"
            value={formData.cod}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            placeholder="ex. 12345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descriere</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            placeholder="Descrie produsul..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
          <input
            name="material"
            type="text"
            value={formData.material}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
            placeholder="ex. 100% Bumbac"
          />
        </div>

        {/* --- DYNAMIC SELECTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. GENDER SELECT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gen</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleGenderChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="women">Femei</option>
              <option value="men">Bărbați</option>
            </select>
          </div>

          {/* 2. CATEGORY SELECT (Dependent on Gender) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:border-blue-500 focus:outline-none"
            >
               {/* Default/Placeholder option if nothing is selected yet */}
               {!formData.category && <option value="" disabled>Selectează Categoria</option>}
               
               {availableCategories.map((c) => {
                if(c.slug==="noutati")
                  return null
                else
                  return <option key={c.slug} value={c.slug}>{c.name}</option>
              })}
            </select>
          </div>

          {/* 3. SUB-CATEGORY SELECT (Dependent on Category) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Categorie</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.category || availableSubcategories.length === 0}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">-- Niciuna --</option>
              {availableSubcategories.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
             {formData.category && availableSubcategories.length === 0 && (
                 <p className="text-xs text-gray-500 mt-1">Nu sunt subcategorii disponibile.</p>
             )}
          </div>
        </div>

        {/* --- TOGGLES --- */}
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <input
            id="bigSizes"
            name="bigSizes"
            type="checkbox"
            checked={formData.bigSizes}
            onChange={handleCheckboxChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="bigSizes" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer select-none">
            Disponibil în Mărimi Mari (Plus Size)
          </label>
        </div>

        {/* --- SUBMIT BUTTON --- */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              flex items-center justify-center px-8 py-3 rounded-lg text-white font-medium shadow-sm transition-all
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Se procesează...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-5 w-5" />
                Creează Produs
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}