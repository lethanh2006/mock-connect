import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ELoaiHocPhanMinhChung, EMinhChungQuyDoiDiem, ETrangThaiHocPhanQuyDoi } from '@/services/HocTap/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Descriptions, Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormQuyDoiDiem from './Form';

const ModalQuyDoiDiem = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	hocPhan?: Pick<HocPhan.IRecord, 'ma' | 'ten' | 'soTinChi'>;
	maKhoaNganh?: string;
}) => {
	const [form] = Form.useForm();
	const { visible, setVisible, hocPhan, maKhoaNganh } = props;
	const { getModel } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const { postSinhVienQuyDoiPhieuModel, setFormSubmiting, formSubmiting } = useModel(
		'daotao.quydoidiem.sinhvienquydoidiem',
	);
	const { record: recDot } = useModel('daotao.quydoidiem.dotquydoidiem');

	//Get phiếu quy đổi điểm sinh viên
	const getData = () => getModel({ maKhoaNganh }, undefined, undefined, undefined, undefined, 'me');

	useEffect(() => {
		if (!visible) resetFieldsForm(form);

		const initValue = {
			loai: EMinhChungQuyDoiDiem.HOC_PHAN,
			loaiHocPhan: ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH,
			trangThai: ETrangThaiHocPhanQuyDoi.CHO_XU_LY,
		};
		form.setFieldsValue(initValue);
	}, [visible]);

	const onFinish = async (values: QuyDoiDiem.IQuyDoiDiemSinhVien) => {
		setFormSubmiting(true);
		const urlsMinhChung = await buildUpLoadMultiFile(values, 'urlsMinhChung');
		setFormSubmiting(false);

		const data = {
			thongTinQuyDoiDiemSinhVien: [
				{
					...values,
					maHocPhan: hocPhan?.ma,
				},
			],
			urlsMinhChung: urlsMinhChung,
			maKhoaNganh: maKhoaNganh,
		};

		postSinhVienQuyDoiPhieuModel(recDot?._id ?? '', data, getData)
			.then(() => {
				setVisible(false);
			})
			.catch((rec) => console.log(rec));
	};

	return (
		<Modal
			width={900}
			visible={visible}
			onCancel={() => {
				setVisible(false);
			}}
			footer={null}
			title='Công nhận kết quả học tập'
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Descriptions column={{ xs: 1, md: 2, sm: 1, lg: 2, xl: 2 }}>
					<Descriptions.Item span={2} label='Đợt công nhận kết quả học tập'>
						{recDot?.tenDot ?? ''}
					</Descriptions.Item>
					<Descriptions.Item span={2} label='Học phần xin công nhận'>
						{hocPhan?.ten ?? ''}
					</Descriptions.Item>
					<Descriptions.Item label='Mã học phần'>{hocPhan?.ma ?? ''}</Descriptions.Item>
					<Descriptions.Item label='Số tín chỉ'>{hocPhan?.soTinChi ?? ''}</Descriptions.Item>
				</Descriptions>

				<FormQuyDoiDiem form={form} />

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Đăng ký
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalQuyDoiDiem;
