import { Button, Col, Descriptions, Row } from 'antd';
import { useModel } from 'umi';
import FormItemMinhChungQuyDoi from '../MinhChungQuyDoi/FormItemMinhChung';
import { useEffect } from 'react';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';

const FormHocPhanQuyDoiDiem = () => {
	const { visibleForm, setVisibleForm, record, setRecord } = useModel('daotao.quydoidiem.sinhvienquydoidiem');

	useEffect(() => {
		if (!visibleForm) setRecord({} as QuyDoiDiem.IQuyDoiDiemSinhVien);
	}, [visibleForm]);

	return (
		<>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
					<Descriptions.Item label='Học phần'>{record?.hocPhan?.ten ?? ''}</Descriptions.Item>
					<Descriptions.Item label='Số tín chỉ'>{record?.hocPhan?.soTinChi ?? ''}</Descriptions.Item>
					<Descriptions.Item label='Điểm được quy đổi'>{record?.diemHe10 ?? ''}</Descriptions.Item>
				</Descriptions>

				<Col xs={24}>
					<FormItemMinhChungQuyDoi />
				</Col>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</>
	);
};

export default FormHocPhanQuyDoiDiem;
