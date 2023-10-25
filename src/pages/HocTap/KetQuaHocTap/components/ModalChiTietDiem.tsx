import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Descriptions, Divider, Modal, Tooltip, message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalHocPhan from '../../LopHocPhan/DeCuongHocPhan/ModalHocPhan';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';

const ModalChiTietDiem = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	lopHocPhanId?: string;
	chuongTrinhKhung?: { hocPhan?: HocPhan.IRecord; soTinChi?: number };
	listDiem?: LopHocPhan.IRecordSinhVienLopHP[];
}) => {
	const { getByIdModel } = useModel('daotao.lophocphan');
	const { visible, setVisible, lopHocPhanId, chuongTrinhKhung, listDiem } = props;
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongId, setDeCuongId] = useState<string>();

	const handleShowDeCuong = async () => {
		let de = chuongTrinhKhung?.hocPhan?.deCuongHienTaiId;
		if (!de && lopHocPhanId) {
			const res = await getByIdModel(lopHocPhanId);
			de = res.deCuong?.deCuongId || res.hocPhan?.deCuongHienTaiId;
		}
		if (de) {
			setDeCuongId(de);
			setVisibleDeCuong(true);
		} else message.error('Không tìm thấy đề cương học phần');
	};

	return (
		<>
			<Modal
				title='Kết quả học tập'
				visible={visible}
				onCancel={() => setVisible(false)}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				width={600}
			>
				{chuongTrinhKhung ? (
					<Descriptions title='Thông tin học phần' column={1}>
						<Descriptions.Item label='Tên học phần'>
							{chuongTrinhKhung?.hocPhan?.ten ? (
								<Tooltip title='Xem đề cương chi tiết học phần'>
									<a onClick={handleShowDeCuong}>
										<b>{chuongTrinhKhung?.hocPhan?.ten ?? ''}</b>
									</a>
								</Tooltip>
							) : (
								<i>Chưa cập nhật</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item label='Mã học phần'>{chuongTrinhKhung.hocPhan?.ma}</Descriptions.Item>
						<Descriptions.Item label='Số tín chỉ'>{chuongTrinhKhung.soTinChi}</Descriptions.Item>
					</Descriptions>
				) : null}

				<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Chi tiết điểm học phần</h4>
				{!listDiem?.length ? (
					<DetailKetQuaHocTap lopHocPhanId={lopHocPhanId} />
				) : (
					listDiem.map((diem, index) => (
						<>
							{listDiem.length > 1 ? <Divider>Học lần {index + 1}</Divider> : null}
							<DetailKetQuaHocTap key={diem._id} sinhVienLopHp={diem} />
						</>
					))
				)}
			</Modal>

			<ModalHocPhan
				visible={visibleDeCuong}
				setVisible={setVisibleDeCuong}
				title='Chi tiết đề cương học phần'
				deCuongId={deCuongId}
			/>
		</>
	);
};

export default ModalChiTietDiem;
