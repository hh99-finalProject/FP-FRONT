import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { myWorries, yourWorries } from '../../api/pastContentApi';
import PastContentsList from './PastContentsList';

interface worryList {
  worryId: number;
  icon: string;
  content: string;
  createdAt: Date;
}

function PastContents() {
  const [myWorryList, setMyWorryList] = useState<worryList[]>([]);
  const [yourWorryList, setYourWorryList] = useState<worryList[]>([]);
  const [whoseContent, setWhoseContent] = useState('mySolvedWorry');

  const [isPageEnd, setIsPageEnd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pageIndexRef = useRef<number>(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const getList = useCallback(async () => {
    if (isPageEnd || isLoading) return;
    setIsLoading(true);
    try {
      const response =
        whoseContent === 'mySolvedWorry'
          ? await myWorries(pageIndexRef.current)
          : await yourWorries(pageIndexRef.current);
      if (response) {
        if (whoseContent === 'mySolvedWorry') {
          setMyWorryList((prev) => [...prev, ...response]);
        } else {
          setYourWorryList((prev) => [...prev, ...response]);
        }
        setIsPageEnd(response.length < 10);
        pageIndexRef.current++;
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }, [isLoading, isPageEnd, whoseContent]);

  const handleObserver = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && !isPageEnd && !isLoading) {
        getList();
      }
    },
    [getList, isPageEnd, isLoading],
  );

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const option = {
      root: null,
      rootMargin: '30px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  const onClickWorries = async (whoseContentValue: string) => {
    setWhoseContent(whoseContentValue);
    pageIndexRef.current = 0;
    setIsPageEnd(false);
    setIsLoading(true);
    try {
      const response = await (
        whoseContentValue === 'mySolvedWorry' ? myWorries : yourWorries
      )(pageIndexRef.current);
      if (response) {
        if (whoseContentValue === 'mySolvedWorry') {
          setMyWorryList(response);
        } else {
          setYourWorryList(response);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <LockerTitle>
        <h1>보관함</h1>
      </LockerTitle>
      <LockerTabWrap>
        <Button
          className={whoseContent === 'mySolvedWorry' ? 'active' : ''}
          onClick={() => onClickWorries('mySolvedWorry')}
        >
          나의 고민
        </Button>
        <Button
          className={whoseContent === 'myHelpedSolvedWorry' ? 'active' : ''}
          onClick={() => onClickWorries('myHelpedSolvedWorry')}
        >
          익명의 고민
        </Button>
      </LockerTabWrap>
      <PastContentsList
        listsSelect={
          whoseContent === 'mySolvedWorry' ? myWorryList : yourWorryList
        }
        whoseContent={whoseContent}
        ref={loadMoreRef}
      />
    </div>
  );
}

export default PastContents;

const Button = styled.button`
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  padding-bottom: 10px;
  color: #767676;
  width: 50%;
  border-bottom: 2px solid #767676;

  &:hover {
    color: #2f2f2f;
    border-bottom: 2px solid #2f2f2f;
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid #2f2f2f;
  }

  &.active {
    color: #2f2f2f;
    border-bottom: 2px solid #2f2f2f;
  }
  @media (max-width: 640px) {
    font-size: 1.1rem;
  }
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const LockerTabWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
  box-sizing: border-box;
`;
const LockerTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  h1 {
    font-size: 16px;
    @media (max-width: 640px) {
      font-size: 1.1rem;
    }
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;
