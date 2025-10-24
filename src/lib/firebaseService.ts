import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export type Product = {
  id?: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  stock: number;
  description?: string;
  image: string;
  createdAt?: Date | Timestamp;
};

export type Order = {
  id?: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
  date: string;
  createdAt?: Date | Timestamp;
};

// Products Collection Reference
const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');
const usersCollection = collection(db, 'users');

// ============ USER/ADMIN SERVICES ============

/**
 * Create or update user profile in Firestore
 */
export async function createUserProfile(
  userId: string, 
  userData: {
    email: string;
    name?: string;
    role?: 'user' | 'admin';
  }
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      role: userData.role || 'user',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<Record<string, unknown> | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

/**
 * Check if user is an admin
 */
export async function checkAdminStatus(userId: string): Promise<boolean> {
  try {
    const userProfile = await getUserProfile(userId);
    return userProfile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// ============ PRODUCT SERVICES ============

/**
 * Upload product image to Firebase Storage
 */
export async function uploadProductImage(file: File, productName: string): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `products/${timestamp}-${productName.replace(/\s+/g, '-')}.${file.name.split('.').pop()}`;
    
    // Create storage reference
    const storageRef = ref(storage, filename);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Add a new product to Firestore
 */
export async function addProduct(productData: Omit<Product, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
}

/**
 * Get all products from Firestore
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Update a product in Firestore
 */
export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updates);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// ============ ORDER SERVICES ============

/**
 * Add a new order to Firestore
 */
export async function addOrder(orderData: Omit<Order, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding order:', error);
    throw new Error('Failed to add order');
  }
}

/**
 * Get all orders from Firestore
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(ordersCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
}

/**
 * Delete an order from Firestore
 */
export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
}
