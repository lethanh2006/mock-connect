import ButtonExtend from '@/components/Table/ButtonExtend';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ETrangThaiHocTap, trangThaiHocTap } from '@/services/DaoTao/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { PlusCircleOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Modal, Space, Tooltip, message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalHocPhan from '../../../DaoTao/DeCuongHocPhan/ModalHocPhan';
import ModalQuyDoiDiem from '../../QuyDoiDiem/components/Modal';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';

const ModalChiTietDiem = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	lopHocPhanId?: string;
	hocPhan?: HocPhan.IRecord;
	listDiem?: LopHocPhan.IDiemHpSvHk[];
	trangThaiHoc?: ETrangThaiHocTap;
	khoiChuongTrinh?: Partial<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>;
	maKhoaNganh?: string;
}) => {
	const { getByIdModel } = useModel('lophocphan.lophocphan');
	const { ngoaiQuyDoiDiem } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { visible, setVisible, lopHocPhanId, hocPhan, listDiem, trangThaiHoc, khoiChuongTrinh, maKhoaNganh } = props;
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [visibleCongNhan, setVisibleCongNhan] = useState<boolean>(false);
	const [deCuongId, setDeCuongId] = useState<string>();

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

	const renderHocPhanCt = (dsHocPhan?: ChuongTrinhDaoTao.THocPhanTuongQuan[], label?: string) => (
		<Descriptions.Item label={label}>
			{dsHocPhan?.length ? (
				<ul style={{ marginBottom: 0, paddingLeft: 14 }}>
					{dsHocPhan?.map((item) => (
						<li key={item.ma}>
							{item.ma} - {item.ten}
						</li>
					))}
				</ul>
			) : (
				<i>Không có thông tin</i>
			)}
		</Descriptions.Item>
	);

	return (
		<>
			<Modal
				title='Kết quả học tập'
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={
					<Space wrap>
						<ButtonExtend icon={<StarOutlined />} title='Quan tâm học phần'>
							Quan tâm
						</ButtonExtend>
						{trangThaiHoc === ETrangThaiHocTap.CHUA_HOC ? (
							<ButtonExtend
								tooltip={ngoaiQuyDoiDiem ? 'Không có đợt công nhận KQHT' : null}
								disabled={ngoaiQuyDoiDiem}
								onClick={() => setVisibleCongNhan(true)}
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

				{khoiChuongTrinh ? (
					<Descriptions title='Chương trình học' column={1} style={{ marginTop: 12 }}>
						<Descriptions.Item label='Khối kiến thức'>
							{khoiChuongTrinh.khoiKienThuc?.ten ?? khoiChuongTrinh.maKhoiKienThuc}
						</Descriptions.Item>
						{renderHocPhanCt(khoiChuongTrinh.dsHocPhanTienQuyet, 'Học phần tiên quyết')}
						{renderHocPhanCt(khoiChuongTrinh.dsHocPhanTruoc, 'Học phần trước')}
						{renderHocPhanCt(khoiChuongTrinh.dsHocPhanSongHanh, 'Học phần song hành')}
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

			{trangThaiHoc === ETrangThaiHocTap.CHUA_HOC ? (
				<ModalQuyDoiDiem
					visible={visibleCongNhan}
					setVisible={setVisibleCongNhan}
					hocPhan={hocPhan}
					maKhoaNganh={maKhoaNganh}
				/>
			) : null}
		</>
	);
};

export default ModalChiTietDiem;
