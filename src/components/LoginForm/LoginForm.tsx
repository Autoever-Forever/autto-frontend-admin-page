import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonWrapper,
  Form,
  Input,
  Label,
  SubTitle,
  Wrapper,
  ErrorText
} from './LoginFormStyle';
import { GetLogin } from '../../api/GetLogin';
import useAuth from '../../states/Variable';

function LoginForm() {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { setToken, setUserEmail, setUserName } = useAuth();

  const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');

    if (!id || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (!emailRegExp.test(id)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      const response = await GetLogin(id, password);
      console.log('Login response:', response);
      
      if (response.success) {
        setToken(response.data.accessToken);
        setUserEmail(response.data.email);
        setUserName(response.data.name);
        console.log('Token set, navigating to register');
        navigate('/register');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <Wrapper>
      <SubTitle>
        만나서 반가워요! 멋진 공연이 기다리고 있어요.
        <br />
        로그인 후 다양한 공연을 관람해보세요!
      </SubTitle>
      <Form>
        <Label>아이디</Label>
        <Input 
          placeholder="이메일을 입력하세요" 
          value={id}
          onChange={(e) => setId(e.target.value)} 
        />
        
        <Label>비밀번호</Label>
        <Input
          placeholder="비밀번호를 입력하세요"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleLogin(e as any);
            }
          }}
        />
        
        {error && <ErrorText>{error}</ErrorText>}
        
        <ButtonWrapper>
          <Button onClick={handleLogin}>로그인</Button>
        </ButtonWrapper>
      </Form>
    </Wrapper>
  );
}

export default LoginForm;
