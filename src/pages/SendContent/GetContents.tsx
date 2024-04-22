import { useState, useEffect } from 'react';
import back from '/assets/images/back.svg';
import deleteWorry from '/assets/images/deleteWorry.svg';
import report from '/assets/images/report.svg';
import rocketA from '/assets/images/rocketA.svg';
import rocketB from '/assets/images/rocketB.svg';
import rocketC from '/assets/images/rocketC.svg';
import sendLine from '/assets/images/sendLine.svg';
import starNotice from '/assets/images/starNotice.svg';
import takeStar from '/assets/images/takeStar.svg';
import { WorryDetail } from '../../types/WorryDetail.interface';
import {
  reportContent,
  sendContentReply,
  sendStarReply,
} from '../../api/sendContentApi';
import {
  ModalHeader,
  BackButton,
  AnimatedWrapper,
  StyledImg,
  WhiteBox,
  ModalOverlay,
  SendButton,
  DateText,
  ContentText,
  ButtonContainer,
  TakeStarImg,
  LineContainer,
  ReplyButton,
  DeleteImg,
  ReportImg,
  StarButtonContainer,
  StarButton,
  HoverImage,
  Circle,
  StarText,
} from './ContentStyle';
import SendContents from './SendContents';
import { usePostArrivedStore } from '../../store/postArrivedStore';
import { formatDate } from '../../utills/formatDate/formatDate';
import { useStateModalStore } from '../../store/stateModalStore';
import PageModal from '../../components/modal/PageModal';

function GetContents({
  detail,
  closeModal,
  removeCloseModal,
}: {
  detail: WorryDetail;
  closeModal: () => void;
  removeCloseModal: (worryId: number) => void;
}) {
  const [showDetail, setShowDetail] = useState(true);
  const [sendReply, setSendReply] = useState(false);
  const [replyWrite, setReplyWrite] = useState(false);
  const [showStarText, setShowStarText] = useState(false);
  const [sendStar, setSendStar] = useState(false);

  const [content, setContent] = useState<string>('');
  const [fontColor, setFontColor] = useState<string>('');
  const [isSendButtonDisabled, setIsSendButtonDisabled] =
    useState<boolean>(true);

  const [showPageDeleteModal, setShowPageDeleteModal] = useState(false);

  const { setRemovePostArrived } = usePostArrivedStore();
  const { openStateModal } = useStateModalStore();

  const handleContentSubmit = async () => {
    try {
      const contentData = { content, fontColor };
      const params = { worryid: detail.worryId, commentid: detail.commentId };
      if (detail.commentId !== null) {
        params.commentid = detail.commentId;
      }

      if (sendStar) {
        await sendStarReply(params, contentData);
      } else {
        await sendContentReply(params, contentData);
      }
      setRemovePostArrived(detail.worryId);
      closeModal();
      openStateModal(
        sendStar
          ? '답례가 무사히 전달되었어요!'
          : '로켓이 무사히 되돌아갔어요!',
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = async () => {
    try {
      await reportContent(
        { worryid: detail.worryId, commentid: detail.commentId },
        '불쾌한 언행',
      );
      setRemovePostArrived(detail.worryId);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowDeleteModal = () => {
    setShowPageDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowPageDeleteModal(false);
  };

  const getRocketImage = (icon: string) => {
    switch (icon) {
      case 'A':
        return rocketA;
      case 'B':
        return rocketB;
      case 'C':
        return rocketC;
      default:
        return rocketA;
    }
  };

  useEffect(() => {
    setIsSendButtonDisabled(content.trim().length === 0);
  }, [content]);

  useEffect(() => {
    const token = localStorage.getItem('access_Token');
    if (token !== null) {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.userId;

      if (userId === detail.worryUserId) {
        setShowStarText(true);
      } else {
        setShowStarText(false);
      }
    } else {
      console.error('토큰이 없습니다.');
    }
  }, [detail.worryUserId]);

  return (
    <>
      <ModalHeader>
        <BackButton src={back} onClick={closeModal} />
        {showDetail && <ReportImg src={report} onClick={handleReport} />}
        {sendReply && (
          <SendButton
            onClick={handleContentSubmit}
            disabled={isSendButtonDisabled}
          >
            전송하기
          </SendButton>
        )}
      </ModalHeader>

      <AnimatedWrapper>
        <StyledImg src={getRocketImage(detail.icon)} />
        <WhiteBox>
          {showDetail && <DateText>{formatDate(detail.createdAt)}</DateText>}
          {!replyWrite && (
            <>
              {detail.parentContent && !sendReply && (
                <>
                  <ContentText
                    color={'#868690'}
                    $height={'12%'}
                    $marginTop={showDetail ? '60px' : '110px'}
                  >
                    {detail.parentContent}
                  </ContentText>
                  <LineContainer>
                    <img src={sendLine} />
                  </LineContainer>
                </>
              )}
              <ContentText
                color={detail.fontColor}
                $marginTop={
                  detail.parentContent && showDetail
                    ? '40px'
                    : showDetail
                      ? '60px'
                      : '110px'
                }
              >
                {detail.content}
              </ContentText>
            </>
          )}
          {sendReply && (
            <>
              <LineContainer
                $marginTop={replyWrite ? '62px' : '0px'}
                onClick={() => {
                  setSendReply(true);
                  setReplyWrite(false);
                }}
              >
                <img src={sendLine} />
              </LineContainer>
              <SendContents
                onSend={(content, fontColor) => {
                  setContent(content);
                  setFontColor(fontColor);
                }}
                onInputClick={() => setReplyWrite(true)}
                placeholder={`답장을 입력해주세요.`}
                containerHeight={replyWrite ? '67%' : '38.5%'}
              />
            </>
          )}

          {showDetail && (
            <ButtonContainer>
              {!detail.isSolved && (
                <>
                  <ReplyButton
                    onClick={() => {
                      setShowDetail(false);
                      setSendReply(true);
                    }}
                  >
                    답장하기
                  </ReplyButton>
                  <DeleteImg
                    src={deleteWorry}
                    onClick={handleShowDeleteModal}
                  />
                </>
              )}
              {detail.isSolved && (
                <>
                  <TakeStarImg src={takeStar} />
                  <ReplyButton onClick={() => removeCloseModal(detail.worryId)}>
                    확인
                  </ReplyButton>
                </>
              )}
            </ButtonContainer>
          )}
          {replyWrite && showStarText && (
            <StarButtonContainer>
              <StarButton
                className={sendStar ? 'active' : ''}
                onClick={() => setSendStar(!sendStar)}
              >
                <Circle className="Circle" />
                <StarText>답례 전송</StarText>
                <HoverImage src={starNotice} />
              </StarButton>
            </StarButtonContainer>
          )}
        </WhiteBox>
      </AnimatedWrapper>
      <ModalOverlay />

      {showPageDeleteModal && (
        <PageModal
          showDeleteModal={true}
          detail={detail}
          closeModal={closeModal}
          closePageModal={handleDeleteCancel}
        />
      )}
    </>
  );
}

export default GetContents;
