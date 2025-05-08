"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [uniqueProductCount, setUniqueProductCount] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      updateCartCounts(parsedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateCartCounts = (items) => {
    // Total quantity of all items (for cart page)
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    
    // Count of unique products (for notification badge)
    const uniqueProducts = new Set(items.map(item => item._id));
    const uniqueCount = uniqueProducts.size;

    setCartCount(totalQuantity);
    setUniqueProductCount(uniqueCount);
  };

  const addToCart = (product, size, quantity) => {
    // Extract just the size value if size is an object
    const sizeValue = typeof size === 'object' ? size.size : size;
    
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.size === sizeValue
    );
  
    let updatedCart;
    if (existingItemIndex >= 0) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += quantity;
      toast.success(`Quantity updated in cart!`);
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: product?._id,
          title: product?.name || product?.title, // Handle both cases
          price: product.price,
          image: product?.images?.[0] || product?.image, // Handle both cases
          size: sizeValue, // Store just the size value
          quantity
        }
      ];
      toast.success(`${product.name || product.title} (Size: ${sizeValue}) added to cart!`);
    }
  
    setCartItems(updatedCart);
    updateCartCounts(updatedCart);
  };
  

  const removeFromCart = (productId, size) => {
    const updatedCart = cartItems.filter(
      item => !(item._id === productId && item.size === size)
    );
    setCartItems(updatedCart);
    updateCartCounts(updatedCart);
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === productId && item.size === size 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    setCartItems(updatedCart);
    updateCartCounts(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    setUniqueProductCount(0);
    // toast.info('Cart cleared');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, // Total quantity of all items
      uniqueProductCount, // Count of unique products (for notification)
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}