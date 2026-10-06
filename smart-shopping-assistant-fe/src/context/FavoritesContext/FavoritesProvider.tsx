import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { favoritesApi } from "../../api/clients/FavoritesApiClient";
import { useAuth } from "../AuthContext/auth-context";
import { FavoritesContext } from "./favorites-context";

interface UserFavorites {
  userId: number;
  ids: Set<number>;
}

const EMPTY = new Set<number>();

function FavoritesProvider({ children }: { children: ReactNode }) {
  const [userFavorites, setUserFavorites] = useState<UserFavorites | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?.id ?? null;
  const favorites =
    userFavorites !== null && userFavorites.userId === userId
      ? userFavorites.ids
      : EMPTY;

  useEffect(() => {
    if (userId === null) return;
    favoritesApi
      .getIds()
      .then((ids) => setUserFavorites({ userId, ids: new Set(ids) }))
      .catch(() => {});
  }, [userId]);

  function setIds(update: (ids: Set<number>) => Set<number>) {
    if (userId === null) return;
    setUserFavorites((prev) => ({
      userId,
      ids: update(prev !== null && prev.userId === userId ? prev.ids : EMPTY),
    }));
  }

  function toggle(productId: number) {
    if (userId === null) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const wasFavorite = favorites.has(productId);
    // Update right away and roll back if the server refuses
    setIds((ids) => {
      const next = new Set(ids);
      if (wasFavorite) next.delete(productId);
      else next.add(productId);
      return next;
    });

    const request = wasFavorite
      ? favoritesApi.remove(productId)
      : favoritesApi.add(productId);
    request.catch(() =>
      setIds((ids) => {
        const next = new Set(ids);
        if (wasFavorite) next.add(productId);
        else next.delete(productId);
        return next;
      }),
    );
  }

  function isFavorite(productId: number) {
    return favorites.has(productId);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesProvider;
