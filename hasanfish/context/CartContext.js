import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === product.name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productName) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.name !== productName)
    );
  };

  const clearCart = () => setCartItems([]);
  // Ürünün miktarını 1 arttırır
  const increaseQuantity = (productName) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === productName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Ürünün miktarını 1 azaltır, 1'in altına düşerse ürünü sepetten çıkarır
  const decreaseQuantity = (productName) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.name === productName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        decreaseQuantity,
        increaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
