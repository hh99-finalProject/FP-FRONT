import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getUserName } from '../../api/nickName';
import { useChangeNicknameMutation } from '../../hooks/queries/useChangeNickName';
import { useNavigate } from 'react-router-dom';
import back from '/assets/images/back.svg';

const ChangeNickName: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const { data: currentNickname, isLoading: isFetchingNickname } = useQuery({
    queryKey: ['currentNickname'],
    queryFn: getUserName,
  });

  const mutation = useChangeNicknameMutation();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleBackButton = () => {
    navigate('/mypage');
  };

  const submitNickname = () => {
    mutation.mutate(nickname, {
      onSuccess: () => {
        navigate('/mypage');
      },
    });
  };

  const isLoading = mutation.status === 'pending';

  if (Error instanceof Error) {
    console.error('닉네임을 가져오지 못했습니다 : ', Error.message);
  }

  const placeholder = isFetchingNickname
    ? 'Loading...'
    : currentNickname?.nickname || '새로운 닉네임을 입력하세요';

  return (
    <>
      <Header>
        <BackButton src={back} onClick={handleBackButton} />
        <h1>닉네임 변경</h1>
      </Header>
      <PageContainer>
        <Description>
          <h1>변경하실 닉네임을 입력해주세요</h1>
        </Description>
        <Input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder={placeholder}
        />
        <ButtonWrapper>
          <SubmitButton onClick={submitNickname} disabled={isLoading}>
            {isLoading ? '변경 중...' : '확인'}
          </SubmitButton>
        </ButtonWrapper>
      </PageContainer>
    </>
  );
};

export default ChangeNickName;

const PageContainer = styled.div`
  position: relative;
  top: 10%;
  display: flex;
  flex-direction: column;
  height: 50%;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
`;

const Header = styled.div`
  position: absolute;
  width: 56%;
  top: 3%;
  left: 4%;
  right: 38%;
  display: flex;
  padding-bottom: 25px;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-size: 16px;
    font-weight: bold;
    @media (max-width: 640px) {
      font-size: 1.1rem;
    }
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

export const BackButton = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 10px;

  cursor: pointer;
`;

const Description = styled.div`
  position: relative;

  color: #fff;
  margin: 20px 0;
  h1 {
    font-size: 16px;
    font-weight: 200;
  }
`;

const Input = styled.input`
  position: relative;
  background: #ffffff;
  border-radius: 15px;
  border: none;
  padding: 16px 20px;
  margin-bottom: 20px;
  width: calc(100% - 20px);

  box-shadow:
    0 4px 6px rgba(50, 50, 93, 0.11),
    0 1px 3px rgba(0, 0, 0, 0.08);

  h1 {
    color: #b5b5bd;
    font-size: 14px;
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  width: 90%;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background: ${(props) => (props.disabled ? '#ccc' : '#EEEEEE')};
  color: #000;
  border: none;
  border-radius: 25px;
  padding: 10px 40px;
  font-size: 12px;
  font-weight: 200;
  margin-bottom: 20px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  box-shadow:
    0 4px 6px rgba(50, 50, 93, 0.11),
    0 1px 3px rgba(0, 0, 0, 0.08);

  &:hover {
    background: ${(props) => (props.disabled ? '#ccc' : '#E88439')};
    color: ${(props) => (props.disabled ? '#ccc' : '#fff')};
  }
`;
