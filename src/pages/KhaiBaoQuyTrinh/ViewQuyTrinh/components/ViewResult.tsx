import { Card, Form, Tag } from 'antd';
import { useModel } from '@@/plugin-model/useModel';
import { useEffect, useState } from 'react';
import { TrangThaiKhaiBao } from '@/services/QuyTrinh/KhaiBao/constants';
import { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';
import FormRender from '@/pages/KhaiBaoQuyTrinh/MauDon/FormRender';

const ViewResult = (props: { danhSachKhaiBao: any; modelName: any; type?: 'dieu_phoi' | 'tiep_nhan' }) => {
	const { danhSachKhaiBao, modelName } = props;
	const model = useModel(modelName);
	const { setRecordSanPham } = useModel('quytrinh.khaibaoquytrinh');
	const { currentFormKhaiBao, current } = model;
	const [formValues, setFormValues] = useState<any>({});
	const [form] = Form.useForm();
	useEffect(() => {
		if (danhSachKhaiBao) {
			form.setFieldsValue(danhSachKhaiBao?.thongTinKhaiBao);
			setRecordSanPham(danhSachKhaiBao);
		}
	}, [danhSachKhaiBao]);
	return (
		<div>
			<div style={{ marginBottom: 16, display: 'flex' }}>
				<div style={{ marginRight: 8 }}>
					<b>Khai báo: </b>
					{danhSachKhaiBao?.ten}
					{danhSachKhaiBao?.ma ? ` (${danhSachKhaiBao?.ma})` : ''}
				</div>
				<div style={{ marginRight: 8 }}>
					<Tag color={current?.coKhaiBao ? 'green' : 'yellow'}>
						{current?.coKhaiBao ? TrangThaiKhaiBao.DA_KHAI_BAO : TrangThaiKhaiBao.CHUA_KHAI_BAO}
					</Tag>
				</div>
			</div>
			<Card>
				<Form
					form={form}
					layout={'vertical'}
					onValuesChange={(changedValues, values) => {
						setFormValues(values);
					}}
					disabled={true}
				>
					{currentFormKhaiBao?.cauHinhLoaiHinh?.map((item: LoaiHinh.TruongThongTin | LoaiHinh.Cot) => (
						<FormRender formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Form>
			</Card>
		</div>
	);
};
export default ViewResult;
