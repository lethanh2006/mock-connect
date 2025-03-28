import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import {
	ECheDoHienThi,
	EKieuDuLieu,
	ELoaiThoiGianThucHien,
	ELoaiTruongThongTinTinh,
} from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';
import {
	ETrangThaiSanPham,
	MapKeyColorTrangThaiSanPham,
	MapKeyTextTrangThaiSanPham,
} from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import { CheckOutlined, CloseOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Select, Tag } from 'antd';
import Settings from 'config/defaultSettings';
import moment from 'moment';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import FormXetDuyet from './FormXetDuyet';
import TableThanhVien from './TableThanhVien';
import ViewRender from './ViewRender';
import { primaryColor } from '@/services/base/constant';

const ViewSanPham = (props: {
	getData: any;
	onCancel: any;
	mode: 'handle' | 'view';
	recordSP?: SanPhamNCKH.IRecord;
	recordLH?: LoaiHinhNCKH.IRecord;
	danhSachThanhVien?: SanPhamNCKH.ThanhVienNCKH[];
	isDangThucHien?: boolean;
}) => {
	const { record: recordSanPhamModel } = useModel('khoahoc.sanphamnckh');
	const { record: recordLoaiHinhModel } = useModel('khoahoc.loaihinhnckh');
	const { danhSach } = useModel('khoahoc.danhmuc.namhoc');
	const [recordNamHocGio, setRecordNamHocGio] = useState<NamHoc.IRecord | undefined>(danhSach?.[0]);
	const [recordNamHocDiem, setRecordNamHocDiem] = useState<NamHoc.IRecord | undefined>(danhSach?.[0]);
	const recordSanPham = props.recordSP || recordSanPhamModel;
	const recordLoaiHinh = props.recordLH || recordLoaiHinhModel;
	const [visibleFormDuyet, setVisibleFormDuyet] = useState<boolean>(false);
	const [trangThai, setTrangThai] = useState<ETrangThaiSanPham>(ETrangThaiSanPham.CHUA_TIEP_NHAN);
	const onCancelFormDuyet = useCallback(() => {
		setVisibleFormDuyet(false);
	}, []);

	const handleDuyet = (trangThaiTemp: ETrangThaiSanPham) => {
		setVisibleFormDuyet(true);
		setTrangThai(trangThaiTemp);
	};

	const ThongTinTrangThaiDuyet = (
		<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
			<Descriptions.Item span={3} label='Người khai báo'>
				{recordSanPham?.nguoiKhaiBao.hoVaTen}
			</Descriptions.Item>
			{recordSanPham && (
				<Descriptions.Item span={3} label='Trạng thái'>
					<Tag color={MapKeyColorTrangThaiSanPham[recordSanPham?.trangThaiSanPham]}>
						{MapKeyTextTrangThaiSanPham[recordSanPham.trangThaiSanPham]}
					</Tag>
				</Descriptions.Item>
			)}
			{recordSanPham &&
				[
					ETrangThaiSanPham.CHINH_SUA_LAI,
					ETrangThaiSanPham.DUYET,
					ETrangThaiSanPham.KHONG_DUYET,
					ETrangThaiSanPham.DA_CHINH_SUA_LAI,
				].includes(recordSanPham?.trangThaiSanPham) && (
					<Descriptions.Item span={6} label='Ghi chú tiếp nhận'>
						{recordSanPham?.ghiChuTiepNhan}
					</Descriptions.Item>
				)}
		</Descriptions>
	);

	const ThongTinChung = (
		<>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<>
					{!recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh?.find(
						(item) =>
							item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.THOI_GIAN_BAT_DAU ||
							item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.THOI_GIAN_KET_THUC,
					)?.maTruongThongTinDungSau &&
						recordLoaiHinh &&
						[ELoaiThoiGianThucHien.NAM, ELoaiThoiGianThucHien.NGAYTHANGNAM, ELoaiThoiGianThucHien.THANGNAM].includes(
							recordLoaiHinh?.loaiThoiGianThucHien,
						) && (
							<Descriptions.Item span={6} label={`${recordLoaiHinh.startLabel} - ${recordLoaiHinh.endLabel}`}>
								{moment(recordSanPham?.thongTinThoiGian?.start).format(
									recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
										? 'YYYY'
										: recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
										? 'MM/YYYY'
										: 'DD/MM/YYYY',
								)}{' '}
								{moment(recordSanPham?.thongTinThoiGian?.end).format(
									recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
										? 'YYYY'
										: recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
										? 'MM/YYYY'
										: 'DD/MM/YYYY',
								)}
							</Descriptions.Item>
						)}

					{!recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh?.find(
						(item) => item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.MOC_THOI_GIAN,
					)?.maTruongThongTinDungSau &&
						recordLoaiHinh &&
						[
							ELoaiThoiGianThucHien.THOIGIANCUTHE_DDMMYYYY,
							ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY,
							ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY,
						].includes(recordLoaiHinh?.loaiThoiGianThucHien) && (
							<Descriptions.Item span={6} label={recordLoaiHinh.timelineLabel}>
								{moment(recordSanPham?.thongTinThoiGian?.timeline).format(
									recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
										? 'YYYY'
										: recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
										? 'MM/YYYY'
										: 'DD/MM/YYYY',
								)}
							</Descriptions.Item>
						)}

					{recordSanPham?._id &&
						recordLoaiHinh?.cauHinhLoaiHinh
							.filter((item) => item.kieuDuLieu !== EKieuDuLieu.TABLE && item.kieuDuLieu !== EKieuDuLieu.DANHSACH)
							.filter((item) => {
								if (!item.cheDoHienThi) return item;
								if (props.isDangThucHien)
									return [ECheDoHienThi.THUC_HIEN, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
								else return [ECheDoHienThi.SAN_PHAM, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
							})
							.map((item) => {
								const checkRender =
									!item?.truongThongTinLienQuan ||
									(item?.truongThongTinLienQuan &&
										(recordSanPham?.thongTinKhaiBao?.find((ele) => ele.ma === item.truongThongTinLienQuan)?.value ===
											item?.giaTriLienQuan ||
											(item.giaTriLienQuan.includes &&
												item?.giaTriLienQuan?.includes(
													recordSanPham?.thongTinKhaiBao?.find((ele) => ele.ma === item.truongThongTinLienQuan)?.value,
												)) ||
											(item?.giaTriLienQuan?.some &&
												item?.giaTriLienQuan?.some((ele: any) =>
													recordSanPham?.thongTinKhaiBao
														?.find((tt) => tt.ma === item.truongThongTinLienQuan)
														?.value?.includes(ele),
												))));

								return checkRender ? (
									<>
										<Descriptions.Item key={item.ma} span={item?.colspan ? item.colspan / 4 : 6} label={item.ten}>
											<ViewRender cauHinh={item} recordSanPham={recordSanPham} />
										</Descriptions.Item>
										{recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh
											?.filter((ele) => ele.maTruongThongTinDungSau === item.ma)
											?.map((ele) => {
												let element = null;
												if (ele.display === false) return element;
												if (
													[
														ELoaiTruongThongTinTinh.THOI_GIAN_BAT_DAU,
														ELoaiTruongThongTinTinh.THOI_GIAN_KET_THUC,
													].includes(ele.loaiTruongThongTinTinh)
												) {
													element = (
														<Descriptions.Item
															span={ele?.colspan ? ele.colspan / 4 : 6}
															label={ele?.label ?? `${recordLoaiHinh?.startLabel} - ${recordLoaiHinh?.endLabel}`}
														>
															{moment(recordSanPham?.thongTinThoiGian?.start).format(
																recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
																	? 'YYYY'
																	: recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
																	? 'MM/YYYY'
																	: 'DD/MM/YYYY',
															)}{' '}
															{moment(recordSanPham?.thongTinThoiGian?.end).format(
																recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
																	? 'YYYY'
																	: recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
																	? 'MM/YYYY'
																	: 'DD/MM/YYYY',
															)}
														</Descriptions.Item>
													);
												} else if ([ELoaiTruongThongTinTinh.MOC_THOI_GIAN].includes(ele.loaiTruongThongTinTinh)) {
													element = (
														<Descriptions.Item
															span={ele?.colspan ? ele.colspan / 4 : 6}
															label={ele?.label || recordLoaiHinh.timelineLabel}
														>
															{moment(recordSanPham?.thongTinThoiGian?.timeline).format(
																recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
																	? 'YYYY'
																	: recordLoaiHinh.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
																	? 'MM/YYYY'
																	: 'DD/MM/YYYY',
															)}
														</Descriptions.Item>
													);
												}

												return element;
											})}
									</>
								) : null;
							})}
				</>
			</Descriptions>
			{recordSanPham?._id &&
				recordLoaiHinh?.cauHinhLoaiHinh
					.filter((item) => {
						return item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH;
					})
					.filter((item) => {
						if (props.isDangThucHien)
							return [ECheDoHienThi.THUC_HIEN, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
						else return [ECheDoHienThi.SAN_PHAM, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
					})
					.map((item) => (
						<>
							<Descriptions>
								<Descriptions.Item span={6} label={item.ten}>
									{' '}
								</Descriptions.Item>
							</Descriptions>
							<ViewRender cauHinh={item} recordSanPham={recordSanPham} />
							<br />
						</>
					))}
			<Descriptions>
				<Descriptions.Item
					span={6}
					label={
						recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh?.find(
							(item) => item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.DANH_SACH_THANH_VIEN,
						)?.label ?? 'Danh sách thành viên'
					}
				>
					{' '}
				</Descriptions.Item>
			</Descriptions>
			<TableThanhVien isDangThucHien={props.isDangThucHien} data={props?.danhSachThanhVien} mode='view' />
			<br />
			{!props.isDangThucHien && recordSanPham?.soLuongThanhVien && recordSanPham.soLuongThanhVien > 1 && (
				<Descriptions>
					<Descriptions.Item
						span={6}
						label={recordLoaiHinh?.tinhDiem ? 'Minh chứng chia giờ, điểm' : 'Minh chứng chia giờ'}
					>
						<div>
							{recordSanPham &&
								recordSanPham?.danhSachMinhChung?.map((item: string) => (
									<Tag color={primaryColor} key={item}>
										<a href={item} target='_blank' rel='noreferrer'>
											Xem tập tin
										</a>
									</Tag>
								))}
						</div>
					</Descriptions.Item>
				</Descriptions>
			)}
		</>
	);

	const TableDuyet = useCallback(
		(isGio: boolean) => {
			const columns: IColumn<SanPhamNCKH.KetQuaTinhGioThanhVien>[] = [
				{
					title: 'Thành viên',
					dataIndex: 'ssoId',
					width: 200,
					render: (val) => {
						const recThanhVien = recordSanPham?.danhSachThanhVien.find((item) => item.ssoId === val);

						return (
							<div>
								{recThanhVien?.hoVaTen} ({recThanhVien?.danhSachVaiTro.join(', ')})
							</div>
						);
					},
				},
				{
					title: `Tổng ${isGio ? 'giờ' : 'điểm'}`,
					dataIndex: 'tongGio',
					align: 'center',
					width: 150,
				},
				{
					title: 'Chi tiết',
					width: 150,
					render: (val: SanPhamNCKH.KetQuaTinhGioThanhVien) => {
						return (
							<div>
								{val?.danhSachThongTinGio?.map((item) => (
									<div key={item.index}>
										- {item?.tongGio ?? 0} {isGio ? 'giờ' : 'điểm'} {item.moTa ? `(${item.moTa})` : ''}
									</div>
								))}
							</div>
						);
					},
				},
			];

			const recYeuCauQuyDoiGio = recordSanPham?.[isGio ? 'danhSachYeuCauQuyDoiGio' : 'danhSachYeuCauQuyDoiDiem']?.find(
				(item) => (isGio ? item.namHocId === recordNamHocGio?._id : item.namHocId === recordNamHocDiem?._id),
			);

			const tongGio = recYeuCauQuyDoiGio?.danhSachKetQuaTinhGioThanhVien?.reduce(
				(preVal, curVal) => preVal + curVal.tongGio,
				0,
			);

			return (
				<TableStaticData
					totalComponent={
						<div className='total'>
							Tổng {isGio ? 'giờ' : 'điểm'}:<span>{tongGio || 0}</span>
						</div>
					}
					otherProps={{
						pagination: false,
						size: 'small',
					}}
					addStt
					hasTotal
					data={recYeuCauQuyDoiGio?.danhSachKetQuaTinhGioThanhVien ?? []}
					columns={columns}
				>
					<Select
						style={{ width: 200 }}
						placeholder='Lọc theo năm học'
						value={isGio ? recordNamHocGio?._id : recordNamHocDiem?._id}
						options={danhSach.map((item) => ({ value: item._id, label: item.tenNamHoc }))}
						onChange={(val) => {
							if (isGio) setRecordNamHocGio(danhSach?.find((item) => item._id === val));
							else setRecordNamHocDiem(danhSach?.find((item) => item._id === val));
						}}
					/>
				</TableStaticData>
			);
		},
		[recordSanPham?._id, recordNamHocGio?._id, danhSach.length, recordNamHocDiem?._id],
	);

	return (
		<>
			{ThongTinTrangThaiDuyet}
			{ThongTinChung}
			<br />
			{/* <Descriptions>
				<Descriptions.Item label='Khai báo giờ chuẩn NCKH'>{''}</Descriptions.Item>
			</Descriptions>
			{TableDuyet(true)} */}
			{/* {recordLoaiHinh?.tinhDiem && (
				<>
					<br />
					<Descriptions>
						<Descriptions.Item label='Khai báo điểm sản phẩm NCKH'>{''}</Descriptions.Item>
					</Descriptions>
					{TableDuyet(false)}
				</>
			)} */}

			<div className='form-footer'>
				{recordSanPham &&
					[ETrangThaiSanPham.CHUA_TIEP_NHAN, ETrangThaiSanPham.DA_CHINH_SUA_LAI].includes(
						recordSanPham?.trangThaiSanPham,
					) &&
					props.mode === 'handle' && (
						<>
							<Button onClick={() => handleDuyet(ETrangThaiSanPham.DUYET)} icon={<CheckOutlined />} type='primary'>
								{ETrangThaiSanPham.DUYET}
							</Button>
							<Button
								onClick={() => handleDuyet(ETrangThaiSanPham.KHONG_DUYET)}
								icon={<StopOutlined />}
								type='primary'
								danger
							>
								{ETrangThaiSanPham.KHONG_DUYET}
							</Button>
							<Button
								onClick={() => handleDuyet(ETrangThaiSanPham.CHINH_SUA_LAI)}
								icon={<EditOutlined />}
								type='primary'
							>
								Yêu cầu chỉnh sửa
							</Button>
						</>
					)}
				<Button icon={<CloseOutlined />} onClick={() => props.onCancel()}>
					Hủy
				</Button>
			</div>

			<Modal
				footer={false}
				visible={visibleFormDuyet}
				onCancel={onCancelFormDuyet}
				title={`${trangThai} sản phẩm, hoạt động NCKH`}
			>
				<FormXetDuyet trangThai={trangThai} onCancel={onCancelFormDuyet} getData={props.getData} />
			</Modal>
		</>
	);
};

export default ViewSanPham;
