import { tinhChatDangKyTC } from '@/services/DaoTao/DangKyTinChi/constant';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { Col, Divider, Modal, Row } from 'antd';
import { useIntl, useModel } from 'umi';

const ViewGhiChuDangKyTinChi = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

	return (
		<Modal
			title={intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtindangky' })}
			open={visible}
			footer={null}
			onCancel={() => setVisible(false)}
			width={800}
		>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 8 }}>
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.thongtinkyhoc' })}
					</Divider>
				</Col>

				<Col span={24}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tenhocky' })}</strong>: {recHocKy?.ten ?? '--'}
					</div>
					<div style={{ marginTop: 8 }}>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.sotuanhoc' })}</strong>: {recHocKy?.soTuan ?? '--'}
					</div>
					<div style={{ marginTop: 8 }}>
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

						<Col span={24}>
							<div>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tendotdangky' })}</strong>:{' '}
								{dotDangKyHienTai?.ten ?? '--'}
							</div>
							<div style={{ marginTop: 8 }}>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.batdau' })}</strong>:{' '}
								{dotDangKyHienTai?.thoiGianBatDau ? formatDateTime(dotDangKyHienTai.thoiGianBatDau) : '--'}
							</div>
							<div style={{ marginTop: 8 }}>
								<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.ketthuc' })}</strong>:{' '}
								{dotDangKyHienTai?.thoiGianKetThuc ? formatDateTime(dotDangKyHienTai.thoiGianKetThuc) : '--'}
							</div>
							<div style={{ marginTop: 8 }}>
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

				<Col span={24}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theokehoachgiangday' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theokehoachgiangday.mota' })}
					</div>
					<div style={{ marginTop: 8 }}>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhdaotao' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhdaotao.mota' })}
					</div>
					{/* <div style={{ marginTop: 8 }}>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhnganh2' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.theochuongtrinhnganh2.mota' })}
					</div> */}
					<div style={{ marginTop: 8 }}>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.tatcahocphan' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.tatcahocphan.mota' })}
					</div>
				</Col>

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 8 }}>
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.huongdandangky' })}
					</Divider>
				</Col>

				<Col span={24}>
					<div>
						<strong>{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1' })}</strong>:{' '}
						{intl.formatMessage({ id: 'dangkytinchi.duongdan.buoc1.mota' })}
					</div>
					<div style={{ marginTop: 8 }}>
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
				</Col>
			</Row>
		</Modal>
	);
};

export default ViewGhiChuDangKyTinChi;
