import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Radio,
	Select,
	Space,
	Tooltip,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import FormTable from './FormTable';
import ViewRender from './ViewRender';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';
import { EKieuDuLieu, ELoaiThoiGianThucHien, ELoaiTruongThongTinTinh } from '@/services/QuyTrinh/LoaiHinh/constants';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { LoaiDefaultValue } from '@/services/QuyTrinh/MauDon/constants';
import { getDataDefault } from '@/services/QuyTrinh/MauDon/maudon';

const FormRender = (props: {
	cauHinh: LoaiHinh.TruongThongTin | LoaiHinh.Cot;
	formValues: any;
	form?: FormInstance;
}) => {
	const { cauHinh, form } = props;
	const [visibleFormTable, setVisibleFormTable] = useState<boolean>(false);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});
	// const { record: recordQuyTrinhForm, setRecord: setrecordQuyTrinhForm } = useModel('quanlykhoahoc.sanphamnckh');
	// const { danhSach } = useModel('quanlykhoahoc.danhmuc.chung');
	const { record: recordLoaiHinh } = useModel('quytrinh.loaihinh');
	const { recordQuyTrinhForm, setRecordQuyTrinhForm } = useModel('quytrinh.quanlyquytrinh');
	const [dataDefault, setDataDefault] = useState<string>();
	let component = <div />;
	let rule: any[] = [...rules.required];

	const onCancelFormTable = () => {
		setVisibleFormTable(false);
	};
	const handleRenderDefaultValue = async (type: LoaiDefaultValue) => {
		try {
			const res = await getDataDefault(type);
			if (res) {
				// setDataDefault (res?.data?.data?.value as string);
				if (form) {
					form.setFieldsValue({
						...form.getFieldsValue(),
						[cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE ? cauHinh.ma : `table||${cauHinh.ma}`]: res?.data?.data?.value,
					});
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
		}
	};
	useEffect(() => {
		if (cauHinh && cauHinh?.loaiDefaultValue) {
			if (cauHinh?.loaiDefaultValue === LoaiDefaultValue.CUSTOM) {
				if (form) {
					form.setFieldsValue({
						...form.getFieldsValue(),
						[cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE ? cauHinh.ma : `table||${cauHinh.ma}`]:
							cauHinh?.customDefaultValue,
					});
				}
			} else {
				handleRenderDefaultValue(cauHinh?.loaiDefaultValue as LoaiDefaultValue);
			}
		}
	}, [cauHinh]);
	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.TEXT:
			if (cauHinh.textarea) {
				component = <Input.TextArea disabled={cauHinh?.readonly} placeholder={cauHinh.ten} />;
			} else
				component = cauHinh.laDangMang ? (
					<Select disabled={cauHinh?.readonly} placeholder={cauHinh.ten} mode='tags' />
				) : (
					<Input disabled={cauHinh?.readonly} placeholder={cauHinh.ten} />
				);
			rule = [...(cauHinh.laDangMang ? [] : rules.text), ...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.CAN_BO:
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			component = <SelectNhanSuDebounce disabled={cauHinh?.readonly} />;
			break;

		case EKieuDuLieu.BOOLEAN:
			component = (
				<Radio.Group
					disabled={cauHinh?.readonly}
					options={[
						{ value: true, label: 'Có' },
						{ value: false, label: 'Không' },
					]}
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;

		// case EKieuDuLieu.DANHMUC:
		// 	component = (
		// 		<Select
		// 			mode={cauHinh.laDangMang ? 'multiple' : undefined}
		// 			allowClear
		// 			placeholder='Chọn giá trị'
		// 			options={danhSach
		// 				.find((item) => item.maDanhMuc === cauHinh.maDanhMuc)
		// 				?.danhSachGiaTri.map((item: any) => ({ value: item, label: item }))}
		// 		/>
		// 	);
		// 	rule = [...(cauHinh.batBuoc ? rules.required : [])];
		// 	break;
		case EKieuDuLieu.NUMBER:
			component = cauHinh.laDangMang ? (
				<Select disabled={cauHinh?.readonly} mode='tags' placeholder={cauHinh.ten} />
			) : (
				<InputNumber
					disabled={cauHinh?.readonly}
					formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
				<Select disabled={cauHinh?.readonly} mode='tags' placeholder={cauHinh.ten} />
			) : (
				<InputNumber disabled={cauHinh?.readonly} style={{ width: '100%' }} placeholder='Nhập giá trị' />
			);
			rule = [
				...(cauHinh.laDangMang ? rules.arrNumber(1000000000, 0) : []),
				...(cauHinh.batBuoc ? rules.required : []),
			];
			break;

		case EKieuDuLieu.HOUR:
			component = (
				<MyDatePicker
					disabled={cauHinh?.readonly}
					style={{ width: '100%' }}
					allowClear
					format={'DD/MM/YYYY HH:mm'}
					showTime
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.DATE:
			component = (
				<MyDatePicker disabled={cauHinh?.readonly} style={{ width: '100%' }} allowClear format={'DD/MM/YYYY'} />
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;
		case EKieuDuLieu.MONTH:
			component = (
				<MyDatePicker
					disabled={cauHinh?.readonly}
					style={{ width: '100%' }}
					allowClear
					format={'MM/YYYY'}
					picker='month'
				/>
			);
			rule = [...(cauHinh.batBuoc ? rules.required : [])];
			break;

		case EKieuDuLieu.FILE:
			rule = [...(cauHinh.batBuoc ? rules.fileRequired : [])];
			component = (
				<UploadFile
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
						render: (val, rec) => <ViewRender cauHinh={item} recordQuyTrinhForm={rec} />,
						// ...buildFilter(item, danhSach),
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
									if (recordQuyTrinhForm) {
										setRecordQuyTrinhForm({
											...recordQuyTrinhForm,
											thongTinKhaiBao: {
												...recordQuyTrinhForm.thongTinKhaiBao,
												[cauHinh.ma]: recordQuyTrinhForm.thongTinKhaiBao?.[cauHinh.ma]
													?.map((item: any, index: number) => ({ ...item, index: index + 1 }))
													?.filter((item: any) => item.index !== rec.index),
											},
										});
									}
								}}
								title='Bạn có chắc chắn muốn xóa lớp này khỏi danh sách đăng ký sinh viên?'
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
								if (!recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma]?.length) callback('');
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
						data={recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma]?.map((item: any, index: number) => ({
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
						{/*<SelectSanPhamNCKH*/}
						{/*	select={true}*/}
						{/*	handleSelect={(data) => {*/}
						{/*		const obj: any = {*/}
						{/*			...recordQuyTrinhForm,*/}
						{/*			thongTinKhaiBao: { ...recordQuyTrinhForm?.thongTinKhaiBao, [cauHinh.ma]: data },*/}
						{/*		};*/}

						{/*		setRecordQuyTrinhForm(obj);*/}
						{/*		onCancelFormTable();*/}
						{/*	}}*/}
						{/*	loaiHinhActive={cauHinh?.loaiHinhNckhId}*/}
						{/*/>*/}
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
						// ...buildFilter(item, danhSach),
					});
				});
			columns.push({
				title: 'Thao tác',
				align: 'center',
				width: 60,
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
									if (recordQuyTrinhForm) {
										setRecordQuyTrinhForm({
											...recordQuyTrinhForm,
											thongTinKhaiBao: {
												...recordQuyTrinhForm.thongTinKhaiBao,
												[cauHinh.ma]: recordQuyTrinhForm.thongTinKhaiBao?.[cauHinh.ma]
													?.map((item: any, index: number) => ({ ...item, index: index + 1 }))
													?.filter((item: any) => item.index !== rec.index),
											},
										});
									}
								}}
								title='Bạn có chắc chắn muốn xóa lớp này khỏi danh sách đăng ký sinh viên?'
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
								if (!recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma]?.length) callback('');
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
							disabled={cauHinh?.readonly}
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
						data={recordQuyTrinhForm?.thongTinKhaiBao?.[cauHinh.ma]?.map((item: any, index: number) => ({
							...item,
							index: index + 1,
						}))}
						columns={columns}
					/>
					<Modal
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
		let check = false;
		if (!cauHinh?.truongThongTinLienQuan) return true;
		if (props?.formValues?.[cauHinh?.truongThongTinLienQuan] === cauHinh?.giaTriLienQuan) return true;
		if (cauHinh.giaTriLienQuan.includes) {
			if (cauHinh?.giaTriLienQuan?.includes(props?.formValues?.[cauHinh?.truongThongTinLienQuan])) return true;
			if (props?.formValues?.[cauHinh?.truongThongTinLienQuan]?.map)
				props?.formValues?.[cauHinh?.truongThongTinLienQuan]?.map((item: any) => {
					if (cauHinh?.giaTriLienQuan?.includes(item)) {
						check = true;
					}
				});
		}
		return check;
	}, [cauHinh?.truongThongTinLienQuan, cauHinh?.giaTriLienQuan, props?.formValues?.[cauHinh?.truongThongTinLienQuan]]);

	const truongThongTinTinh = recordLoaiHinh?.danhSachCauHinhTruongThongTinTinh?.find(
		(item: { maTruongThongTinDungSau: string }) => item.maTruongThongTinDungSau === cauHinh.ma,
	);

	// @ts-ignore
	return checkTruongThongTinLienQuan ? (
		<>
			<Col xs={24} sm={24} md={cauHinh?.colspan}>
				{cauHinh?.loaiDefaultValue ? (
					<Form.Item
						name={cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE ? cauHinh.ma : `table||${cauHinh.ma}`}
						label={cauHinh.ten}
						rules={rule}
					>
						<Input  disabled={cauHinh?.readonly} />
					</Form.Item>
				) : (
					<Form.Item
						name={cauHinh.kieuDuLieu !== EKieuDuLieu.TABLE ? cauHinh.ma : `table||${cauHinh.ma}`}
						label={cauHinh.ten}
						rules={rule}
					>
						{component}
					</Form.Item>
				)}
			</Col>
			{truongThongTinTinh && truongThongTinTinh.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.VAI_TRO && (
				<Col xs={24} sm={24} md={truongThongTinTinh?.colspan ? +truongThongTinTinh.colspan : undefined}>
					<Form.Item name='vaiTro' label={truongThongTinTinh?.label ?? 'Vai trò'} rules={[...rules.required]}>
						<Select
							options={recordLoaiHinh?.danhSachVaiTroThanhVienKhaDung?.map((item: any) => ({
								label: item,
								value: item,
							}))}
							mode='multiple'
							placeholder='Vai trò'
						/>
					</Form.Item>
				</Col>
			)}
			{truongThongTinTinh &&
				[ELoaiTruongThongTinTinh.THOI_GIAN_BAT_DAU, ELoaiTruongThongTinTinh.THOI_GIAN_KET_THUC].includes(
					truongThongTinTinh.loaiTruongThongTinTinh,
				) && (
					<Col xs={24} sm={24} md={truongThongTinTinh?.colspan ? +truongThongTinTinh.colspan : undefined}>
						<Form.Item
							name='thoiGian'
							label={`${recordLoaiHinh?.startLabel} - ${recordLoaiHinh?.endLabel}`}
							rules={[...rules.required]}
						>
							<MyDateRangePicker
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
				)}
			{truongThongTinTinh &&
				[ELoaiTruongThongTinTinh.MOC_THOI_GIAN].includes(truongThongTinTinh.loaiTruongThongTinTinh) && (
					<Col xs={24} sm={24} md={truongThongTinTinh?.colspan ? +truongThongTinTinh.colspan : undefined}>
						<Form.Item
							name={['thongTinThoiGian', 'timeline']}
							label={recordLoaiHinh?.timelineLabel}
							rules={[...rules.required]}
						>
							<MyDatePicker
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
				)}
			{truongThongTinTinh &&
				truongThongTinTinh.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.DANH_SACH_THANH_VIEN && (
					<>
						<Col xs={24} sm={24} md={24}>
							<Form.Item name='soLuongThanhVien' label='Số lượng thành viên' rules={[...rules.required]}>
								<InputNumber style={{ width: '100%' }} min={1} max={100} placeholder='Số lượng thành viên' />
							</Form.Item>
						</Col>

						<Col span={24}>
							<div className='ant-descriptions-title' style={{ marginBottom: 12 }}>
								{truongThongTinTinh?.label ?? 'Danh sách thành viên'}
							</div>
							{/*<TableThanhVien mode='edit' />*/}
						</Col>
					</>
				)}
		</>
	) : null;
};

export default FormRender;
