import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { colorTrangThaiSinhVienQuyDoiDiem, type ETrangThaiPhieuQuyDoiDiem } from '@/services/HocTap/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { Button, Col, Descriptions, Modal, Row, Space, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormItemHocPhanQuyDoi from '../HocPhanQuyDoi/FormItemHocPhanQuyDoi';

const ViewPhieuQuyDoiDiem = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { record } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const tiLeCongNhan = !record?.soTinChiChuongTrinhDaoTao
		? 0
		: ((record?.soTinChiDaCongNhan + record?.soTinChiCongNhanDot) / record?.soTinChiChuongTrinhDaoTao) * 100;

	return (
		<Modal
			width={1000}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			title={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.ls' })}
		>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.dot' })}>
							{record?.dotDangKyQuyDoiDiem?.tenDot ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.nganh' })}>
							{record?.khoaNganh?.ten ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.file' })}>
							<Space>
								{record?.urlsMinhChung?.length ? (
									<a onClick={() => setVisibleFormFile(true)}>
										{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.xem' })}
									</a>
								) : null}
							</Space>
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.tyle' })}>
							<span style={{ color: tiLeCongNhan > 50 ? 'red' : 'green' }}>
								{tiLeCongNhan.toFixed(tiLeCongNhan !== 0 ? 2 : 0)} %
							</span>
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.qd' })}>
							{record?.quyetDinh?.soQuyetDinh}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.banhanh' })}>
							{record?.quyetDinh?.ngayBanHanh ? formatDate(record?.quyetDinh?.ngayBanHanh) : ''}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.trangthai' })}>
							<Tag color={colorTrangThaiSinhVienQuyDoiDiem[record?.trangThai as ETrangThaiPhieuQuyDoiDiem]}>
								{record?.trangThai ?? ''}
							</Tag>
						</Descriptions.Item>
					</Descriptions>
				</Col>
				<Col xs={24}>
					<FormItemHocPhanQuyDoi />
				</Col>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>

			<ModalExpandable
				title={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.chitiet' })}
				width={1000}
				open={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>
							{intl.formatMessage({ id: 'global.button.dong' })}
						</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.urlsMinhChung ?? []} isPrivate />
			</ModalExpandable>
		</Modal>
	);
};

export default ViewPhieuQuyDoiDiem;
