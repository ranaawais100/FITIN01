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
  setDoc,
  where
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db } from './firebase';

// Initialize Cloud Storage
const storage = getStorage();

export type Product = {
  id?: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  stock: number;
  description?: string;
  images: string[];
  featured?: 'best-selling' | 'trending-now' | 'none';
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

export type Category = {
    id?: string;
    name: string;
};

// Collection References
const productsCollection = collection(db, 'products');
const ordersCollection = collection(db, 'orders');
const usersCollection = collection(db, 'users');
const categoriesCollection = collection(db, 'categories');

// ============ IMAGE UPLOAD SERVICE ============

/**
 * Uploads a base64 encoded image to Firebase Storage and returns the URL.
 */
export async function uploadImage(base64Image: string, productId: string): Promise<string> {
  try {
    const storageRef = ref(storage, `products/${productId}/${Date.now()}`);
    await uploadString(storageRef, base64Image, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}


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

/**
 * Make a user an admin by email
 */
export async function makeUserAdmin(email: string): Promise<void> {
  try {
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`User with email ${email} not found`);
    }

    querySnapshot.forEach(async (userDoc) => {
      const userRef = doc(db, 'users', userDoc.id);
      await updateDoc(userRef, { role: 'admin' });
    });
  } catch (error) {
    console.error('Error making user admin:', error);
    throw error;
  }
}

// ============ CATEGORY SERVICES ============

/**
 * Get all categories from Firestore
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    const q = query(categoriesCollection, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const categories: Category[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      } as Category);
    });
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

/**
 * Add a new category to Firestore
 */
export async function addCategory(categoryName: string): Promise<string> {
    try {
        const q = query(categoriesCollection, where("name", "==", categoryName));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
        }
        const docRef = await addDoc(categoriesCollection, { name: categoryName });
        return docRef.id;
    } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Failed to add category');
    }
}

// ============ PRODUCT SERVICES ============

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
 * Get a single product by ID from Firestore
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw new Error('Failed to fetch product');
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
 * Get featured products from Firestore
 */
export async function getFeaturedProducts(featuredType: 'best-selling' | 'trending-now'): Promise<Product[]> {
  try {
    const q = query(productsCollection, where('featured', '==', featuredType), orderBy('createdAt', 'desc'));
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
    console.error(`Error getting ${featuredType} products:`, error);
    throw new Error(`Failed to fetch ${featuredType} products`);
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
