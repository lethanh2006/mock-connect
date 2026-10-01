import ModalExpandable from '@/components/Table/ModalExpandable';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ETrangThaiHocTap } from '@/services/DaoTao/constant';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty } from 'antd';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalHocPhan from '../../../DaoTao/DeCuongHocPhan/ModalHocPhan';
import ModalQuyDoiDiem from '../../QuyDoiDiem/components/Modal';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';
import './ModalChiTietDiem.less';

const SectionHeading = ({ title }: { title: string }) => (
	<div className='kqht-detail-heading'>
		<div className='kqht-detail-heading-title'>
			<h3>{title}</h3>
		</div>
		<span className='kqht-detail-heading-line' />
	</div>
);

const DetailField = ({ label, children, full }: { label: string; children?: ReactNode; full?: boolean }) => (
	<div className={full ? 'kqht-detail-field kqht-detail-field--full' : 'kqht-detail-field'}>
		<span className='kqht-detail-label'>{label}</span>
		<div className='kqht-detail-value'>{children || '--'}</div>
	</div>
);

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
				<span
					className={`kqht-detail-tag kqht-detail-tag--${trangThaiHienThi === ETrangThaiHocTap.CHUA_HOC ? 'muted' : 'info'}`}
				>
					{intl.formatMessage({
						id:
							trangThaiHienThi === ETrangThaiHocTap.CHUA_HOC
								? 'daotao.trangthaihoctap.chuaHoc'
								: 'daotao.trangthaihoctap.dangHoc',
					})}
				</span>
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
				<span className='kqht-detail-tag kqht-detail-tag--danger'>
					{intl.formatMessage({ id: 'lophocphan.id.ketqua.khongdat' })}
				</span>
			);
		}

		if (diemHienTai?.dat === true || trangThaiHoc === ETrangThaiHocTap.DA_HOC) {
			return <span className='kqht-detail-tag'>{intl.formatMessage({ id: 'lophocphan.id.ketqua.dat' })}</span>;
		}

		return null;
	};

	if (!visible) return null;

	const trangThaiContent = renderTrangThai();

	const renderHocPhanCt = (dsHocPhan?: ChuongTrinhDaoTao.THocPhanTuongQuan[] | null, label?: string) => {
		const danhSachHienThi = Array.isArray(dsHocPhan) && dsHocPhan[0]?.ten ? dsHocPhan : [];
		if (!danhSachHienThi.length) return null;

		return (
			<div className='kqht-detail-field kqht-detail-field--full'>
				<span className='kqht-detail-label'>{label}</span>
				<div className='kqht-detail-value'>
					<ul>
						{danhSachHienThi.map((item) => (
							<li key={item.ma}>
								{item.ma} - {item.ten}
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	};

	return (
		<>
			<ModalExpandable
				title={
					<span className='kqht-detail-modal-title'>
						{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.title' })}
					</span>
				}
				open={visible}
				onCancel={() => setVisible(false)}
				footer={null}
				width={1080}
			>
				<div className='kqht-detail'>
					<section className='kqht-detail-section'>
						<SectionHeading title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.thongtin' })} />
						<div className='kqht-detail-grid'>
							<DetailField label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hp' })}>
								{hocPhan?.ten ? <b>{hocPhan.ten}</b> : '--'}
							</DetailField>
							<DetailField label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.mahp' })}>
								{hocPhan?.ma}
							</DetailField>
							<DetailField label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.stc' })}>
								{hocPhan?.soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tc' })}
							</DetailField>
							<DetailField label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.trangthai' })}>
								{trangThaiContent}
							</DetailField>
						</div>
					</section>

					<section className='kqht-detail-section'>
						<SectionHeading title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chuongtrinh' })} />
						<div className='kqht-detail-grid'>
							<DetailField label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tt' })}>
								{khoiChuongTrinh?.soThuTuKy}
							</DetailField>
							<DetailField label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.khoikienthuc' })}>
								{khoiChuongTrinh?.khoiKienThuc?.ten ?? khoiChuongTrinh?.maKhoiKienThuc}
							</DetailField>
							{khoiChuongTrinh?.ten ? (
								<DetailField full label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tuchon' })}>
									{khoiChuongTrinh.ten}
								</DetailField>
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
								<DetailField full label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })}>
									{khoiChuongTrinh.chuyenNganh.ten}
								</DetailField>
							) : null}
						</div>
					</section>

					<section className='kqht-detail-section'>
						<SectionHeading title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chitietketqua' })} />
						{(trangThaiHoc === undefined || trangThaiHoc !== ETrangThaiHocTap.CHUA_HOC) && listDiem.length ? (
							listDiem
								.sort((a, b) => (b.maHocKy ?? '').localeCompare(a.maHocKy ?? ''))
								.map((diem, index) => (
									<div className='kqht-detail-attempt' key={diem._id ?? index}>
										<div className='kqht-detail-attempt-title'>
											<span>
												{`${intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hoclan' })} ${listDiem.length - index}`}
											</span>
											{diemHienTai?._id === diem._id ? (
												<span className='kqht-detail-tag'>
													{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.finalGrade' })}
												</span>
											) : null}
										</div>
										<DetailKetQuaHocTap diemHpSvHk={diem} />
									</div>
								))
						) : (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
						)}
					</section>
				</div>
			</ModalExpandable>

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
