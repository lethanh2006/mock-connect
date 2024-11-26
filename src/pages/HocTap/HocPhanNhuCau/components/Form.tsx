import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import { Button, Col, Descriptions, Form, message, Modal, Row, Segmented, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import HocPhanCTDT from './HocPhan';

const FormHocPhanDangKyNhuCau = (props: any) => {
	const { getData, ngoaiThoiGian } = props;
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, dangKyHocPhanNhuCauNModel, formSubmiting } = useModel(
		'sinhvien.nhucauhocphan.sinhvienhocphannhucau',
	);
	const { khoaNganhMe, maKhoaNganh } = useModel('sinhvien.sinhvien');
	const { selectedIds, setSelectedIds } = useModel('hocphan.hocphan');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recDot } = useModel('sinhvien.nhucauhocphan.dotdangky');
	const [segment, setSegment] = useState<string>('1');

	const khoaNganh = Object.values(khoaNganhMe as Record<string, KhoaNganh.IRecord>)?.find(
		(item) => item?.ma === maKhoaNganh,
	);

	useEffect(() => {
		if (!visibleForm) setSelectedIds([]);
	}, [visibleForm]);

	const onFinish = async (values: HocPhanNhuCau.IRecord) => {
		if (!selectedIds?.length) {
			message.error('Vui lòng chọn học phần!');
			return;
		}

		const data = {
			maKhoaNganh: maKhoaNganh ?? '',
			dotDangKyHocPhanNhuCauId: recDot?._id ?? '',
			danhSachHocPhan: selectedIds ?? [],
		};
		await dangKyHocPhanNhuCauNModel(data, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			title='Đăng ký nhu cầu học phần'
			width={900}
			footer={null}
			destroyOnClose
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Descriptions column={1}>
							<Descriptions.Item label='Học kỳ'>{recHocKy?.ten ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Khóa ngành'>{khoaNganh?.ten}</Descriptions.Item>
							<Descriptions.Item label='Đợt đăng ký nhu cầu'>{recDot?.tenDot ?? '--'}</Descriptions.Item>
						</Descriptions>
						<div style={{ marginBottom: 12 }}>
							<i style={{ color: 'red' }}>
								Số lượng học phần cho phép đăng ký ngoài tiến trình trong đợt tối đa:{' '}
								<b>{recDot?.soHocPhanDangKyNgoaiTienTrinh}</b> học phần
							</i>
						</div>
					</Col>

					<Col span={24}>
						<div style={{ marginBottom: 12 }}>
							<i>
								Lưu ý: Hệ thống tự động chọn học phần đúng tiến trình học tập của sinh viên, nếu sinh viên đã đăng ký
								nhu cầu hệ thống sẽ tự động chọn học phần sinh viên đã đăng ký
							</i>
						</div>
						<Segmented
							style={{ marginBottom: 12 }}
							value={segment}
							onChange={(val) => setSegment(val.toString())}
							options={[
								{ value: '1', label: 'HP trong tiến trình' },
								{ value: '2', label: 'HP ngoài tiến trình' },
							]}
						/>
						<HocPhanCTDT segment={segment} />
					</Col>
				</Row>

				<div className='form-footer'>
					<Tooltip title={ngoaiThoiGian ? 'Ngoài thời gian đăng ký' : 'Thêm mới'}>
						<Button loading={formSubmiting} htmlType='submit' type='primary' disabled={ngoaiThoiGian}>
							Đăng ký
						</Button>
					</Tooltip>
					<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormHocPhanDangKyNhuCau;
