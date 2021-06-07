import React, { createContext, useContext, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import Router from "next/router";

import * as auth from "../services/auth";
import api from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadStoragedUser() {
      const { "eventme.token": token } = parseCookies();
      if (token) {
        const user = await auth.recoveryUserData(token);
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
        setUser(user);
        Router.push("/schedule");
      }
    }
    loadStoragedUser();
  }, []);

  async function signIn(data) {
    const { email, password } = data;
    const { token, user } = await auth.signInRequest({ email, password });
    setCookie(undefined, "eventme.token", token, {
      maxAge: 86400, // 1 day
    });

    setUser(user);
    Router.push("/schedule");
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  async function signOut() {
    destroyCookie(null, "eventme.token");
    setUser(null);
    Router.push("/");
    api.defaults.headers["Authorization"] = "";
  }

  async function signUp(data) {
    const { name, email, password } = data;
    const { token, user } = await auth.signUpRequest({ name, email, password });
    setCookie(undefined, "eventme.token", token, {
      maxAge: 86400, // 1 day
    });

    setUser(user);
    Router.push("/schedule");
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }
  return (
    <AuthContext.Provider
      value={{ signed: !!user, signIn, signUp, signOut, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
