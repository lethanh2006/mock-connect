import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { colorTrangThaiHocTap, ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Button, Descriptions, Divider, Empty, Modal, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
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
		khoiChuongTrinh?: any;
		colorKhoiKienThuc?: string;
		maKhoaNganh?: string;
	} & Partial<Pick<ChuongTrinhDaoTao.TTienTrinhThucTe, 'hocPhan'>>,
) => {
	const intl = useIntl();
	// const { ngoaiQuyDoiDiem } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { record } = useModel('lophocphan.lophocphan');

	const { visible, setVisible, hocPhan, listDiem, trangThaiHoc, khoiChuongTrinh, maKhoaNganh } = props;
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [visibleCongNhan, setVisibleCongNhan] = useState<boolean>(false);
	const deCuongId = props.deCuongId ?? hocPhan?.deCuongHienTaiId;

	// const handleShowDeCuong = async () => {
	// 	if (deCuongId) setVisibleDeCuong(true);
	// 	else message.error('Không tìm thấy đề cương học phần');
	// };

	const diemHienTai = useMemo(() => {
		if (!listDiem.length) return undefined;
		return [...listDiem].sort((a, b) => (b.maHocKy ?? '').localeCompare(a.maHocKy ?? ''))[0];
	}, [listDiem]);

	const renderTrangThai = () => {
		if (
			trangThaiHoc === ETrangThaiHocTap.CHUA_HOC ||
			trangThaiHoc === ETrangThaiHocTap.DANG_HOC ||
			diemHienTai?.diemChu === ELoaiDiemChu.IP
		) {
			const trangThaiHienThi =
				diemHienTai?.diemChu === ELoaiDiemChu.IP ? ETrangThaiHocTap.DANG_HOC : (trangThaiHoc as ETrangThaiHocTap);

			return (
				<Tag color={colorTrangThaiHocTap[trangThaiHienThi]}>
					{intl.formatMessage({
						id:
							trangThaiHienThi === ETrangThaiHocTap.CHUA_HOC
								? 'daotao.trangthaihoctap.chuaHoc'
								: 'daotao.trangthaihoctap.dangHoc',
					})}
				</Tag>
			);
		}

		if (
			diemHienTai?.dat === false ||
			diemHienTai?.diemChu === ELoaiDiemChu.F ||
			diemHienTai?.diemChu === ELoaiDiemChu.HOAN_THI ||
			diemHienTai?.diemChu === ELoaiDiemChu.W ||
			trangThaiHoc === ETrangThaiHocTap.CHUA_DAT
		) {
			return (
				<Tag color={colorTrangThaiHocTap[ETrangThaiHocTap.CHUA_DAT]}>
					{intl.formatMessage({ id: 'lophocphan.id.ketqua.khongdat' })}
				</Tag>
			);
		}

		if (diemHienTai?.dat === true || trangThaiHoc === ETrangThaiHocTap.DA_HOC) {
			return (
				<Tag color={colorTrangThaiHocTap[ETrangThaiHocTap.DA_HOC]}>
					{intl.formatMessage({ id: 'lophocphan.id.ketqua.dat' })}
				</Tag>
			);
		}

		return null;
	};

	const trangThaiContent = renderTrangThai();

	const renderHocPhanCt = (dsHocPhan?: ChuongTrinhDaoTao.THocPhanTuongQuan[] | null, label?: string) => {
		const danhSachHienThi = Array.isArray(dsHocPhan) && dsHocPhan[0]?.ten ? dsHocPhan : [];
		if (!danhSachHienThi.length) return null;

		return (
			<Descriptions.Item label={label} span={3}>
				<ul style={{ marginBottom: 0, paddingLeft: 14 }}>
					{danhSachHienThi.map((item) => (
						<li key={item.ma}>
							{item.ma} - {item.ten}
						</li>
					))}
				</ul>
			</Descriptions.Item>
		);
	};

	return (
		<>
			<Modal
				title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.title' })}
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<>
						{/* <ButtonExtend icon={<StarOutlined />} title='Quan tâm học phần'>
							Quan tâm
						</ButtonExtend> */}
						{/* {trangThaiHoc === ETrangThaiHocTap.CHUA_HOC ? (
							<ButtonExtend
								tooltip={
									ngoaiQuyDoiDiem ? intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.khongcodot' }) : null
								}
								disabled={ngoaiQuyDoiDiem}
								onClick={() => setVisibleCongNhan(true)}
								icon={<PlusCircleOutlined />}
							>
								{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan' })}
							</ButtonExtend>
						) : null} */}

						<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</>
				}
				width={1000}
			>
				<Divider className='divider-big-title' orientation='left'>
					{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.thongtin' })}
				</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 3 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hp' })} span={3}>
						{hocPhan?.ten ? (
							<div>
								<b>{hocPhan.ten}</b>
							</div>
						) : (
							<i>--</i>
						)}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.mahp' })}>
						{hocPhan?.ma}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.stc' })}>
						{hocPhan?.soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tc' })}
					</Descriptions.Item>
					{/* {trangThaiContent ? ( */}
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.trangthai' })}>
						{trangThaiContent}
					</Descriptions.Item>
					{/* ) : null} */}
				</Descriptions>

				<Divider className='divider-big-title' orientation='left'>
					{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chuongtrinh' })}
				</Divider>
				<Descriptions style={{ marginTop: 12 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tt' })}>
						<b>{khoiChuongTrinh?.soThuTuKy}</b>
					</Descriptions.Item>
					<Descriptions.Item
						label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.khoikienthuc' })}
						span={khoiChuongTrinh?.soThuTuKy ? 2 : 3}
					>
						<span>{khoiChuongTrinh?.khoiKienThuc?.ten ?? khoiChuongTrinh?.maKhoiKienThuc}</span>
					</Descriptions.Item>
					{/* Sẽ được truyền vào từ CardKhoiHocPhan.tsx */}
					{khoiChuongTrinh?.ten ? (
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tuchon' })} span={3}>
							{khoiChuongTrinh.ten}
						</Descriptions.Item>
					) : null}
					{renderHocPhanCt(
						khoiChuongTrinh?.dsHocPhanTienQuyet,
						intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tienquyet' }),
					)}
					{renderHocPhanCt(
						khoiChuongTrinh?.dsHocPhanTruoc,
						intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hptruoc' }),
					)}
					{renderHocPhanCt(
						khoiChuongTrinh?.dsHocPhanSongHanh,
						intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hpsongnganh' }),
					)}
					{khoiChuongTrinh?.chuyenNganh?.ten ? (
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })} span={3}>
							{khoiChuongTrinh.chuyenNganh.ten}
						</Descriptions.Item>
					) : null}
				</Descriptions>
				<Divider dashed orientation='left' className='divider-big-title'>
					{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chitietketqua' })}
				</Divider>
				{(trangThaiHoc === undefined || trangThaiHoc !== ETrangThaiHocTap.CHUA_HOC) && listDiem.length ? (
					listDiem
						.sort((a, b) => (b.maHocKy ?? '').localeCompare(a.maHocKy ?? '')) // Sort DESC
						.map((diem, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<div style={{ marginBottom: index === 1 ? undefined : 18, fontWeight: 600 }} key={index}>
								{listDiem.length > 0
									? `${intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hoclan' })} ${listDiem.length - index}`
									: null}
								{diemHienTai?._id === diem._id ? (
									<Tag color='green' style={{ marginLeft: 8 }}>
										{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.finalGrade' })}
									</Tag>
								) : null}
								<DetailKetQuaHocTap key={diem._id} diemHpSvHk={diem} />
							</div>
						))
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				)}
			</Modal>

			<ModalHocPhan
				visible={visibleDeCuong}
				setVisible={setVisibleDeCuong}
				title={`${intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chitiethp' })} ${record?.hocKy?.ten ? `- ${record?.hocKy?.ten ?? ''}` : ''}`}
				deCuongId={deCuongId}
				khoiChuongTrinh={khoiChuongTrinh}
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
