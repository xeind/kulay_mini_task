import React, { createContext, useReducer, useMemo, ReactNode } from "react";
import { CartItem, Product, CartContextType } from "../types";

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

interface CartState {
  items: CartItem[];
  lastAddedItem: Product | null;
  lastRemovedItem: Product | null;
}

const initialState: CartState = {
  items: [],
  lastAddedItem: null,
  lastRemovedItem: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id,
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return {
          items: updatedItems,
          lastAddedItem: product,
          lastRemovedItem: null,
        };
      }

      const newItem: CartItem = { ...product, quantity: 1 };
      return {
        items: [...state.items, newItem],
        lastAddedItem: product,
        lastRemovedItem: null,
      };
    }

    case "REMOVE_ITEM": {
      const productId = action.payload;
      const removedItem = state.items.find((item) => item.id === productId);
      return {
        items: state.items.filter((item) => item.id !== productId),
        lastAddedItem: null,
        lastRemovedItem: removedItem || null,
      };
    }

    case "CLEAR_CART": {
      return { items: [], lastAddedItem: null, lastRemovedItem: null };
    }

    default:
      return state;
  }
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const total = useMemo(() => {
    return state.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [state.items]);

  const itemCount = useMemo(() => {
    return state.items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  }, [state.items]);

  const value: CartContextType = {
    items: state.items,
    addItem,
    removeItem,
    clearCart,
    total,
    itemCount,
    lastAddedItem: state.lastAddedItem,
    lastRemovedItem: state.lastRemovedItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
