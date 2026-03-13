import UploadFile from '@/components/Upload/UploadFile';
import { arrKeyNameSanPhamSauNghiemThu } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormNopHoSoSauNghiemThu = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		formSubmiting,
		visibleForm,
		setLoading,
		loading,
		giangVienNopKetQuaSauNghiemThuModel,
	} = useModel('khoahoc.detaikhcn');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const rec: any = {
				...record?.nghiemThuKhcn,
			};
			arrKeyNameSanPhamSauNghiemThu.map((item, index) => {
				rec[item.field] = record?.taiLieuSauNghiemThu?.[index]?.url || record?.nghiemThuKhcn?.[item.field];
			});
			form.setFieldsValue(rec);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			if (!record) return;
			setLoading(true);
			const baoCaoUrl = await buildUpLoadMultiFile(values, 'baoCaoUrl');
			const banGiaiTrinhUrl = await buildUpLoadMultiFile(values, 'banGiaiTrinhUrl');
			const congBoKhoaHocUrl = await buildUpLoadMultiFile(values, 'congBoKhoaHocUrl');
			const banDeXuatUngDungUrl = await buildUpLoadMultiFile(values, 'banDeXuatUngDungUrl');
			const giayXacNhanUrl = await buildUpLoadMultiFile(values, 'giayXacNhanUrl');
			const sanPham: any = {
				baoCaoUrl,
				banGiaiTrinhUrl,
				congBoKhoaHocUrl,
				banDeXuatUngDungUrl,
				giayXacNhanUrl,
			};

			const arrSanPham: DeTaiKHCN.TaiLieu[] = [];
			arrKeyNameSanPhamSauNghiemThu.map((item: any) => {
				arrSanPham.push({
					ten: item.title,
					url: sanPham?.[item.field] ?? [],
					ghiChu: '',
				});
			});

			const payload = {
				ketQua: arrSanPham,
			};
			giangVienNopKetQuaSauNghiemThuModel(record?._id, payload, props.getData)
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
		<Card title={'Chỉnh sửa hồ sơ sau nghiệm thu'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[16, 0]}>
					{arrKeyNameSanPhamSauNghiemThu.map((item) => (
						<Col key={item.field} xs={24} sm={12}>
							<Form.Item rules={item.required ? [...rules.required] : undefined} label={item.title} name={item.field}>
								<UploadFile
									maxCount={5}
									maxSize={50}
									accept='.doc, .docx, .pdf'
									otherProps={{
										multiple: true,
										showUploadList: { showDownloadIcon: false },
									}}
								/>
							</Form.Item>
						</Col>
					))}
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

export default FormNopHoSoSauNghiemThu;
