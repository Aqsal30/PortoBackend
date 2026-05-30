import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem.id === item.id
                  ? {
                      ...cartItem,
                      quantity:
                        cartItem.quantity + item.quantity,
                    }
                  : cartItem
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...item,
              },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.id !== id
          ),
        })),
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;