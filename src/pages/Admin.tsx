import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  X,
  Loader2,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import { 
  getAllProducts, 
  getAllOrders, 
  updateProduct, 
  deleteProduct as deleteProductFromFirebase,
  updateOrderStatus as updateOrderStatusInFirebase,
  checkAdminStatus,
  type Product,
  type Order
} from "@/lib/firebaseService";
import { onAuthStateChange, signOutUser } from "@/lib/authService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Check authentication and admin status on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated) {
      loadData(); 
    } else {
      const unsubscribe = onAuthStateChange(async (user) => {
        if (user) {
          const isAdmin = await checkAdminStatus(user.uid);
          if (isAdmin) {
            localStorage.setItem("adminAuthenticated", "true");
            loadData();
          } else {
            toast.error("Access denied. Admin privileges required.");
            await signOutUser();
            navigate("/admin-login");
          }
        } else {
          toast.error("Please login to access admin dashboard");
          navigate("/admin-login");
        }
      });
      return () => unsubscribe();
    }
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData] = await Promise.all([
        getAllProducts(),
        getAllOrders()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data from Firebase');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCustomers: new Set(orders.map(o => o.email)).size,
  };

  const handleDeleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (window.confirm(`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`)) {
      try {
        await deleteProductFromFirebase(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success(`"${product?.name}" deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleViewProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
    toast.info(`Viewing ${product.name}`);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
    toast.info(`Editing ${product.name}`);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      if (updatedProduct.id) {
        await updateProduct(updatedProduct.id, updatedProduct);
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setIsEditModalOpen(false);
        setEditingProduct(null);
        toast.success(`${updatedProduct.name} updated successfully`);
      }
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrderStatusInFirebase(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    toast.info(`Viewing order #${order.id}`);
  };

  const handleCloseOrderView = () => {
    setViewingOrder(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-muted/10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your store, products, and orders</p>
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await signOutUser();
                  localStorage.removeItem("adminAuthenticated");
                  localStorage.removeItem("adminEmail");
                  localStorage.removeItem("adminId");
                  toast.success("Logged out successfully");
                  navigate("/admin-login");
                } catch (error) {
                  toast.error("Error logging out");
                }
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "dashboard"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "products"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "orders"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Orders
            </button>
          </div>

          {/* Dashboard Tab - Fixed JSX structure */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
                </div>
              ) : (
                <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold">PKR {stats.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +12% from last month
                  </p>
                </div>

                <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
                </div>

                <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">In inventory</p>
                </div>

                <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Customers</p>
                      <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Active users</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-muted/10">
                          <td className="py-3 px-2">#{order.id}</td>
                          <td className="py-3 px-2">{order.customer}</td>
                          <td className="py-3 px-2">PKR {order.total.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === "delivered" ? "bg-green-100 text-green-700" :
                              order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                              order.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </>
            )}
          </div>
        )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <Button onClick={() => navigate("/admin/add-product")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium">Product</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Price</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Stock</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Sizes</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-muted/10">
                          <td className="py-4 px-4 font-medium">{product.name}</td>
                          <td className="py-4 px-4">{product.category}</td>
                          <td className="py-4 px-4">PKR {product.price.toFixed(2)}</td>
                          <td className="py-4 px-4">
                            <span className={`${product.stock < 20 ? "text-red-600" : "text-green-600"}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-4 px-4">{product.sizes.join(", ")}</td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewProduct(product)}
                                title="View Product"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditProduct(product)}
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Order Management</h2>

              <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/20">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Items</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-muted/10">
                          <td className="py-4 px-4 font-medium">#{order.id}</td>
                          <td className="py-4 px-4">{order.customer}</td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{order.email}</td>
                          <td className="py-4 px-4">{order.items}</td>
                          <td className="py-4 px-4 font-medium">PKR {order.total.toFixed(2)}</td>
                          <td className="py-4 px-4 text-sm">{order.date}</td>
                          <td className="py-4 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order["status"])}
                              className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${
                                order.status === "delivered" ? "bg-green-100 text-green-700" :
                                order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                                order.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewOrder(order)}
                                title="View Order Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Edit/View Modal */}
        {isEditModalOpen && editingProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsEditModalOpen(false)}>
            <div className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Product Details</h2>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                   {editingProduct.image && (
                    <img src={editingProduct.image} alt={editingProduct.name} className="w-full h-64 object-cover rounded-lg" />
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full p-2 border border-border rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (PKR)</label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full p-2 border border-border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stock</label>
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full p-2 border border-border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full p-2 border border-border rounded"
                    >
                      <option>Hoodies</option>
                      <option>Shirts</option>
                      <option>Track Pants</option>
                      <option>Trouser</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sizes</label>
                    <p className="text-sm text-muted-foreground">{editingProduct.sizes.join(", ")}</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => handleUpdateProduct(editingProduct)} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order View Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseOrderView}>
            <div className="bg-background rounded-xl shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <Button variant="ghost" size="sm" onClick={handleCloseOrderView}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-semibold">#{viewingOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{viewingOrder.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-semibold">{viewingOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{viewingOrder.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="font-semibold">{viewingOrder.items}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-semibold">PKR {viewingOrder.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Order Status</p>
                    <span className={`px-3 py-1 rounded text-sm font-medium inline-block ${
                      viewingOrder.status === "delivered" ? "bg-green-100 text-green-700" :
                      viewingOrder.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      viewingOrder.status === "processing" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {viewingOrder.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <Button onClick={handleCloseOrderView} className="w-full">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
