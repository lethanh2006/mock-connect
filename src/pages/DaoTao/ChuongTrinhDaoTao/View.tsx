import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { getLocalizedName } from '@/utils/localeName';
import { getNameFile } from '@/utils/utils';
import { Button, Descriptions, Divider, Empty, Modal } from 'antd';
import React, { useState } from 'react';
import { useIntl, useModel } from 'umi';

type TProps = {
	visible: boolean;
	setVisible: (val: boolean) => void;
};

const ChuongTrinhDaoTaoModalView: React.FC<TProps> = ({ visible, setVisible }) => {
	const intl = useIntl();
	const { record: recTienTrinh } = useModel('sinhvien.tientrinhtotnghiep');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const updatingHtml = intl.formatMessage({ id: 'tientrinhhoctap.ctdt.updating' });

	return (
		<>
			<Modal
				open={visible}
				onCancel={() => setVisible(false)}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				width={1000}
				title={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.title' })}
			>
				{recTienTrinh?.ctdtKeHoach?._id ? (
					<>
						<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.ten' })} span={2}>
								{recTienTrinh.ctdtKeHoach.ten}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tenEn' })} span={2}>
								{recTienTrinh.ctdtKeHoach.tenTiengAnh ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.ma' })}>
								{recTienTrinh.ctdtKeHoach.ma}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.loaict' })}>
								{recTienTrinh.ctdtKeHoach.loai
									? intl.formatMessage({ id: LoaiChuongTrinhDaoTao[recTienTrinh.ctdtKeHoach.loai] })
									: ''}
							</Descriptions.Item>
							{recTienTrinh.ctdtKeHoach.maKhoaSinhVien && (
								<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khoasv' })}>
									{recTienTrinh.ctdtKeHoach.khoaSinhVien?.ten ?? recTienTrinh.ctdtKeHoach.maKhoaSinhVien}
								</Descriptions.Item>
							)}
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khoasv' })}>
								{recTienTrinh.ctdtKeHoach.khoaSinhVien?.ten ?? recTienTrinh.ctdtKeHoach.maKhoaSinhVien}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.nganh' })}>
								{getLocalizedName(recTienTrinh.ctdtKeHoach.nganh) ?? recTienTrinh.ctdtKeHoach.maNganh}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.ngonngudaotao' })}>
								{recTienTrinh.ctdtKeHoach.ngonNguDaoTao ?? '--'}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.thoigian' })}>
								{recTienTrinh.ctdtKeHoach.thoiGianDaoTao ?? '--'}{' '}
								{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.nam' })}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.thoigiantoida' })}>
								{recTienTrinh.ctdtKeHoach.thoiGianDaoTaoToiDa ?? '--'}{' '}
								{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.nam' })}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tongsotinchi' })}>
								{recTienTrinh.ctdtKeHoach.tongSoTinChi ?? '--'}{' '}
								{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tinchi' })}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.file' })}>
								{recTienTrinh.ctdtKeHoach.url ? (
									<a onClick={() => setVisibleFormFile(true)}>{getNameFile(recTienTrinh.ctdtKeHoach.url)}</a>
								) : null}
							</Descriptions.Item>
						</Descriptions>

						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.muctieu' })}
						</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.mucTieuDaoTao ?? updatingHtml,
							}}
						/>

						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.thongtinhocphi' })}
						</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.thongTinHocPhi ?? updatingHtml,
							}}
						/>

						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuandauvao' })}
						</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.chuanDauVao ?? updatingHtml,
							}}
						/>

						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuandaura' })}
						</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.chuanDauRa ?? updatingHtml,
							}}
						/>

						<Divider orientation='left' className='divider-big-title' dashed>
							{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.vitri' })}
						</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.viTriLamViec ?? updatingHtml,
							}}
						/>
					</>
				) : (
					<Empty description={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.empty' })} />
				)}
			</Modal>

			<ModalExpandable
				title={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.fileDetail' })}
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={recTienTrinh?.ctdtKeHoach?.url ?? ''} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default ChuongTrinhDaoTaoModalView;
