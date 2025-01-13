const axios = require('axios')
const config = require('./config')

class AuthManager {
    constructor() {
        this.session = null
        this.cookies = null
    }

    async login() {
        try {
            const response = await axios.post(`${config.baseUrl}/login`, {
                username: config.credentials.username,
                password: config.credentials.password
            }, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            
            this.cookies = response.headers['set-cookie']
            this.session = true
            return true
        } catch (error) {
            console.error('Login failed:', error)
            return false
        }
    }

    getCookies() {
        return this.cookies
    }

    isLoggedIn() {
        return this.session === true
    }
}

module.exports = new AuthManager()
