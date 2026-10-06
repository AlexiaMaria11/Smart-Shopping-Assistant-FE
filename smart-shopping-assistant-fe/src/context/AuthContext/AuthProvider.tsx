import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { authApi } from "../../api/clients/AuthApiClient";
import { setAuthToken, setUnauthorizedHandler } from "../../api/base/http";
import type {
  AuthResponseModel,
  LoginInput,
  RegisterInput,
  Role,
  SellerRegisterInput,
  UserModel,
} from "../../api/models/AuthModel";
import { AuthContext } from "./auth-context";

const STORAGE_KEY = "ssa.auth";

interface Session {
  token: string;
  expiresAt: string;
  user: UserModel;
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (new Date(session.expiresAt) <= new Date()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Set before any child component sends a request
    setAuthToken(session.token);
    return session;
  } catch {
    return null;
  }
}

function saveSession(session: Session | null) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode); the session then lasts until reload
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [signedOutFrom, setSignedOutFrom] = useState<string | null>(null);
  const { pathname } = useLocation();

  const applySession = useCallback((next: Session | null) => {
    setAuthToken(next?.token ?? null);
    saveSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    setSignedOutFrom(pathname);
    applySession(null);
  }, [applySession, pathname]);
  const expireSession = useCallback(() => applySession(null), [applySession]);

  function startSession(response: AuthResponseModel): UserModel {
    setSignedOutFrom(null);
    applySession({
      token: response.token,
      expiresAt: response.expiresAt,
      user: response.user,
    });
    return response.user;
  }

  // The company status can change (admin approval) while the user is signed in
  const refreshUser = useCallback(async () => {
    if (!session) return;
    const user = await authApi.me();
    applySession({ ...session, user });
  }, [session, applySession]);

  useEffect(() => {
    setUnauthorizedHandler(expireSession);
    return () => setUnauthorizedHandler(null);
  }, [expireSession]);

  const sessionToken = session?.token;
  useEffect(() => {
    if (!sessionToken) return;
    authApi
      .me()
      .then((user) =>
        setSession((current) => {
          if (!current) return current;
          const next = { ...current, user };
          saveSession(next);
          return next;
        }),
      )
      .catch(() => {});
  }, [sessionToken]);

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        signedOutFrom,
        hasRole: (...roles: Role[]) => user !== null && roles.includes(user.role),
        login: async (data: LoginInput) => startSession(await authApi.login(data)),
        register: async (data: RegisterInput) =>
          startSession(await authApi.register(data)),
        registerSeller: async (data: SellerRegisterInput) =>
          startSession(await authApi.registerSeller(data)),
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
