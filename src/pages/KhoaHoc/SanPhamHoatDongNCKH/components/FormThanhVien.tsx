import SelectSinhVienDebounce from '@/pages/SinhVien/components/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import {
	EHocHam,
	EHocVi,
	EVaiTroThanhVienNckh,
	MapNameVaiTroThanhVienNCKH,
} from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Select, message } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormThanhVien = (props: {
	onCancel: any;
	record?: SanPhamNCKH.ThanhVienNCKH;
	edit: boolean;
	isDangThucHien?: boolean;
}) => {
	const [form] = Form.useForm();
	const { record, edit } = props;
	const {
		record: recordSanPham,
		setRecord: setRecordSanPham,
		quyDoiDiem,
		quyDoiGio,
		setQuyDoiDiem,
		setQuyDoiGio,
	} = useModel('khoahoc.sanphamnckh');
	const { record: recordLoaiHinhNCKH } = useModel('khoahoc.loaihinhnckh');
	const { record: recordNamHoc } = useModel('khoahoc.danhmuc.namhoc');

	const [hoVaTen, setHoVaTen] = useState<string>(record?.hoVaTen?.trim() ?? '');
	const [maDonVi, setMaDonVi] = useState<string>(record?.maDonVi?.trim() ?? '');
	const [maDinhDanh, setMaDinhDanh] = useState<string>(record?.maDinhDanh?.trim() ?? '');
	const vaiTro = Form.useWatch('vaiTro', form);
	const { danhSach } = useModel('tochucnhansu.nhansu');
	const { danhSach: danhSachSinhVien } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,

				tongGio: quyDoiGio?.[recordNamHoc?._id ?? '']?.find((item) => item?.ssoId === record?.ssoId)?.tongGio,
				tongDiem: quyDoiDiem?.[recordNamHoc?._id ?? '']?.find((item) => item?.ssoId === record?.ssoId)?.tongGio,
			});
		} else {
			form.setFieldsValue({ ...form, vaiTro: EVaiTroThanhVienNckh.CBGV });
		}
	}, [record]);

	const onFinish = async (values: SanPhamNCKH.ThanhVienNCKH) => {
		const dsFinal = vaiTro === EVaiTroThanhVienNckh.CBGV ? danhSach : danhSachSinhVien;

		const recNhanSu: any = dsFinal.find((item) => item.ssoId === values?.ssoId);

		const payload: any = {
			...values,
			ssoId: values?.ssoId ? values.ssoId : nanoid(),
			maDonVi: recNhanSu?.khoaNganh?.ma || recNhanSu?.donViChinh?.maDonVi || maDonVi?.trim() || record?.maDonVi,
			maDinhDanh: recNhanSu?.ma || recNhanSu?.maCanBo || maDinhDanh?.trim() || record?.maDinhDanh,
			hoVaTen:
				vaiTro === EVaiTroThanhVienNckh.SINH_VIEN
					? recNhanSu.ten
					: recNhanSu
					? `${recNhanSu?.hoDem ?? ''} ${recNhanSu?.ten ?? ''}`
					: values?.hoVaTen || hoVaTen?.trim() || record?.hoVaTen,
		};

		if (edit && record && recordSanPham) {
			const index = recordSanPham.danhSachThanhVien
				.map((item, indexTemp: number) => indexTemp + 1)
				.indexOf(record.index);
			const danhSachThanhVien = [...recordSanPham.danhSachThanhVien];
			danhSachThanhVien.splice(index, 1, { ...record, ...payload });
			setRecordSanPham({ ...recordSanPham, danhSachThanhVien });
		} else {
			const length = recordSanPham?.danhSachThanhVien?.length;
			setRecordSanPham({
				...(recordSanPham || {}),
				danhSachThanhVien: [
					...(recordSanPham?.danhSachThanhVien ?? []),
					{ ...payload, index: length ? length + 1 : 1 },
				],
			} as SanPhamNCKH.IRecord);
		}

		if (values.tongGio && recordNamHoc?._id) {
			const quyDoiGioTemp: any = {
				...quyDoiGio,
				[recordNamHoc._id]: [
					...quyDoiGio?.[recordNamHoc._id]?.filter((item) => item.ssoId !== values?.ssoId),
					{ ssoId: values?.ssoId, tongGio: values.tongGio },
				],
			};

			setQuyDoiGio(quyDoiGioTemp);
		}
		if (values.tongDiem && recordNamHoc?._id) {
			const quyDoiDiemTemp: any = {
				...quyDoiDiem,
				[recordNamHoc._id]: [
					...quyDoiDiem?.[recordNamHoc._id]?.filter((item) => item.ssoId !== values?.ssoId),
					{ ssoId: values?.ssoId, tongGio: values.tongDiem },
				],
			};
			setQuyDoiDiem(quyDoiDiemTemp);
		}

		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		props.onCancel();
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'thành viên'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item rules={[...rules.required]} name='vaiTro' label='Loại'>
					<Select
						onChange={(val) => {
							form.setFieldsValue({
								ssoId: undefined,
								email: undefined,
								cmtCccd: undefined,
								donVi: undefined,
								soDienThoai: undefined,
								hocHam: undefined,
								hocVi: undefined,
							});
						}}
						placeholder='Loại'
						options={Object.values(EVaiTroThanhVienNckh).map((item) => ({
							value: item,
							label: MapNameVaiTroThanhVienNCKH[item],
						}))}
					/>
				</Form.Item>

				{[EVaiTroThanhVienNckh.CBGV, EVaiTroThanhVienNckh.SINH_VIEN].includes(vaiTro) && (
					<>
						<Form.Item name={['ssoId']} label='Họ và tên' rules={[...rules.required]}>
							{vaiTro === EVaiTroThanhVienNckh.CBGV ? (
								<SelectNhanSuDebounce
									onChange={(val, options) => {
										if (!val) return;
										const recNhanSu = options?.rawData;
										setMaDinhDanh(recNhanSu?.maCanBo ?? '');
										setHoVaTen(`${recNhanSu?.hoDem ?? ''} ${recNhanSu?.ten ?? ''}`);
										setMaDonVi(recNhanSu?.donViChinh?.maDonVi ?? '');
										form.setFieldsValue({
											email: recNhanSu?.emailCanBo ?? '',
											cmtCccd: recNhanSu?.cccdCMND || record?.cmtCccd || '',
											donVi: recNhanSu?.donViChinh?.ten || record?.donVi || '',
											soDienThoai: recNhanSu?.sdtCaNhan ?? '',
											hocHam: recNhanSu?.danhSachHocHam?.[0]?.danhHieu || recNhanSu?.hocHam,
											hocVi: recNhanSu?.hocVi || recNhanSu?.chatLuongNhanSu,
										});
									}}
								/>
							) : (
								<SelectSinhVienDebounce
									onChange={(val, options) => {
										if (!val) return;
										const recNhanSu = options?.rawData;
										setMaDinhDanh(recNhanSu?.ma ?? '');
										setHoVaTen(`${recNhanSu?.ten ?? ''}`);
										setMaDonVi(recNhanSu?.khoaNganh?.ma ?? '');
										form.setFieldsValue({
											email: recNhanSu?.email ?? '',
											cmtCccd: recNhanSu?.cccdCMND || recNhanSu?.cccd || record?.cmtCccd || '',
											donVi: recNhanSu?.donViChinh?.ten || recNhanSu?.khoaNganh?.ten || record?.donVi || '',
											soDienThoai: recNhanSu?.soDienThoai ?? '',
										});
									}}
								/>
							)}
						</Form.Item>
					</>
				)}

				{vaiTro === EVaiTroThanhVienNckh.KHAC && (
					<>
						<Form.Item
							name={['hoVaTen']}
							label='Họ và tên'
							rules={[...rules.required, ...rules.ten]}
							style={{ marginBottom: 10 }}
						>
							<Input placeholder='Nhập họ và tên' />
						</Form.Item>
					</>
				)}

				{recordLoaiHinhNCKH?.danhSachVaiTroThanhVienKhaDung.length ? (
					<Form.Item
						extra={
							<div>
								Cán bộ/giảng viên có thể tự nhập vai trò nếu vai trò không thuộc các giá trị có sẵn mà hệ thống đưa ra
							</div>
						}
						name={'danhSachVaiTro'}
						label='Vai trò'
						rules={[...rules.required]}
						style={{ marginBottom: 10 }}
					>
						<Select
							mode='tags'
							placeholder='Chọn Vai trò của thành viên'
							options={recordLoaiHinhNCKH.danhSachVaiTroThanhVienKhaDung?.map((item) => ({
								value: item,
								label: item,
							}))}
						/>
					</Form.Item>
				) : null}

				{recordLoaiHinhNCKH?.ten?.toLocaleLowerCase()?.includes('sách') && !props.isDangThucHien && (
					<Form.Item
						name={['ghiChu']}
						label='Tên chương phụ trách'
						rules={[...rules.required]}
						style={{ marginBottom: 10 }}
					>
						<Input.TextArea placeholder='Nhập tên chương phụ trách' />
					</Form.Item>
				)}

				{/* {!recordLoaiHinhNCKH?.tinhTheoTungNam && edit && (
					<Row gutter={[10, 0]}>
						<Col xs={24}>
							<Form.Item name='tongGio' label={<span>Giờ chuẩn NCKH</span>} rules={[...rules.required]}>
								<InputNumber
									style={{ width: '100%' }}
									min={0}
									max={100000000}
									placeholder={'Nhập số giờ'}
									addonAfter={'Giờ'}
								/>
							</Form.Item>
						</Col>
						{recordLoaiHinhNCKH?.tinhDiem && (
							<Col xs={24}>
								<Form.Item name='tongDiem' label={'Điểm sản phẩm NCKH'} rules={[...rules.required]}>
									<InputNumber
										style={{ width: '100%' }}
										min={0}
										max={100000000}
										placeholder={'Nhập số điểm'}
										addonAfter={'Điểm'}
									/>
								</Form.Item>
							</Col>
						)}
					</Row>
				)} */}

				<Form.Item
					rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					style={{ marginBottom: 10 }}
					label='Cơ quan/đơn vị công tác'
					name={'donVi'}
				>
					<Input.TextArea rows={3} placeholder='Nhập tên cơ quan, đơn vị công tác' />
				</Form.Item>

				<Row gutter={[10, 0]}>
					<Col xs={24} sm={12}>
						<Form.Item name={['cmtCccd']} label='CCCD' rules={[...rules.CMND]} style={{ marginBottom: 10 }}>
							<Input placeholder='Nhập CCCD' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							name={['soDienThoai']}
							label='Số điện thoại'
							rules={[...rules.soDienThoai]}
							style={{ marginBottom: 10 }}
						>
							<Input placeholder='Nhập Số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name={['email']} label='Email' rules={[...rules.email]} style={{ marginBottom: 10 }}>
							<Input placeholder='Nhập Email' />
						</Form.Item>
					</Col>
					{vaiTro !== EVaiTroThanhVienNckh.SINH_VIEN && (
						<>
							<Col xs={24} sm={12}>
								<Form.Item name={['hocHam']} label='Học hàm' style={{ marginBottom: 10 }}>
									<Select
										allowClear
										placeholder='Học hàm'
										options={Object.values(EHocHam)?.map((item) => ({
											value: item,
											label: item,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} sm={12}>
								<Form.Item name={['hocVi']} label='Học vị' style={{ marginBottom: 10 }}>
									<Select
										allowClear
										placeholder='Học vị'
										options={Object.values(EHocVi)?.map((item) => ({
											value: item,
											label: item,
										}))}
									/>
								</Form.Item>
							</Col>
						</>
					)}
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThanhVien;
