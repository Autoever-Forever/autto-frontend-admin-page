import axios from 'axios';
import useAuth from '../states/Variable';

export const baseUrl = 'http://localhost:8084';

export const instance = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true  // CORS 요청에 쿠키 포함
});

instance.interceptors.request.use(
    (config) => {
        const token = useAuth.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request Headers:', config.headers); // 디버깅용
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 인증 만료일 때만 로그아웃
        if (error.response?.status === 401) {
            useAuth.getState().clearAuth();
            window.location.href = '/login';
        }
        // 403은 권한 부족이므로 로그아웃하지 않고 에러만 전달
        return Promise.reject(error);
    }
);

// 상품 등록 API
export const registerProduct = async (formData: FormData) => {
    try {
        const token = useAuth.getState().token;
        console.log('Using token:', token); // 디버깅용
        
        const response = await instance.post('/admin/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Register Product Error:', error);
        throw error;
    }
};

// 상품 목록 조회 API (필요한 경우)
export const getProducts = async () => {
    try {
        const response = await instance.get('/admin/products');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 상품 상세 조회 API (필요한 경우)
export const getProductDetail = async (productId: string) => {
    try {
        const response = await instance.get(`/admin/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 상품 수정 API (필요한 경우)
export const updateProduct = async (productId: string, formData: FormData) => {
    try {
        const response = await instance.put(`/admin/product/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 상품 삭제 API (필요한 경우)
export const deleteProduct = async (productId: string) => {
    try {
        const response = await instance.delete(`/admin/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
