import React, { createContext, useReducer, useMemo, ReactNode } from "react";
import { CartItem, Product, CartContextType } from "../types";

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "INCREMENT_QUANTITY"; payload: string }
  | { type: "DECREMENT_QUANTITY"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_VOUCHER"; payload: string };

interface CartState {
  items: CartItem[];
  lastAddedItem: Product | null;
  lastRemovedItem: Product | null;
  voucherCode: string | null;
  discount: number;
}

const initialState: CartState = {
  items: [],
  lastAddedItem: null,
  lastRemovedItem: null,
  voucherCode: null,
  discount: 0,
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
          ...state,
          items: updatedItems,
          lastAddedItem: product,
          lastRemovedItem: null,
        };
      }

      const newItem: CartItem = { ...product, quantity: 1 };
      return {
        ...state,
        items: [...state.items, newItem],
        lastAddedItem: product,
        lastRemovedItem: null,
      };
    }

    case "REMOVE_ITEM": {
      const productId = action.payload;
      const removedItem = state.items.find((item) => item.id === productId);
      return {
        ...state,
        items: state.items.filter((item) => item.id !== productId),
        lastAddedItem: null,
        lastRemovedItem: removedItem || null,
      };
    }

    case "INCREMENT_QUANTITY": {
      const productId = action.payload;
      const updatedItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      );

      return {
        ...state,
        items: updatedItems,
        lastRemovedItem: null,
      };
    }

    case "DECREMENT_QUANTITY": {
      const productId = action.payload;
      const item = state.items.find((i) => i.id === productId);

      if (item && item.quantity === 1) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== productId),
          lastAddedItem: null,
          lastRemovedItem: item,
        };
      }

      const updatedItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
      );

      return {
        ...state,
        items: updatedItems,
        lastAddedItem: null,
        lastRemovedItem: null,
      };
    }

    case "CLEAR_CART": {
      return {
        items: [],
        lastAddedItem: null,
        lastRemovedItem: null,
        voucherCode: null,
        discount: 0,
      };
    }

    case "APPLY_VOUCHER": {
      const code = action.payload.toLowerCase();
      if (code === "discount10") {
        return {
          ...state,
          voucherCode: code,
          discount: 0.1,
        };
      }
      return state;
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

  const incrementQuantity = (productId: string) => {
    dispatch({ type: "INCREMENT_QUANTITY", payload: productId });
  };

  const decrementQuantity = (productId: string) => {
    dispatch({ type: "DECREMENT_QUANTITY", payload: productId });
  };

  const applyVoucher = (code: string): boolean => {
    const normalizedCode = code.toLowerCase();
    if (normalizedCode === "discount10") {
      dispatch({ type: "APPLY_VOUCHER", payload: normalizedCode });
      return true;
    }
    return false;
  };

  const total = useMemo(() => {
    return state.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [state.items]);

  const finalTotal = useMemo(() => {
    return total * (1 - state.discount);
  }, [total, state.discount]);

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
    incrementQuantity,
    decrementQuantity,
    applyVoucher,
    discount: state.discount,
    voucherCode: state.voucherCode,
    finalTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
