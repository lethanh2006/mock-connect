import PreviewFile from '@/components/PreviewFile';
import { LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { getNameFile } from '@/utils/utils';
import { Button, Descriptions, Divider, Empty, Modal } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';

type TProps = {
	visible: boolean;
	setVisible: (val: boolean) => void;
};

const ChuongTrinhDaoTaoModalView: React.FC<TProps> = ({ visible, setVisible }) => {
	const { record: recTienTrinh } = useModel('sinhvien.tientrinhtotnghiep');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	return (
		<>
			<Modal
				visible={visible}
				onCancel={() => setVisible(false)}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				width={1000}
				title='Chi tiết chương trình đào tạo/Kế hoạch học tập'
			>
				{recTienTrinh?.ctdtKeHoach?._id ? (
					<>
						<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
							<Descriptions.Item label='Tên chương trình' span={2}>
								{recTienTrinh.ctdtKeHoach.ten}
							</Descriptions.Item>
							<Descriptions.Item label='Tên chương trình (tiếng Anh)' span={2}>
								{recTienTrinh.ctdtKeHoach.tenTiengAnh ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label='Mã chương trình'>{recTienTrinh.ctdtKeHoach.ma}</Descriptions.Item>
							<Descriptions.Item label='Loại chương trình'>
								{recTienTrinh.ctdtKeHoach.loai ? LoaiChuongTrinhDaoTao[recTienTrinh.ctdtKeHoach.loai] : ''}
							</Descriptions.Item>

							<Descriptions.Item label='Khóa sinh viên'>
								{recTienTrinh.ctdtKeHoach.khoaSinhVien?.ten ?? recTienTrinh.ctdtKeHoach.maKhoaSinhVien}
							</Descriptions.Item>
							<Descriptions.Item label='Ngành'>
								{recTienTrinh.ctdtKeHoach.nganh?.ten ?? recTienTrinh.ctdtKeHoach.maNganh}
							</Descriptions.Item>

							<Descriptions.Item label='Thời gian đào tạo'>
								{recTienTrinh.ctdtKeHoach.thoiGianDaoTao ?? '--'} năm
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian đào tạo tối đa'>
								{recTienTrinh.ctdtKeHoach.thoiGianDaoTaoToiDa ?? '--'} năm
							</Descriptions.Item>

							<Descriptions.Item label='Tổng số tín chỉ phải học'>
								{recTienTrinh.ctdtKeHoach.tongSoTinChi ?? '--'} tín chỉ
							</Descriptions.Item>
							<Descriptions.Item label='Tập tin'>
								{recTienTrinh.ctdtKeHoach.url ? (
									<a onClick={() => setVisibleFormFile(true)}>{getNameFile(recTienTrinh.ctdtKeHoach.url)}</a>
								) : null}
							</Descriptions.Item>
						</Descriptions>

						<Divider>Mục tiêu đào tạo</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.mucTieuDaoTao ?? '<p><i>Đang cập nhật</i></p>',
							}}
						/>

						<Divider>Chuẩn đầu vào</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.chuanDauVao ?? '<p><i>Đang cập nhật</i></p>',
							}}
						/>

						<Divider>Chuẩn đầu ra</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.chuanDauRa ?? '<p><i>Đang cập nhật</i></p>',
							}}
						/>

						<Divider>Vị trí việc làm sau tốt nghiệp</Divider>
						<div
							dangerouslySetInnerHTML={{
								__html: recTienTrinh.ctdtKeHoach.viTriLamViec ?? '<p><i>Đang cập nhật</i></p>',
							}}
						/>
					</>
				) : (
					<Empty description='Không có thông tin' />
				)}
			</Modal>

			<Modal
				title='Chi tiết tập tin'
				width={800}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={recTienTrinh?.ctdtKeHoach?.url ?? ''} />
			</Modal>
		</>
	);
};

export default ChuongTrinhDaoTaoModalView;
