import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        try {
          const res = await fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          const data = await res.json()

          if (res.ok && data) {
            // [Debug Log] 
            console.log(`[NextAuth] Authorize successful for user: ${credentials.email}`);
            
            return {
              id: data.user?.id || null,
              name: data.user?.name || null,
              email: data.user?.email || credentials.email,
              role: data.user?.role || null,
              access_token: data.token,
            }
          }

          console.log(`[NextAuth] Authorize failed. Status: ${res.status}`);
          return null
        } catch (error) {
          console.error(`[NextAuth] Authorize error: ${error.message}`);
          return null
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token || user.accessToken || null
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
      return token
    },

    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      return session
    }
  },

  pages: {
    signIn: "/login"
  },

  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }