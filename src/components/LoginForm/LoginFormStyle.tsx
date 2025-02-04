import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const SubTitle = styled.div`
  font-size: 1rem;
  color: var(--main-blue);
  line-height: 1.5rem;
  text-align: center;
  font-weight: 700;
`;

export const Form = styled.div`
  border: solid 1px black;
  margin: 1rem;
  padding: 2rem;
  min-width: 25rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const Label = styled.label`
  font-size: 1.3rem;
  font-weight: bold;
  padding: 2rem 0 1rem 0;
  text-align: left;
`;

export const Input = styled.input`
  border: solid 1px black;
  border-radius: 2px;
  border-bottom: solid 2px var(--text-grey);
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2rem 0;
`;

export const Button = styled.button`
  border-radius: 5px;
  border: none;
  background-color: var(--main-blue);
  color: var(--text-white);
  font-size: 1rem;
  padding: 1rem 3rem;
  cursor: pointer;
`;

export const ErrorText = styled.text`
  color: red;
  margin-top: 1rem;
`;