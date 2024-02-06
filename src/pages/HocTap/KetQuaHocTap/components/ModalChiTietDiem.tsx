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
import moment from 'moment';
import ButtonExtend from '@/components/Table/ButtonExtend';

const ModalChiTietDiem = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	lopHocPhanId?: string;
	hocPhan?: HocPhan.IRecord;
	listDiem?: LopHocPhan.IDiemHpSvHk[];
	trangThaiHoc?: ETrangThaiHocTap;
}) => {
	const { getByIdModel } = useModel('daotao.lophocphan');
	const { setIsView: setIsViewPhieu } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const { setIsView: setIsViewSinhVien } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { danhSach } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { visible, setVisible, lopHocPhanId, hocPhan, listDiem, trangThaiHoc } = props;
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [visibleCongNhan, setVisibleCongNhan] = useState<boolean>(false);
	const [deCuongId, setDeCuongId] = useState<string>();

	const thoiGianQuyDoiDiem =
		!danhSach[0]?.thoiGianBatDau ||
		!danhSach[0]?.thoiGianKetThuc ||
		moment().isAfter(danhSach[0]?.thoiGianBatDau, 'd') ||
		moment().isBefore(danhSach[0]?.thoiGianKetThuc, 'd');

	const handleShowDeCuong = async () => {
		let de = hocPhan?.deCuongHienTaiId;
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
							<ButtonExtend
								tooltip={!danhSach.length || !thoiGianQuyDoiDiem ? 'Không có đợt công nhận KQHT' : null}
								disabled={!danhSach.length || !thoiGianQuyDoiDiem}
								onClick={() => {
									setVisibleCongNhan(true);
									setIsViewPhieu(false);
									setIsViewSinhVien(false);
								}}
								icon={<PlusCircleOutlined />}
							>
								Công nhận KQHT
							</ButtonExtend>
						) : null}

						<Button onClick={() => setVisible(false)}>Đóng</Button>
					</Space>
				}
				width={800}
			>
				{hocPhan ? (
					<Descriptions title='Thông tin học phần' column={{ xs: 1, sm: 1, md: 3 }}>
						<Descriptions.Item label='Tên học phần' span={3}>
							{hocPhan?.ten ? (
								<Tooltip title='Xem đề cương chi tiết học phần'>
									<a onClick={handleShowDeCuong}>
										<b>{hocPhan?.ten ?? ''}</b>
									</a>
								</Tooltip>
							) : (
								<i>Chưa cập nhật</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item label='Mã học phần'>{hocPhan?.ma}</Descriptions.Item>
						<Descriptions.Item label='Số tín chỉ'>{hocPhan?.soTinChi} tín chỉ</Descriptions.Item>
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
									<DetailKetQuaHocTap key={diem._id} diemHpSvHk={diem} />
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

			<ModalQuyDoiDiem visible={visibleCongNhan} setVisible={setVisibleCongNhan} hocPhan={hocPhan} />
		</>
	);
};

export default ModalChiTietDiem;
