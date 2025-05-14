import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
  // baseURL: 'https://musiclesson-scheduling.vercel.app/api',
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('accessToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    const token = Cookies.get('accessToken')
    // Handle expired token (401 Unauthorized)
    if (error.response?.status === 401 && token != null && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await axiosInstance.post('/refresh')
        const newToken = refreshResponse.data.access_token

        Cookies.set('accessToken', refreshResponse.data.access_token, { expires: 14 })
        ;(axiosInstance.defaults.headers as any)['Authorization'] = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        Cookies.remove('accessToken')
        window.location.href = '/'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    return Promise.reject(error)
  },
)

export default axiosInstance
