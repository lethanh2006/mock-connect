import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ETrangThaiHocTap, trangThaiHocTap } from '@/services/DaoTao/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Modal, Space, Tooltip, message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalHocPhan from '../../LopHocPhan/DeCuongHocPhan/ModalHocPhan';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';
import ModalQuyDoiDiem from './ModalQuyDoiDiem';

const ModalChiTietDiem = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	lopHocPhanId?: string;
	chuongTrinhKhung?: { hocPhan?: HocPhan.IRecord; soTinChi?: number };
	listDiem?: LopHocPhan.IRecordSinhVienLopHP[];
	trangThaiHoc?: ETrangThaiHocTap;
}) => {
	const { getByIdModel } = useModel('daotao.lophocphan');
	const { setIsView } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { visible, setVisible, lopHocPhanId, chuongTrinhKhung, listDiem, trangThaiHoc } = props;
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [visibleCongNhan, setVisibleCongNhan] = useState<boolean>(false);
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
				footer={
					<Space>
						{trangThaiHoc === ETrangThaiHocTap.CHUA_HOC ? (
							<Button
								onClick={() => {
									setVisibleCongNhan(true);
									setIsView(false);
								}}
								icon={<PlusCircleOutlined />}
							>
								Công nhận KQHT
							</Button>
						) : null}

						<Button onClick={() => setVisible(false)}>Đóng</Button>
					</Space>
				}
				width={800}
			>
				{chuongTrinhKhung ? (
					<Descriptions title='Thông tin học phần' column={{ xs: 1, sm: 1, md: 3 }}>
						<Descriptions.Item label='Tên học phần' span={3}>
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
						<Descriptions.Item label='Số tín chỉ'>{chuongTrinhKhung.soTinChi} tín chỉ</Descriptions.Item>
						{trangThaiHoc ? (
							<Descriptions.Item label='Trạng thái'>{trangThaiHocTap[trangThaiHoc]}</Descriptions.Item>
						) : null}
					</Descriptions>
				) : null}

				{trangThaiHoc === undefined || trangThaiHoc !== ETrangThaiHocTap.CHUA_HOC ? (
					<>
						<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10, marginTop: 12 }}>Chi tiết điểm học phần</h4>
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
					</>
				) : null}
			</Modal>

			<ModalHocPhan
				visible={visibleDeCuong}
				setVisible={setVisibleDeCuong}
				title='Chi tiết đề cương học phần'
				deCuongId={deCuongId}
			/>

			<ModalQuyDoiDiem visible={visibleCongNhan} setVisible={setVisibleCongNhan} chuongTrinhKhung={chuongTrinhKhung} />
		</>
	);
};

export default ModalChiTietDiem;
