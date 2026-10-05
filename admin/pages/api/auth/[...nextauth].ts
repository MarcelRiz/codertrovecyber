import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&response_type=code',
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async signIn(user, account, profile) {
      if (
        account.provider === 'google' &&
        profile.verified_email === true
        // && profile.email.endsWith('@example.com')
      ) {
        return true
      }
      return false
    },
    session: async (session, user) => {
      const res = {
        ...session,
        jwt: user.jwt,
        id: user.id,
      }
      return Promise.resolve(res)
    },
    redirect: async () => `${process.env.NEXT_PUBLIC_API_URL}/connect/google`,
    jwt: async (token, user, account) => {
      const isSignIn = !!user
      let responseToken = token
      if (isSignIn) {
        const environment = process.env.NODE_ENV
        const internalApiUrl = process.env.NEXT_PUBLIC_INTERNAL_API_URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        const requestUrl =
          environment === 'production' && internalApiUrl
            ? internalApiUrl
            : apiUrl

        const response = await fetch(
          `${requestUrl}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
        )
        const data = await response.json()
        responseToken = {
          ...token,
          jwt: data.jwt,
          id: data.user.id,
        }
      }
      return Promise.resolve(responseToken)
    },
  },
}

const Auth = (req, res) => NextAuth(req, res, options)

export default Auth
