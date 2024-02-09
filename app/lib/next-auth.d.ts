import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { Eglise, PayloadUserInterface } from "../api/auth/[...nextauth]";

declare module "next-auth" {
  interface Session {
    user: {
      sub: number;
      nom: string;
      prenom: string;
      telephone: string;
      email: string;
      username: null;
      privilege_user: string;
      eglise: Eglise;
      ville: string;
      pays: string;
      adresse: string;
      iat: number;
      exp: number;
    },
    token: {
      access_token: string,
      refresh_token: string
    }
  }


}


declare module "next-auth/jwt" {

  interface JWT {
    user: {
      sub: number;
      nom: string;
      prenom: string;
      telephone: string;
      email: string;
      username: null;
      privilege_user: string;
      eglise: Eglise;
      ville: string;
      pays: string;
      adresse: string;
      iat: number;
      exp: number;
    },
    token: {
      access_token: string
      refresh_token: string
    }
  }
}
