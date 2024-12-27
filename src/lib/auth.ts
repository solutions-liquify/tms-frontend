interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export const authService = {
  setTokens(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  },

  getAccessToken() {
    return localStorage.getItem('accessToken')
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
