import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  addProduct, 
  getAllCategories, 
  addCategory, 
  Category
} from "@/lib/firebaseService";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    sizes: [] as string[],
    stock: "",
    description: "",
    featured: "none" as "best-selling" | "trending-now" | "none",
  });
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      toast.error("Please login to access this page");
      navigate("/admin-login");
    }
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") {
      toast.error("Category name cannot be empty.");
      return;
    }
    try {
      const newCategoryId = await addCategory(newCategory.trim());
      setCategories([...categories, { id: newCategoryId, name: newCategory.trim() }]);
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory("");
      toast.success(`Category '${newCategory.trim()}' added successfully.`);
    } catch (error) {
      toast.error("Failed to add category.");
    }
  };

  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (images.length + files.length > 4) {
        toast.error("You can upload a maximum of 4 images.");
        return;
      }
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          toast.error('Please upload only image files.');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB.');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prevImages => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    toast.info('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.stock || !formData.category) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (formData.sizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }
    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }
    if (Number(formData.stock) < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        sizes: formData.sizes,
        stock: Number(formData.stock),
        description: formData.description,
        featured: formData.featured,
        images: images,
      };

      await addProduct(productData);
      
      toast.success(`${formData.name} added successfully!`);
      
      setTimeout(() => {
        navigate("/admin");
      }, 1000);

    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-muted/10">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">Fill in the details to add a new product to your store</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl bg-background p-8 rounded-xl shadow-sm border border-border space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium Cotton T-Shirt"
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required>
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <input 
                    type="text" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)} 
                    placeholder="Or add new category"
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <Button type="button" onClick={handleAddCategory}>Add</Button>
              </div>
            </div>

            {/* Featured Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Featured Section
              </label>
              <select
                value={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.value as "best-selling" | "trending-now" | "none" })}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="none">None</option>
                <option value="best-selling">Best Selling</option>
                <option value="trending-now">Trending Now</option>
              </select>
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (PKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Available Sizes <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-6 py-2 rounded-lg border-2 font-medium transition-all ${
                      formData.sizes.includes(size)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Images (up to 4) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((image, index) => (
                      <div key={index} className="relative">
                          <img src={image} alt={`preview ${index}`} className="w-full h-32 object-cover rounded-lg"/>
                          <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2">
                              <X className="h-4 w-4" />
                          </Button>
                      </div>
                  ))}
              </div>
              {images.length < 4 && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="bg-muted/20 p-4 rounded-full">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Click to upload images</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description..."
                rows={4}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
                    navigate("/admin");
                  }
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
