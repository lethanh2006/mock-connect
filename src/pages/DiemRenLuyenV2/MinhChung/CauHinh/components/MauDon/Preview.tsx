import { Card, Form, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormRender from './FormRender';
// import TableThanhVien from './TableThanhVien';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { buildUpLoadMultiFileMultipart, EFileScope } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm, sanitizeObject } from '@/utils/utils';

const PreviewForm = (props: { isView?: boolean; getData: any; mode: 'quytrinh' | 'loaihinh' }) => {
	const [form] = Form.useForm();
	const { record } = useModel('formdong.loaihinh');
	const { recordQuyTrinhForm, visibleForm, edit } = useModel('quytrinh.quanlyquytrinh');
	const intl = useIntl();

	const [formValues, setFormValues] = useState<any>({
		...recordQuyTrinhForm,
		...recordQuyTrinhForm?.thongTinKhaiBao,
		vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
		thoiGian: [dayjs(recordQuyTrinhForm?.thongTinThoiGian?.start), dayjs(recordQuyTrinhForm?.thongTinThoiGian?.end)],
	});

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recordQuyTrinhForm?._id)
			form.setFieldsValue({
				...recordQuyTrinhForm,
				...recordQuyTrinhForm?.thongTinKhaiBao,
				vaiTro: recordQuyTrinhForm?.nguoiKhaiBao?.danhSachVaiTro,
				thoiGian: [
					dayjs(recordQuyTrinhForm?.thongTinThoiGian?.start),
					dayjs(recordQuyTrinhForm?.thongTinThoiGian?.end),
				],
			});
	}, [recordQuyTrinhForm?._id, visibleForm]);

	const handleFinish = async () => {
		for (const item in formValues) {
			const value = formValues[item];
			if (value?.fileList?.length) {
				formValues[item] = await buildUpLoadMultiFileMultipart(formValues, item, {
					scope: EFileScope.INTERNAL,
					module: 'diem-ren-luyen',
					returnValue: 'url',
				});
			}
		}
	};

	return (
		<Card
			title={
				props.mode === 'loaihinh'
					? `${!edit ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' }) : intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.chinhsua' })} ${record?.ten}`
					: record?.ten
			}
		>
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
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={sanitizeObject(item)} />
					))}
				</Row>
			</Form>
		</Card>
	);
};

export default PreviewForm;
