import { instance } from './userApi';

interface LoginResponse {
  status: number;
  data: {
    grantType: string;
    accessToken: string;
    refreshToken: string;
    email: string;
    name: string;
  };
  success: boolean;
}

export const GetLogin = async (id: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await instance.post('auth/sign-in', {
      email: id,
      password: password,
    });
    
    return response.data;
  } catch (err) {
    throw err;
  }
};
