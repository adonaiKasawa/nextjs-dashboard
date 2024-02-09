import { authSigninUser, refreshAccessToken } from '@/app/lib/actions';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { number, z } from 'zod';
import { jwtDecode } from "jwt-decode";
import moment from 'moment';
import { redirect } from 'next/navigation';

export interface PayloadUserInterface {
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
}

export interface Eglise {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id_eglise: number;
  nom_eglise: string;
  photo_eglise: string;
  couverture_eglise: string;
  sigle_eglise: string;
  adresse_eglise: string;
  ville_eglise: string;
  pays_eglise: string;
  nombrefidel_eglise: string;
  status_eglise: string;
  payement_eglise: boolean;
  programme: Programme[];
}

export interface Programme {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  sousProgramme: any[];
}

export const { auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ telephone: z.string(), password: z.string().min(6) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { telephone, password } = parsedCredentials.data;

          const user = await authSigninUser({ telephone, password });

          if (!user) return null;

          return user;
        }
        console.log('Invalid credentials');
        return null;
      }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      const newUser: any = user
      const time = moment().unix();
      if (user) {
        token.access_token = `${newUser?.access_token}`;
        token.refresh_token = `${newUser?.refresh_token}`;
        console.log("user exist");
      } else {
        if (token) {
          let jwt_decode: PayloadUserInterface = jwtDecode(`${token?.access_token}`);
          if (jwt_decode.exp < time) {
            console.log("token is expired");
            const rt = await refreshAccessToken({ access_token: `${token.access_token}`, refresh_token: `${token.refresh_token}` });
            if (rt) {
              console.log("refresh token in server jwt");
              console.log(rt.access_token);
              token = {
                access_token : rt.access_token,
                refresh_token: rt.refresh_token
              }
              jwt_decode = jwtDecode(`${token?.access_token}`);
              console.log(jwt_decode.exp);
              return token
            }
          }          
          console.log("user is undifined");
        }
      }
      console.log(jwtDecode(`${token?.access_token}`).exp);
      
      return Promise.resolve(token);
    },
    async session({ token, session }) {
      const newSession = session
      const newToken = token
      newSession.user = jwtDecode(`${newToken.access_token}`);
      newSession.token = {
        access_token: `${token.access_token}`,
        refresh_token: `${token.refresh_token}`
      }
      return Promise.resolve(newSession)
    }
  },
  secret: 'at-secret'
});