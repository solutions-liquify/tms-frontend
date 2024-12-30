import { redirect } from 'next/navigation'
import { refreshUserToken } from './actions'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const authService = {
  setTokens(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  },

  isTokenExpired(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = payload.exp * 1000
      return Date.now() > expiry
    } catch {
      return true
    }
  },

  async getAccessToken() {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && !this.isTokenExpired(accessToken)) {
      return accessToken
    } else {
      console.log('accessToken expired')
    }

    try {
      const refreshToken = this.getRefreshToken()
      if (refreshToken) {
        const newTokens = await refreshUserToken({ refreshToken })
        this.setTokens(newTokens)
        return newTokens.accessToken
      }
    } catch {
      this.clearTokens()
      redirect('/')
    }

    return null
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  },

  clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  isLoggedIn() {
    return !!this.getAccessToken()
  },
}
