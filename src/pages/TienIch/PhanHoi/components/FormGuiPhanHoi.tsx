import UploadFile from '@/components/Upload/UploadFile';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { ELoaiPhanHoi } from '@/services/TienIch/PhanHoi/constant';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectChuDePhanHoi from '../../ChuDePhanHoi/Select';

const FormGuiPhanHoi = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { loading, setVisibleForm, postModel, record, setFormSubmiting, formSubmiting, visibleForm } =
		useModel('tienich.phanhoi');
	const { danhSach } = useModel('tienich.chudephanhoi');
	const { danhSach: danhSachDonVi } = useModel('tochucnhansu.donvi');
	const tenLinhVuc = useWatch('tenLinhVuc', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onChangeDonVi = (maDonVi?: string) => {
		const ns = danhSachDonVi.find((item) => item.maDonVi === maDonVi);
		form.setFieldsValue({
			tenDonVi: ns?.ten,
		});
	};

	const onFinish = async (values: PhanHoi.IRecord) => {
		try {
			setFormSubmiting(true);
			const urlPhanAnh = await buildUpLoadMultiFile(values, 'urlPhanAnh');
			values.urlPhanAnh = urlPhanAnh;
			setFormSubmiting(false);

			values.loaiPhanHoi = ELoaiPhanHoi.KHAC;
			postModel(
				{ ...values, tenLinhVuc: danhSach?.find((item) => item._id === values.tenLinhVuc)?.tenLinhVuc ?? 'Khác' },
				getData,
			);
		} catch (er) {
			console.log(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Card loading={loading} title='Gửi phản hồi'>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Form.Item name='tieuDe' label='Tiêu đề'>
					<Input placeholder='Nhập tiêu đề' />
				</Form.Item>
				<Form.Item name='tenLinhVuc' label='Chủ đề câu hỏi' rules={[...rules.required]}>
					<SelectChuDePhanHoi
						placeholder='Chọn chủ đề câu hỏi'
						onChange={(val) => {
							form.setFieldsValue({
								['maDonVi']: danhSach.find((item) => item._id === val)?.maDonVi,
							});
						}}
					/>
				</Form.Item>
				<Form.Item name='maDonVi' label='Bộ phận xử lý'>
					<SelectDonVi
						onChange={(val) => {
							onChangeDonVi(val?.toString());
						}}
						allowClear
						disabled={tenLinhVuc !== 'Khác'}
					/>
				</Form.Item>
				<Form.Item name='tenDonVi' hidden />
				<Form.Item
					name='noiDungPhanHoi'
					label='Nội dung phản hồi'
					rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
				>
					<Input.TextArea rows={4} placeholder='Nhập nội dung' />
				</Form.Item>
				<Form.Item name='urlPhanAnh' label='File đính kèm'>
					<UploadFile maxCount={5} />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Gửi
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormGuiPhanHoi;
