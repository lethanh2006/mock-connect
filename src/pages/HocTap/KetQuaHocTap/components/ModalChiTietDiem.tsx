import ButtonExtend from '@/components/Table/ButtonExtend';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { colorTrangThaiHocTap, ETrangThaiHocTap, trangThaiHocTap } from '@/services/DaoTao/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popover, Space, Tag, Tooltip, message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalHocPhan from '../../../DaoTao/DeCuongHocPhan/ModalHocPhan';
import ModalQuyDoiDiem from '../../QuyDoiDiem/components/Modal';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';

const ModalChiTietDiem = (
	props: {
		visible: boolean;
		setVisible: (val: boolean) => void;
		listDiem: LopHocPhan.IDiemHpSvHk[];
		/** Đề cương của đề cương học phần học kỳ */
		deCuongId?: string;

		// Chương trình khung
		trangThaiHoc?: ETrangThaiHocTap;
		khoiChuongTrinh?: Partial<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>;
		colorKhoiKienThuc?: string;
		maKhoaNganh?: string;
	} & Partial<Pick<ChuongTrinhDaoTao.TTienTrinhThucTe, 'hocPhan'>>,
) => {
	const { ngoaiQuyDoiDiem } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { visible, setVisible, hocPhan, listDiem, trangThaiHoc, khoiChuongTrinh, maKhoaNganh } = props;
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [visibleCongNhan, setVisibleCongNhan] = useState<boolean>(false);
	const deCuongId = props.deCuongId ?? hocPhan?.deCuongHienTaiId;

	const handleShowDeCuong = async () => {
		if (deCuongId) setVisibleDeCuong(true);
		else message.error('Không tìm thấy đề cương học phần');
	};

	const renderHocPhanCt = (dsHocPhan?: ChuongTrinhDaoTao.THocPhanTuongQuan[], label?: string) => (
		<Descriptions.Item label={label} span={3}>
			{dsHocPhan?.length ? (
				<ul style={{ marginBottom: 0, paddingLeft: 14 }}>
					{dsHocPhan?.map((item) => (
						<li key={item.ma}>
							{item.ma} - {item.ten}
						</li>
					))}
				</ul>
			) : (
				<i style={{ color: '#aaa' }}>Không có thông tin</i>
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
						{/* <ButtonExtend icon={<StarOutlined />} title='Quan tâm học phần'>
							Quan tâm
						</ButtonExtend> */}
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
							<Descriptions.Item label='Trạng thái'>
								<Tag color={colorTrangThaiHocTap[trangThaiHoc]}>{trangThaiHocTap[trangThaiHoc]}</Tag>
							</Descriptions.Item>
						) : null}
					</Descriptions>
				) : null}

				{khoiChuongTrinh ? (
					<Descriptions title='Chương trình học' style={{ marginTop: 12 }}>
						<Descriptions.Item label='TT học kỳ theo kế hoạch'>
							<b>{khoiChuongTrinh.soThuTuKy}</b>
						</Descriptions.Item>
						<Descriptions.Item label='Khối kiến thức' span={2}>
							<span style={{ color: props.colorKhoiKienThuc }}>
								{khoiChuongTrinh.khoiKienThuc?.ten ?? khoiChuongTrinh.maKhoiKienThuc}
							</span>
						</Descriptions.Item>
						{/* Sẽ được truyền vào từ CardKhoiHocPhan.tsx */}
						{khoiChuongTrinh.ten && (
							<Descriptions.Item label='Khối học phần tự chọn' span={3}>
								{khoiChuongTrinh.ten}
							</Descriptions.Item>
						)}
						{renderHocPhanCt(khoiChuongTrinh.dsHocPhanTienQuyet, 'Học phần tiên quyết')}
						{renderHocPhanCt(khoiChuongTrinh.dsHocPhanTruoc, 'Học phần trước')}
						{renderHocPhanCt(khoiChuongTrinh.dsHocPhanSongHanh, 'Học phần song hành')}
					</Descriptions>
				) : null}

				{(trangThaiHoc === undefined || trangThaiHoc !== ETrangThaiHocTap.CHUA_HOC) && listDiem.length
					? listDiem
							.sort((a, b) => (b.maHocKy ?? '').localeCompare(a.maHocKy ?? '')) // Sort DESC
							.map((diem, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<div style={{ marginBottom: index === 1 ? undefined : 18 }} key={index}>
									<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10, marginTop: 12 }}>
										Chi tiết kết quả học tập{listDiem.length > 1 ? ` học lần ${listDiem.length - index}` : null}{' '}
										<Popover
											content={
												<Descriptions column={1} title='Thông tin học tập' style={{ maxWidth: 300 }}>
													<Descriptions.Item label='Kỳ học' span={2}>
														{diem?.hocKy?.ten ?? diem.maHocKy ?? '--'}
													</Descriptions.Item>
													<Descriptions.Item label='Tên lớp tín chỉ'>{diem?.tenLopHocPhan ?? '--'}</Descriptions.Item>
												</Descriptions>
											}
										>
											<InfoCircleOutlined />
										</Popover>
									</h4>

									<DetailKetQuaHocTap key={diem._id} diemHpSvHk={diem} />
								</div>
							))
					: null}
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
