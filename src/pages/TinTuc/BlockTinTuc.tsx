import anh from '@/assets/noimg.png';
import { Col, Empty, Row, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { CardTinTuc, ContentLargeCard } from './TinTuc.style';

const renderParagraph = (text: string, rows: number, style: any) => (
  <Typography.Paragraph ellipsis={{ rows, expandable: false }} style={style}>
    {text}
  </Typography.Paragraph>
);

const BlockTinTuc = (props: { data: TinTuc.Record[]; empty?: string; type?: 'dashboard' }) => {
  const { data, empty, type } = props;
  const url = 'tin-tuc';

  if (data.length === 0)
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={empty ?? 'Chưa có tin tức'} />;
  else
    return (
      <div style={{ marginBottom: 20 }}>
        {type !== 'dashboard' ? (
          <>
            <Row
              gutter={[16, 16]}
              align="middle"
              style={{
                alignItems: 'stretch',
                marginBottom: 16,
              }}
            >
              <Col span={24} md={12}>
                <CardTinTuc
                  onClick={() => {
                    history.push({
                      pathname: url + '/chi-tiet',
                      query: { id: data?.[0]?._id },
                    });
                  }}
                  first={true}
                  style={{ minHeight: '450px' }}
                >
                  <div
                    style={{
                      background: data?.[0]?.urlAnhDaiDien
                        ? `url(${data?.[0]?.urlAnhDaiDien}) center center/contain no-repeat`
                        : `url(${anh}) center center/contain no-repeat`,
                      width: '100%',
                      height: '67%',
                      minHeight: 220,
                      backgroundSize: 'cover',
                    }}
                  />
                  <ContentLargeCard>
                    <Tooltip placement="bottomLeft" title={data?.[0]?.tieuDe}>
                      {renderParagraph(data?.[0]?.tieuDe, 2, {
                        fontSize: 'calc(1em + 0.2vw)',
                        fontWeight: 500,
                        marginBottom: 10,
                        color: 'black',
                      })}
                    </Tooltip>
                    {renderParagraph(data?.[0]?.moTa, 2, { color: '#364954' })}
                    {data?.[0]?.ngayDang && (
                      <i style={{ color: '#999' }}>
                        Ngày đăng: {moment(data?.[0]?.ngayDang).format('DD/MM/YYYY HH:mm')}
                      </i>
                    )}
                  </ContentLargeCard>
                </CardTinTuc>
              </Col>

              <Col span={24} md={12}>
                <Row gutter={[0, 16]}>
                  {data.slice(1, 4).map((tintuc) => (
                    <CardTinTuc
                      key={tintuc?._id}
                      onClick={() => {
                        history.push({
                          pathname: url + '/chi-tiet',
                          query: { id: tintuc?._id },
                        });
                      }}
                      style={{ height: '33.33%' }}
                    >
                      <Row gutter={[12, 0]}>
                        <Col xs={8} style={{ height: '100%' }}>
                          <div
                            style={{
                              background: tintuc?.urlAnhDaiDien
                                ? `url(${tintuc?.urlAnhDaiDien}) center center/ contain no-repeat`
                                : `url(${anh}) center center/ contain no-repeat`,
                              width: '100%',
                              height: '100%',
                              minHeight: 130,
                              backgroundSize: 'cover',
                            }}
                          />
                        </Col>
                        <Col xs={16}>
                          <Tooltip placement="bottomLeft" title={tintuc?.tieuDe}>
                            {renderParagraph(tintuc?.tieuDe, 2, {
                              fontSize: 'calc(1em + 0.2vw)',
                              fontWeight: 500,
                              marginBottom: 6,
                              color: 'black',
                            })}
                          </Tooltip>
                          {renderParagraph(tintuc?.moTa, 2, { color: '#364954', marginBottom: 0 })}
                          {tintuc.ngayDang && (
                            <i style={{ color: '#999' }}>
                              Ngày đăng: {moment(tintuc.ngayDang).format('DD/MM/YYYY HH:mm')}
                            </i>
                          )}
                        </Col>
                      </Row>
                    </CardTinTuc>
                  ))}
                </Row>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ alignItems: 'stretch', marginBottom: 16 }}>
              {data.slice(4).map((tintuc) => (
                <Col span={24} md={8} key={tintuc?._id}>
                  <CardTinTuc
                    style={{ height: '100%' }}
                    onClick={() => {
                      history.push({
                        pathname: url + '/chi-tiet',
                        query: { id: tintuc?._id },
                      });
                    }}
                  >
                    <Row gutter={12} style={{ height: '100%' }}>
                      <Col xs={8}>
                        <div
                          style={{
                            background: tintuc?.urlAnhDaiDien
                              ? `url(${tintuc?.urlAnhDaiDien}) center center/ contain no-repeat`
                              : `url(${anh}) center center/ contain no-repeat`,
                            width: '100%',
                            height: '100%',
                          }}
                        />
                      </Col>
                      <Col xs={16}>
                        <Tooltip placement="bottomLeft" title={tintuc?.tieuDe}>
                          {renderParagraph(tintuc?.tieuDe, 2, {
                            fontSize: 'calc(1em + 0.2vw)',
                            fontWeight: 500,
                            marginBottom: 6,
                            color: 'black',
                          })}
                        </Tooltip>
                        {tintuc?.ngayDang && (
                          <i style={{ color: '#999' }}>
                            Ngày đăng: {moment(tintuc?.ngayDang).format('DD/MM/YYYY HH:mm')}
                          </i>
                        )}
                      </Col>
                    </Row>
                  </CardTinTuc>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Row gutter={[16, 16]} style={{ alignItems: 'stretch', marginBottom: 16 }}>
            {data.map((tintuc) => (
              <Col span={24} key={tintuc?._id}>
                <CardTinTuc
                  style={{ height: '100%' }}
                  onClick={() => {
                    history.push({
                      pathname: url + '/chi-tiet',
                      query: { id: tintuc?._id },
                    });
                  }}
                >
                  <Row gutter={12} style={{ height: '100%' }}>
                    <Col xs={8}>
                      <div
                        style={{
                          background: tintuc?.urlAnhDaiDien
                            ? `url(${tintuc?.urlAnhDaiDien}) center center/ contain no-repeat`
                            : `url(${anh}) center center/ contain no-repeat`,
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </Col>
                    <Col xs={16}>
                      <Tooltip placement="bottomLeft" title={tintuc?.tieuDe}>
                        {renderParagraph(tintuc?.tieuDe, 2, {
                          fontSize: 'calc(1em + 0.2vw)',
                          fontWeight: 500,
                          marginBottom: 6,
                          color: 'black',
                        })}
                      </Tooltip>
                      {tintuc?.ngayDang && (
                        <i style={{ color: '#999' }}>
                          {moment(tintuc?.ngayDang).format('DD/MM/YYYY HH:mm')}
                        </i>
                      )}
                    </Col>
                  </Row>
                </CardTinTuc>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
};

export default BlockTinTuc;
