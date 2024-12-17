import axios from 'axios' 

// Conexão com o backend
const api = axios.create({
    baseURL: 'https://user-register-backend.vercel.app',
})

export default api