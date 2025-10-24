import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addProduct, uploadProductImage } from "@/lib/firebaseService";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Hoodies",
    sizes: [] as string[],
    stock: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      toast.error("Please login to access this page");
      navigate("/admin-login");
    }
  }, [navigate]);

  const categories = ["Hoodies", "Shirts", "Track Pants", "Trouser", "Other"];
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
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('Image uploaded successfully');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    toast.info('Image removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (Number(formData.stock) < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    if (!imageFile && !imagePreview) {
      toast.error("Please upload a product image");
      return;
    }

    setLoading(true);

    try {
      // Upload image to Firebase Storage
      let imageUrl = imagePreview || "";
      
      if (imageFile) {
        toast.info("Uploading image...");
        imageUrl = await uploadProductImage(imageFile, formData.name);
      }

      // Add product to Firestore
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        sizes: formData.sizes,
        stock: Number(formData.stock),
        description: formData.description,
        image: imageUrl,
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
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
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
                Product Image <span className="text-red-500">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="bg-muted/20 p-4 rounded-full">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative border-2 border-border rounded-lg p-4">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="absolute top-6 right-6"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                  {imageFile && (
                    <p className="text-xs text-muted-foreground mt-2">
                      File: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
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

            {/* Preview */}
            {formData.name && (
              <div className="bg-muted/20 p-4 rounded-lg border border-border">
                <h3 className="font-semibold mb-2 text-sm">Preview</h3>
                <div className="flex gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-border"
                    />
                  )}
                  <div className="space-y-1 text-sm flex-1">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Price:</strong> PKR {formData.price || "0.00"}</p>
                    <p><strong>Stock:</strong> {formData.stock || "0"} units</p>
                    <p><strong>Sizes:</strong> {formData.sizes.join(", ") || "None selected"}</p>
                  </div>
                </div>
              </div>
            )}

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
                  if (formData.name || formData.price || formData.stock) {
                    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
                      navigate("/admin");
                    }
                  } else {
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
