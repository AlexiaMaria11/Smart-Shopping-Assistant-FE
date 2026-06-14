import { createContext, useContext } from "react";

interface FavoritesContextValue {
  favorites: Set<number>;
  isFavorite: (productId: number) => boolean;
  toggle: (productId: number) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: new Set(),
  isFavorite: () => false,
  toggle: () => {},
});

export function useFavorites() {
  return useContext(FavoritesContext);
}
