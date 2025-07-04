import { Card, Form, Row } from 'antd';
import { useModel } from 'umi';
import FormRender from './FormRender';
import { useEffect, useState } from 'react';
// import TableThanhVien from './TableThanhVien';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';

const FormGiaoNopSanPham = (props: { isView?: boolean; getData: any; mode: 'quytrinh' | 'loaihinh' }) => {
	const [form] = Form.useForm();
	const { record } = useModel('quytrinh.loaihinh');
	const { recordQuyTrinhForm, visibleForm, edit } = useModel('quytrinh.quanlyquytrinh');

	const [formValues, setFormValues] = useState<any>({
		...recordQuyTrinhForm,
		...recordQuyTrinhForm?.thongTinKhaiBao,
		vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
		thoiGian: [moment(recordQuyTrinhForm?.thongTinThoiGian?.start), moment(recordQuyTrinhForm?.thongTinThoiGian?.end)],
	});

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recordQuyTrinhForm?._id)
			form.setFieldsValue({
				...recordQuyTrinhForm,
				...recordQuyTrinhForm?.thongTinKhaiBao,
				vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
				thoiGian: [
					moment(recordQuyTrinhForm?.thongTinThoiGian?.start),
					moment(recordQuyTrinhForm?.thongTinThoiGian?.end),
				],
			});
	}, [recordQuyTrinhForm?._id, visibleForm]);

	const handleFinish = async () => {
		for (const item in formValues) {
			const value = formValues[item];
			if (value?.fileList?.length) {
				formValues[item] = await buildUpLoadMultiFile(formValues, item);
			}
		}
	};

	return (
		<Card title={props.mode === 'loaihinh' ? `${!edit ? 'Thêm mới' : 'Chỉnh sửa'} ${record?.ten}` : record?.ten}>
			<Form
				labelCol={{ span: 24 }}
				form={form}
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				onFinish={async (values) => {
					if (!record) return;
					const isTrung = false;
					if (record.searchKey1) {
						// isTrung = await searchSanPhamModel(values?.[record.searchKey1], recordQuyTrinhForm?._id ?? '');
					}
					if (isTrung) return;
					handleFinish();
				}}
			>
				<Row gutter={[12, 0]}>
					{record?.cauHinhLoaiHinh?.map((item: LoaiHinh.TruongThongTin | LoaiHinh.Cot) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Row>
			</Form>
		</Card>
	);
};

export default FormGiaoNopSanPham;
