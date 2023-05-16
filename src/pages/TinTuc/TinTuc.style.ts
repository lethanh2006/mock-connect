import { Col } from 'antd';
import styled from 'styled-components';

export const CardTinTuc = styled.div`
  width: 100%;
  border-radius: 8px;
  padding: 10px 12px;
  height: ${(props: { first?: boolean }) => (props.first ? '100%' : 'auto')};
  box-shadow: 0 2px 6px rgba(163, 177, 191, 0.35);
  transition: 0.3s;
  &:hover {
    box-shadow: 0 6px 12px rgba(163, 177, 191, 0.55);
    cursor: pointer;
  }
`;

export const WrapperCardImage = styled.div`
  width: 100%;
  /* padding-top: calc(100% - 24px); */
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-top: 66%;
`;

export const WrapperLargeImage = styled.div`
  width: 100%;
  /* padding-top: calc(100% - 24px); */
  position: relative;
  /* height: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding-top: 66%;
`;

export const ContentLargeCard = styled.div`
  padding-top: 8px;
  width: 100%;
  height: 150px;
`;
export const CardImage = styled.div`
  border-radius: 12px;
  background-image: url('${(props: { img: string }) => props.img}');
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
`;
export const LargeImg = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;

  /* border-radius: 12px; */
  /* margin-bottom: 16px; */
  src: ${(props: { src: string; alt: string }) => props.src};
  alt: ${(props) => props.alt};
`;

export const NormalImg = styled.div`
  width: 100%;
  height: 100%;

  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;

  /* border-radius: 12px; */
  /* margin-bottom: 16px; */
  src: ${(props: { src: string; alt: string }) => props.src};
  alt: ${(props) => props.alt};
`;

export const NormalImgMobile = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;

  /* border-radius: 12px; */
  /* margin-bottom: 16px; */
  src: ${(props) => props.src};
  alt: ${(props) => props.alt};
`;

export const CenterCol = styled(Col)`
  display: flex;
  justify-items: center;
  align-content: center;
  height: '100%';
`;
