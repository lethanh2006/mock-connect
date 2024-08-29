import { EDangSanPham, ETrangThaiThucHien, ETrangThaiTienDo } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { primaryColor } from '@/services/base/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableSanPham from './TableSanPham';
import TableTimeline from './TableTimeline';

const FormThucHienDeTai = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		formSubmiting,
		visibleForm,
		setLoading,
		loading,
		giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel,
	} = useModel('khoahoc.detaikhcn');
	const ketLuanTienDo = Form.useWatch('ketLuanTienDo', form);
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const rec = {
				...record?.dangKyKhcn,
				...record?.deCuongKhcn,
				timeline: record?.deCuongKhcn?.timeline?.map((item) => item.sanPhamUrl),
				[EDangSanPham.DANG_SAN_PHAM_I]: record?.deCuongKhcn?.sanPhamDeCuongDangI?.map((item) => item.sanPhamUrl),
				[EDangSanPham.DANG_SAN_PHAM_II]: record?.deCuongKhcn?.sanPhamDeCuongDangII?.map((item) => item.sanPhamUrl),
				[EDangSanPham.DANG_SAN_PHAM_III]: record?.deCuongKhcn?.sanPhamDeCuongDangIII?.map((item) => item.sanPhamUrl),
			};

			form.setFieldsValue(rec);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			if (!record) return;
			// setLoading(true);

			if (values?.timeline) {
				let i = 0;
				for (const tl of values?.timeline) {
					values.timeline[i] = await buildUpLoadMultiFile(values?.timeline, i.toString());
					i++;
				}
			}
			if (values?.[EDangSanPham.DANG_SAN_PHAM_III]) {
				let i = 0;
				for (const sp of values[EDangSanPham.DANG_SAN_PHAM_III]) {
					values[EDangSanPham.DANG_SAN_PHAM_III][i] = await buildUpLoadMultiFile(
						values[EDangSanPham.DANG_SAN_PHAM_III],
						i.toString(),
					);

					i++;
				}
			}
			if (values?.[EDangSanPham.DANG_SAN_PHAM_II]) {
				let i = 0;
				for (const sp of values[EDangSanPham.DANG_SAN_PHAM_II]) {
					values[EDangSanPham.DANG_SAN_PHAM_II][i] = await buildUpLoadMultiFile(
						values[EDangSanPham.DANG_SAN_PHAM_II],
						i.toString(),
					);

					i++;
				}
			}
			if (values?.[EDangSanPham.DANG_SAN_PHAM_I]) {
				let i = 0;
				for (const sp of values[EDangSanPham.DANG_SAN_PHAM_I]) {
					values[EDangSanPham.DANG_SAN_PHAM_I][i] = await buildUpLoadMultiFile(
						values[EDangSanPham.DANG_SAN_PHAM_I],
						i.toString(),
					);

					i++;
				}
			}

			const payload = {
				deCuongKhcn: {
					...record?.deCuongKhcn,
					...values,
					sanPhamDeCuong: [
						...(record?.deCuongKhcn?.sanPhamDeCuongDangI?.map((item, index) => ({
							...item,
							sanPhamUrl: values?.[EDangSanPham.DANG_SAN_PHAM_I]?.[index],
						})) ?? []),
						...(record?.deCuongKhcn?.sanPhamDeCuongDangII?.map((item, index) => ({
							...item,
							sanPhamUrl: values?.[EDangSanPham.DANG_SAN_PHAM_II]?.[index],
						})) ?? []),
						...(record?.deCuongKhcn?.sanPhamDeCuongDangIII?.map((item, index) => ({
							...item,
							sanPhamUrl: values?.[EDangSanPham.DANG_SAN_PHAM_III]?.[index],
						})) ?? []),
					],
					timeline: record?.deCuongKhcn?.timeline?.map((item, index) => ({
						...item,
						sanPhamUrl: values?.timeline?.[index],
					})),
					sanPhamDeCuongDangI: undefined,
					sanPhamDeCuongDangII: undefined,
					sanPhamDeCuongDangIII: undefined,
				},
			};

			giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel(record?._id, payload, 'de-cuong', props.getData)
				.then(() => form.resetFields())
				.catch((er) => {
					setLoading(false);
					console.log(er);
				});
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={'Cập nhật tiến độ thực hiện đề tài'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{record?.trangThaiThucHien !== ETrangThaiThucHien.CHUA_TIEP_NHAN && (
					<div>
						<b>Ghi chú của phòng QLKH:</b>
						<span style={{ color: primaryColor }}> {record?.commentThucHien}</span>
					</div>
				)}
				<Row gutter={[16, 0]}>
					{/* <Col xs={24}>
						<Form.Item name='ten' label='Tên đề tài' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên đề tài' />
						</Form.Item>
					</Col> */}

					<Col span={24}>
						<div>Kế hoạch, phương án tổ chức thực hiện:</div>
						<TableTimeline showMinhChung mode='edit' data={record?.deCuongKhcn?.timeline ?? []} />
						<br />
					</Col>
					{record?.deCuongKhcn?.sanPhamDeCuongDangI?.length ? (
						<Col span={24}>
							<div>
								Sản phẩm chính của đề tài (Dạng I){' '}
								<i>
									Mẫu (model, maket); Sản phẩm (là hàng hoá, có thể được tiêu thụ trên thị trường); Vật liệu; Thiết bị,
									máy móc; Dây chuyền công nghệ và các loại khác
								</i>
							</div>
							<TableSanPham
								phase='deCuongKhcn'
								showMinhChung
								type={EDangSanPham.DANG_SAN_PHAM_I}
								mode='edit'
								data={record?.deCuongKhcn?.sanPhamDeCuongDangI ?? []}
							/>
							<br />
						</Col>
					) : null}
					{record?.deCuongKhcn?.sanPhamDeCuongDangII?.length ? (
						<Col span={24}>
							<div>
								Sản phẩm chính của đề tài (Dạng II){' '}
								<i>
									Nguyên lý ứng dụng; Phương pháp; Tiêu chuẩn; Quy phạm; Phần mềm máy tính; Bản vẽ thiết kế; Quy trình
									công nghệ; Sơ đồ, bản đồ; Số liệu, Cơ sở dữ liệu; Báo cáo phân tích; Tài liệu dự báo (phương pháp, quy
									trình, mô hình,...); Đề án, qui hoạch; Luận chứng kinh tế-kỹ thuật, Báo cáo nghiên cứu khả thi và các
									sản phẩm khác
								</i>
							</div>
							<TableSanPham
								phase='deCuongKhcn'
								showMinhChung
								type={EDangSanPham.DANG_SAN_PHAM_II}
								mode='edit'
								data={record?.deCuongKhcn?.sanPhamDeCuongDangII ?? []}
							/>
							<br />
						</Col>
					) : null}
					{record?.deCuongKhcn?.sanPhamDeCuongDangIII?.length ? (
						<Col span={24}>
							<div>
								Sản phẩm chính của đề tài (Dạng III) <i>Bài báo; Sách chuyên khảo và các sản phẩm khác</i>
							</div>
							<TableSanPham
								phase='deCuongKhcn'
								showMinhChung
								type={EDangSanPham.DANG_SAN_PHAM_III}
								mode='edit'
								data={record?.deCuongKhcn?.sanPhamDeCuongDangIII ?? []}
							/>
							<br />
						</Col>
					) : null}
					{/* <Col xs={24} md={12} lg={8}>
						<Form.Item name={['daThucHienTamUng']} label='Đã thực hiện tạm ứng' rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: true, label: 'Đã tạm ứng' },
									{ value: false, label: 'Chưa tạm ứng' },
								]}
							/>
						</Form.Item>
					</Col> */}
					<Col xs={24}>
						<Form.Item name={['ketLuanTienDo']} label='Kết luận' rules={[...rules.required]}>
							<Select
								placeholder='Kết luận'
								options={Object.values(ETrangThaiTienDo).map((item) => ({ value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Form.Item
							name={['ghiChuTienDo']}
							label={ketLuanTienDo === ETrangThaiTienDo.DUNG_VOI_KE_HOACH ? 'Ghi chú (nếu có)' : 'Lý do'}
							rules={ketLuanTienDo === ETrangThaiTienDo.DUNG_VOI_KE_HOACH ? undefined : [...rules.required]}
						>
							<Input.TextArea
								placeholder={ketLuanTienDo === ETrangThaiTienDo.DUNG_VOI_KE_HOACH ? 'Ghi chú (nếu có)' : 'Lý do'}
							/>
						</Form.Item>
					</Col>
					{/* <Col xs={24} md={12} lg={8}>
						<Form.Item name={['duKienLichBaoVe']} label='Dự kiến lịch bảo vệ'>
							<MyDatePicker format={'DD/MM/YYYY'} placeholder='Chọn ngày' />
						</Form.Item>
					</Col> */}
				</Row>

				<div className='form-footer'>
					<Button loading={loading || formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThucHienDeTai;
