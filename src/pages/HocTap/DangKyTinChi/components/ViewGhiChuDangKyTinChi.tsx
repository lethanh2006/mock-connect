import step1ENImage from '@/assets/dktc/step1-en.png';
import step1VNImage from '@/assets/dktc/step1-vn.png';
import step2ENImage from '@/assets/dktc/step2-en.png';
import step2VNImage from '@/assets/dktc/step2-vn.png';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { tinhChatDangKyTC } from '@/services/DaoTao/DangKyTinChi/constant';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { Col, Divider, Row } from 'antd';
import { getLocale, useIntl, useModel } from 'umi';

const ViewGhiChuDangKyTinChi = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const locale = getLocale();
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');
	const contentGapStyle = { display: 'flex', flexDirection: 'column', gap: 8 } as const;
	const stepImageStyle = { width: '100%', maxWidth: 800, borderRadius: 4 };

	const step1Image = locale === 'vi-VN' ? step1VNImage : step1ENImage;
	const step2Image = locale === 'vi-VN' ? step2VNImage : step2ENImage;

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtindangky' })}
			open={visible}
			footer={null}
			onCancel={() => setVisible(false)}
			width={900}
		>
			<Row gutter={[4, 4]}>
				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 8 }}>
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtinkyhoc' })}
					</Divider>
				</Col>

				<Col span={24} style={contentGapStyle}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tenhocky' })}</strong>: {recHocKy?.ten ?? '--'}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.sotuanhoc' })}</strong>: {recHocKy?.soTuan ?? '--'}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.thoigianbatdauhocky' })}</strong>:{' '}
						{recHocKy?.thoiGianBatDau ? formatDate(recHocKy.thoiGianBatDau) : '--'}
					</div>
				</Col>

				{dotDangKyHienTai ? (
					<>
						<Col span={24}>
							<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 8 }}>
								{intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtindotdangky' })}
							</Divider>
						</Col>

						<Col span={24} style={contentGapStyle}>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tendotdangky' })}</strong>:{' '}
								{dotDangKyHienTai?.ten ?? '--'}
							</div>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.batdau' })}</strong>:{' '}
								{dotDangKyHienTai?.thoiGianBatDau ? formatDateTime(dotDangKyHienTai.thoiGianBatDau) : '--'}
							</div>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.ketthuc' })}</strong>:{' '}
								{dotDangKyHienTai?.thoiGianKetThuc ? formatDateTime(dotDangKyHienTai.thoiGianKetThuc) : '--'}
							</div>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tinhchat' })}</strong>:{' '}
								{dotDangKyHienTai?.tinhChatDangKy
									? intl.formatMessage({ id: tinhChatDangKyTC[dotDangKyHienTai.tinhChatDangKy] })
									: '--'}
							</div>
						</Col>
					</>
				) : null}

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 8 }}>
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtinbosung' })}
					</Divider>
				</Col>

				<Col span={24} style={contentGapStyle}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tatcahocphan' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.tatcahocphan.mota' })}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theokehoachgiangday' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theokehoachgiangday.mota' })}
					</div>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhdaotao' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhdaotao.mota' })}
					</div>
					{/* <div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhnganh2' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhnganh2.mota' })}
					</div> */}
				</Col>

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 8 }}>
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.huongdandangky' })}
					</Divider>
				</Col>

				<Col span={24} style={contentGapStyle}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1.mota' })}
					</div>
					<img
						src={step1Image}
						alt={intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1' })}
						style={stepImageStyle}
					/>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc2' })}</strong>:{' '}
						{intl.formatMessage(
							{ id: 'dangkytinchi.duongdan.buoc2.mota' },
							{
								dangky: (
									<b style={{ color: '#134D8B' }}>{intl.formatMessage({ id: 'dangkytinchi.duongdan.dangky' })}</b>
								),
							},
						)}
					</div>
					<img
						src={step2Image}
						alt={intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc2' })}
						style={stepImageStyle}
					/>
				</Col>
			</Row>
		</ModalExpandable>
	);
};

export default ViewGhiChuDangKyTinChi;
