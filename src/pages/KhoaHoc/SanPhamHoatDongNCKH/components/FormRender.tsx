import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { EKieuDuLieu, ELoaiThoiGianThucHien, ELoaiTruongThongTinTinh } from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';
import { ETrangThaiSanPham } from '@/services/KhoaHoc/SanPhamNCKH/constants';
import { ETextDisplay } from '@/services/QuyTrinh/LoaiHinh/constants';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Col, Form, Input, InputNumber, Modal, Popconfirm, Radio, Select, Space, Tooltip } from 'antd';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import SelectSanPhamNCKH from '../Select';
import { buildFilter } from './BuildFilter';
import FormTable from './FormTable';
import TableThanhVien from './TableThanhVien';
import ViewRender from './ViewRender';

const FormRender = (props: {
	cauHinh: LoaiHinhNCKH.TruongThongTin | LoaiHinhNCKH.Cot;
	formValues: any;
	form?: FormInstance;
	danhSachCauHinh?: LoaiHinhNCKH.Cot[];
	disable?: boolean;
	isDangThucHien?: boolean;
}) => {
	const { cauHinh } = props;
	const [visibleFormTable, setVisibleFormTable] = useState<boolean>(false);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});
	const {
		record: recordSanPham,
		setRecord: setRecordSanPham,
		searchSanPhamModel,
		ketQuaSearch,
		loadingSearchSanPham,
		setVisibleKetQuaSearch,
		setKetQuaSearch,
	} = useModel('khoahoc.sanphamnckh');
	const { danhSach } = useModel('khoahoc.danhmuc.chung');
	const { danhSach: danhSachNhanSu } = useModel('tochucnhansu.nhansu');
	const { record: recordLoaiHinh } = useModel('khoahoc.loaihinhnckh');
	const isChinhSuaSauDuyet =
		recordSanPham?.trangThaiSanPham === ETrangThaiSanPham.DUYET &&
		recordLoaiHinh?.cauHinhChinhSuaSauDuyet.choPhepChinhSuaSauDuyet;
	let component = <div />;
	let rule: any[] = [...rules.required];
	const isAdminKhaiHo = recordSanPham?.nguoiKhaiBao?.hoVaTen?.toLowerCase()?.includes('admin');

	const onCancelFormTable = () => {
		setVisibleFormTable(false);
	};

	const debounceCheckTrung = _.debounce((val) => {
		// if (val && recordSanPham?._id && recordLoaiHinh?.searchKey1 && recordLoaiHinh?.searchKey1 === cauHinh?.ma)
		// 	searchSanPhamModel(val, recordSanPham?._id);
		// else {
		// 	setKetQuaSearch([]);
		// }
	}, 5000);

	const cauHinhLoaiHinh = props?.danhSachCauHinh || recordLoaiHinh?.cauHinhLoaiHinh;

	const listCauHinhPhuThuocDuLieu = cauHinhLoaiHinh?.filter((item) => item.layDuLieuTu === cauHinh.ma);

	const soLuongThanhVien = Form.useWatch(['soLuongThanhVien'], props.form);

	const truongThongTinLienKetDuLieuMacDinh = recordLoaiHinh?.cauHinhLoaiHinh?.find(
		(item) => item.truongMapDanhMucDefaultValue === cauHinh.ma,
	);

	const isDeTai = recordLoaiHinh?.ten?.toLowerCase()?.includes('thực hiện đề tài') ?? false;

	const tinhTrangDeTai = props.formValues?.tinhTrangCuaDeTai;
	const isDeTaiNghiemThu =
		tinhTrangDeTai &&
		[
			'Đã nghiệm thu và có Quyết định công nhận kết quả đề tài',
			'Đã nghiệm thu và chưa có Quyết định công nhận kết quả đề tài',
		].includes(tinhTrangDeTai);

	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.TEXT:
			if (cauHinh.ten === 'Đơn vị thực hiện') {
				component = <SelectDonVi fieldValue='ten' />;
			} else if (cauHinh.textDisplay === ETextDisplay.TEXT_AREA) {
				component = <Input.TextArea disabled={cauHinh?.readonly} placeholder={cauHinh.ten} />;
			} else if (cauHinh.textDisplay === ETextDisplay.TEXT_EDITOR) {
				component = <TinyEditor height={300} disabled={cauHinh?.readonly} />;
			} else
				component = cauHinh.laDangMang ? (
					<Select disabled={props.disable} placeholder={cauHinh.ten} mode='tags' />
				) : (
					<Input
						onChange={(e) => debounceCheckTrung(e?.target?.value?.trim())}
						disabled={props.disable}
						placeholder={cauHinh.ten}
					/>
				);
			rule = [...(cauHinh.laDangMang ? [] : rules.text), ...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.CAN_BO:
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			component = (
				<SelectNhanSuDebounce
					disabled={props.disable}
					onChange={(val: any) => {
						if (!val) return;
						const recNhanSu: any = danhSachNhanSu.find((item) => item.ssoId === val);
						if (props.form && listCauHinhPhuThuocDuLieu?.length) {
							const objDuLieuPhuThuoc: any = {};
							listCauHinhPhuThuocDuLieu.map((item) => {
								objDuLieuPhuThuoc[item.ma] = item.truongLayDuLieu
									? _.get(recNhanSu, item.truongLayDuLieu, undefined)
									: recNhanSu;
							});
							props.form.setFieldsValue(objDuLieuPhuThuoc);
						}
					}}
				/>
			);
			break;

		case EKieuDuLieu.BOOLEAN:
			component = (
				<Radio.Group
					disabled={props.disable}
					options={[
						{ value: true, label: 'Có' },
						{ value: false, label: 'Không' },
					]}
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.DANHMUC:
			component = (
				<Select
					disabled={props.disable}
					onChange={(val) => {
						if (truongThongTinLienKetDuLieuMacDinh) {
							const index =
								danhSach.find((item) => item.maDanhMuc === cauHinh.maDanhMuc)?.danhSachGiaTri?.indexOf(val) ?? 0;
							props?.form?.setFieldsValue({
								[truongThongTinLienKetDuLieuMacDinh.ma]:
									truongThongTinLienKetDuLieuMacDinh?.arrayMapDanhMucDefaultValue?.[index],
							});
						}
					}}
					showSearch
					mode={cauHinh.laDangMang ? 'multiple' : undefined}
					allowClear
					placeholder='Chọn giá trị'
					options={danhSach
						.find((item) => item.maDanhMuc === cauHinh.maDanhMuc)
						?.danhSachGiaTri.map((item: any) => ({ value: item, label: item }))}
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.NUMBER:
			component = cauHinh.laDangMang ? (
				<Select disabled={props.disable} mode='tags' placeholder={cauHinh.ten} />
			) : (
				<InputNumber
					disabled={props.disable}
					// formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					style={{ width: '100%' }}
					placeholder='Nhập giá trị'
				/>
			);
			rule = [
				...(cauHinh.laDangMang ? rules.arrNumber(1000000000, 0) : []),
				...(cauHinh.batBuoc ? rules.required : []),
			];
			break;
		case EKieuDuLieu.DECIMAL:
			component = cauHinh.laDangMang ? (
				<Select disabled={props.disable} mode='tags' placeholder={cauHinh.ten} />
			) : (
				<InputNumber disabled={props.disable} style={{ width: '100%' }} placeholder='Nhập giá trị' />
			);
			rule = [
				...(cauHinh.laDangMang ? rules.arrNumber(1000000000, 0) : []),
				...(cauHinh.batBuoc ? rules.required : []),
			];
			break;

		case EKieuDuLieu.HOUR:
			component = (
				<MyDatePicker
					disabled={props.disable}
					style={{ width: '100%' }}
					allowClear
					format={'DD/MM/YYYY HH:mm'}
					showTime
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.DATE:
			component = <MyDatePicker disabled={props.disable} style={{ width: '100%' }} allowClear format={'DD/MM/YYYY'} />;
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.MONTH:
			component = (
				<MyDatePicker disabled={props.disable} style={{ width: '100%' }} allowClear format={'MM/YYYY'} picker='month' />
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.FILE:
			rule = [...(cauHinh.batBuoc ? rules.fileRequired : [])];
			component = (
				<UploadFile
					disabled={props.disable}
					maxCount={cauHinh.laDangMang ? 5 : 1}
					otherProps={{
						accept: '.docx, .pdf',
						showUploadList: { showDownloadIcon: false },
					}}
				/>
			);
			break;

		case EKieuDuLieu.DANHSACH:
			const columnsDs: IColumn<any>[] = [];
			recordLoaiHinh?.cauHinhLoaiHinh
				?.filter((item) =>
					recordLoaiHinh?.danhSachCotHienThi?.length ? recordLoaiHinh.danhSachCotHienThi.includes(item.ma) : item,
				)
				.map((item) => {
					if (item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH) return;
					columnsDs.push({
						title: item.ten,
						dataIndex: [`${item.ma}`],
						width: 200,
						align: 'center',
						render: (val, rec) => <ViewRender cauHinh={item} recordSanPham={rec} />,
						...buildFilter(item, danhSach),
					});
				});
			columnsDs.push({
				title: 'Thao tác',
				align: 'center',
				width: 60,
				fixed: 'right',
				render: (rec: any) => (
					<>
						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => {
									if (recordSanPham) {
										setRecordSanPham({
											...recordSanPham,
											thongTinKhaiBao: recordSanPham?.thongTinKhaiBao?.map((item) => {
												if (item.ma !== cauHinh.ma) return item;
												else
													return {
														...item,
														value: recordSanPham.thongTinKhaiBao
															?.find((ele) => ele.ma === cauHinh.ma)
															?.value?.map((ele: any, index: number) => ({ ...ele, index: index + 1 }))
															?.filter((ele: any) => ele.index !== rec.index),
													};
											}),
										});
									}
								}}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topRight'
							>
								<Button size='small' danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				),
			});

			rule = cauHinh?.batBuoc
				? [
						{
							validator: (__: { field: string | number }, value: any, callback: any) => {
								if (!recordSanPham?.thongTinKhaiBao?.find((item) => item.ma === cauHinh.ma)?.value?.length)
									callback('');
								callback();
							},
							message: 'Bắt buộc',
							required: true,
						},
				  ]
				: [];
			component = (
				<>
					<Space wrap>
						<Button
							size='small'
							type='primary'
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setRecordTable(undefined);
								setVisibleFormTable(true);
								setEditFormTable(false);
							}}
						>
							Thêm mới
						</Button>
					</Space>

					<TableStaticData
						otherProps={{ pagination: false }}
						addStt
						size='small'
						data={recordSanPham?.thongTinKhaiBao
							?.find((item) => item.ma === cauHinh.ma)
							?.value?.map((item: any, index: number) => ({
								...item,
								index: index + 1,
							}))}
						columns={columnsDs}
					/>
					<Modal
						destroyOnClose
						width={1000}
						footer={false}
						title={`${editFormTable ? 'Chỉnh sửa' : 'Thêm mới'} ${cauHinh.ten}`}
						visible={visibleFormTable}
						onCancel={onCancelFormTable}
					>
						<SelectSanPhamNCKH
							select={true}
							handleSelect={(data) => {
								const obj: any = {
									...recordSanPham,
									thongTinKhaiBao: { ...recordSanPham?.thongTinKhaiBao, [cauHinh.ma]: data },
								};

								setRecordSanPham(obj);
								onCancelFormTable();
							}}
							loaiHinhActive={cauHinh?.loaiHinhNckhId}
						/>
					</Modal>
				</>
			);
			break;

		case EKieuDuLieu.TABLE:
			const columns: IColumn<any>[] = [];
			cauHinh?.danhSachCot
				?.filter((item) =>
					cauHinh?.danhSachCotHienThi?.length ? cauHinh?.danhSachCotHienThi?.includes(item.ma) : item,
				)
				?.map((item) => {
					columns.push({
						title: item.ten,
						dataIndex: item.ma,
						align: 'center',
						width: 100,
						render: (val, rec) => {
							return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
						},
						...buildFilter(item, danhSach),
					});
				});
			columns.push({
				title: 'Thao tác',
				align: 'center',
				width: 60,
				hide: props.disable,
				fixed: 'right',
				render: (rec: any) => (
					<>
						<Tooltip title='Chỉnh sửa'>
							<Button
								size='small'
								onClick={() => {
									setVisibleFormTable(true);
									setRecordTable(rec);
									setEditFormTable(true);
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>

						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => {
									if (recordSanPham) {
										setRecordSanPham({
											...recordSanPham,
											thongTinKhaiBao: recordSanPham?.thongTinKhaiBao?.map((item) => {
												if (item.ma !== cauHinh.ma) return item;
												else
													return {
														...item,
														value: recordSanPham.thongTinKhaiBao
															?.find((ele) => ele.ma === cauHinh.ma)
															?.value?.map((ele: any, index: number) => ({ ...ele, index: index + 1 }))
															?.filter((ele: any) => ele.index !== rec.index),
													};
											}),
										});
									}
								}}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topRight'
							>
								<Button size='small' danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				),
			});

			rule = cauHinh?.batBuoc
				? [
						{
							validator: (__: { field: string | number }, value: any, callback: any) => {
								if (!recordSanPham?.thongTinKhaiBao?.find((item) => item.ma === cauHinh.ma)?.value?.length)
									callback('');
								callback();
							},
							message: 'Bắt buộc',
							required: true,
						},
				  ]
				: [];

			component = (
				<>
					{
						<Space wrap>
							<Button
								disabled={props.disable}
								size='small'
								type='primary'
								icon={<PlusCircleOutlined />}
								onClick={() => {
									setRecordTable(undefined);
									setVisibleFormTable(true);
									setEditFormTable(false);
								}}
							>
								Thêm mới
							</Button>
						</Space>
					}

					<TableStaticData
						otherProps={{ pagination: false }}
						addStt
						size='small'
						data={recordSanPham?.thongTinKhaiBao
							?.find((item) => item.ma === cauHinh.ma)
							?.value?.map((item: any, index: number) => ({
								...item,
								index: index + 1,
							}))}
						columns={columns.filter((item) => item.hide !== true)}
					/>
					<Modal
						zIndex={1002}
						destroyOnClose
						width={700}
						footer={false}
						title={`${editFormTable ? 'Chỉnh sửa' : 'Thêm mới'} ${cauHinh.ten}`}
						visible={visibleFormTable}
						onCancel={onCancelFormTable}
					>
						<FormTable record={recordTable} onCancel={onCancelFormTable} edit={editFormTable} cauHinh={cauHinh} />
					</Modal>
				</>
			);
			break;

		default:
			break;
	}

	const checkTruongThongTinLienQuan = useMemo(() => {
		let check = true;
		if (!cauHinh?.danhSachTruongThongTinLienQuan?.length) return true;
		cauHinh?.danhSachTruongThongTinLienQuan?.map((thongTin) => {
			const valueInForm = props?.formValues?.[thongTin?.truongThongTinLienQuan];
			if (valueInForm === null || valueInForm === undefined || (_.isArray(valueInForm) && !valueInForm?.length)) {
				check = false;
			}
			if (!thongTin.giaTriLienQuan.includes && valueInForm !== thongTin?.giaTriLienQuan) {
				check = false;
			}
			if (thongTin.giaTriLienQuan.includes) {
				if (!thongTin?.giaTriLienQuan?.includes(valueInForm) && !_.isArray(valueInForm)) {
					check = false;
				}

				if (_.isArray(valueInForm)) {
					check = false;
					valueInForm?.map((item: any) => {
						if (thongTin?.giaTriLienQuan?.includes(item)) {
							check = true;
						}
					});
				}
			}
		});
		return check;
	}, [cauHinh?.danhSachTruongThongTinLienQuan, props?.formValues]);

	const truongThongTinTinh = recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh?.filter(
		(item) => item.maTruongThongTinDungSau === cauHinh.ma,
	);

	return checkTruongThongTinLienQuan ? (
		<>
			<Col xs={24} sm={24} md={cauHinh?.colspan}>
				<Form.Item
					extra={
						cauHinh?.ghiChu || (recordLoaiHinh?.searchKey1 === cauHinh.ma && ketQuaSearch.length) ? (
							<span>
								{cauHinh?.ghiChu && <div>{cauHinh?.ghiChu}</div>}
								{/* {recordLoaiHinh?.searchKey1 === cauHinh.ma && ketQuaSearch.length ? (
									<Button style={{ padding: 0 }} loading={loadingSearchSanPham} type='link'>
										{loadingSearchSanPham ? (
											'Đang kiểm tra hoạt động/sản phẩm tương đồng trong hệ thống'
										) : (
											<span>
												Có {ketQuaSearch.length} sản phầm/hoạt động tương đồng trong hệ thống (
												<a onClick={() => setVisibleKetQuaSearch(true)}>Xem chi tiết</a>)
											</span>
										)}
									</Button>
								) : null} */}
							</span>
						) : null
					}
					name={cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE ? cauHinh.ma : `table||${cauHinh.ma}`}
					label={cauHinh.ten}
					rules={rule}
				>
					{component}
				</Form.Item>
			</Col>
			{truongThongTinTinh?.map((item) => {
				let element = <div />;
				if (item.display === false) return element;
				// if (item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.VAI_TRO) {
				// 	element = (
				// 		<Col xs={24} sm={24} md={item?.colspan ? +item.colspan : undefined}>
				// 			<Form.Item
				// 				extra={
				// 					<div>
				// 						Cán bộ/giảng viên có thể tự nhập vai trò nếu vai trò không thuộc các giá trị có sẵn mà hệ thống đưa
				// 						ra
				// 					</div>
				// 				}
				// 				name='vaiTro'
				// 				label={item?.label ?? 'Vai trò'}
				// 				rules={[...rules.required]}
				// 			>
				// 				<Select
				// 					options={recordLoaiHinh?.danhSachVaiTroThanhVienKhaDung?.map((ele) => ({ label: ele, value: ele }))}
				// 					mode='tags'
				// 					placeholder='Vai trò'
				// 				/>
				// 			</Form.Item>
				// 		</Col>
				// 	);
				// } else
				if (
					[ELoaiTruongThongTinTinh.THOI_GIAN_BAT_DAU, ELoaiTruongThongTinTinh.THOI_GIAN_KET_THUC].includes(
						item.loaiTruongThongTinTinh,
					)
				) {
					element = (
						<Col xs={24} sm={24} md={item?.colspan ? +item.colspan : undefined}>
							<Form.Item
								name='thoiGian'
								label={item?.label ?? `${recordLoaiHinh?.startLabel} - ${recordLoaiHinh?.endLabel}`}
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									// disabled={isChinhSuaSauDuyet}
									format={
										recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
											? 'YYYY'
											: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
											? 'MM/YYYY'
											: 'DD/MM/YYYY'
									}
									placeholder={['Từ', 'đến']}
									picker={
										recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
											? 'year'
											: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
											? 'month'
											: 'date'
									}
								/>
							</Form.Item>
						</Col>
					);
				} else if ([ELoaiTruongThongTinTinh.MOC_THOI_GIAN].includes(item.loaiTruongThongTinTinh)) {
					element = (
						<Col xs={24} sm={24} md={item?.colspan ? +item.colspan : undefined}>
							<Form.Item
								name={['thongTinThoiGian', 'timeline']}
								label={recordLoaiHinh?.timelineLabel}
								rules={[...rules.required]}
							>
								<MyDatePicker
									// disabled={isChinhSuaSauDuyet}
									format={
										recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
											? 'YYYY'
											: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
											? 'MM/YYYY'
											: 'DD/MM/YYYY'
									}
									pickerStyle={
										recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
											? 'year'
											: recordLoaiHinh?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
											? 'month'
											: 'date'
									}
									placeholder={'Chọn thời gian'}
								/>
							</Form.Item>
						</Col>
					);
				} else if (item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.DANH_SACH_THANH_VIEN) {
					element = (
						<>
							<Col xs={24} sm={24} md={24}>
								<Form.Item name='soLuongThanhVien' label='Số lượng thành viên' rules={[...rules.required]}>
									<InputNumber
										// disabled={isChinhSuaSauDuyet}
										addonAfter='Thành viên'
										style={{ width: '100%' }}
										min={1}
										max={100}
										placeholder='Số lượng thành viên'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<div className='ant-descriptions-title' style={{ marginBottom: 12 }}>
									{props.isDangThucHien ? 'Chủ biên và thành viên' : item?.label ?? 'Danh sách thành viên'}
								</div>
								<TableThanhVien
									isDangThucHien={props.isDangThucHien}
									form={props.form}
									formValues={props.formValues}
									// mode={isChinhSuaSauDuyet ? 'view' : 'edit'}
									mode={'edit'}
								/>
							</Col>
							{!props.isDangThucHien &&
								soLuongThanhVien &&
								soLuongThanhVien > 1 &&
								recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh?.find(
									(ele) => ele.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.MINH_CHUNG_CHIA_GIO,
								)?.display !== false &&
								!isChinhSuaSauDuyet && (
									<Col xs={24} sm={24} md={24}>
										<Form.Item
											name='danhSachMinhChung'
											label={recordLoaiHinh?.tinhDiem ? 'Minh chứng chia giờ, điểm' : 'Minh chứng chia giờ'}
											rules={
												!isAdminKhaiHo && (!isDeTai || (isDeTai && isDeTaiNghiemThu)) ? [...rules.required] : undefined
											}
										>
											<UploadFile
												// disabled={isChinhSuaSauDuyet}
												maxCount={5}
												otherProps={{
													accept: '.docx, .pdf, .xlsx, .xls, .png, .jpeg, .jpg',
													showUploadList: { showDownloadIcon: false },
												}}
											/>
										</Form.Item>
									</Col>
								)}
						</>
					);
				}

				return element;
			})}
		</>
	) : null;
};

export default FormRender;
