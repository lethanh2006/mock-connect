import styled from 'styled-components';

export const CardTinTuc = styled.div`
  width: 100%;
  border-radius: 6px;
  padding: 8px 10px;
  height: ${(props: { first?: boolean }) => (props.first ? '100%' : 'auto')};
  box-shadow: 0 1px 4px rgba(163, 177, 191, 0.35);
  transition: 0.3s;
  &:hover {
    box-shadow: 0 3px 8px rgba(163, 177, 191, 0.55);
    cursor: pointer;
  }

  .thoi-gian {
    color: #999;
    font-size: 12px;
  }
`;

export const ContentLargeCard = styled.div`
  padding-top: 8px;
  width: 100%;
  height: 150px;
`;
