import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import { Button, Col, Descriptions, Form, message, Modal, Row, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import HocPhanCTDT from './HocPhan';

const FormHocPhanDangKyNhuCau = (props: any) => {
	const intl = useIntl();
	const { getData, ngoaiThoiGian } = props;
	const [form] = Form.useForm();
	const { visibleForm, setVisibleForm, dangKyHocPhanNhuCauNModel, formSubmiting } = useModel(
		'sinhvien.nhucauhocphan.sinhvienhocphannhucau',
	);
	const { khoaNganhMe, maKhoaNganh } = useModel('sinhvien.sinhvien');
	const { selectedIds, setSelectedIds } = useModel('hocphan.hocphan');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recDot } = useModel('sinhvien.nhucauhocphan.dotdangky');

	const khoaNganh = Object.values(khoaNganhMe as Record<string, KhoaNganh.IRecord>)?.find(
		(item) => item?.ma === maKhoaNganh,
	);

	useEffect(() => {
		if (!visibleForm) setSelectedIds([]);
	}, [visibleForm]);

	const onFinish = async (values: HocPhanNhuCau.IRecord) => {
		if (!selectedIds?.length) {
			message.error(intl.formatMessage({ id: 'hocphannhucau.form.message.chonHocPhan' }));
			return;
		}

		const data = {
			maKhoaNganh: maKhoaNganh ?? '',
			dotDangKyHocPhanNhuCauId: recDot?._id ?? '',
			danhSachHocPhan: selectedIds?.filter(Boolean) ?? [],
		};
		await dangKyHocPhanNhuCauNModel(data, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			title={intl.formatMessage({ id: 'hocphannhucau.tooltip.dangKyNhuCau' })}
			width={1000}
			footer={null}
			destroyOnClose
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Descriptions column={1}>
							<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.descriptions.hocky' })}>
								{recHocKy?.ten ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'dangkyhoctap.form.khoaNganh' })}>
								{khoaNganh?.ten}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'hocphannhucau.form.dotDangKy' })}>
								{recDot?.tenDot ?? '--'}
							</Descriptions.Item>
						</Descriptions>
						<div style={{ marginBottom: 12 }}>
							<i style={{ color: 'red' }}>
								{intl.formatMessage(
									{ id: 'hocphannhucau.form.limitNgoaiTienTrinh' },
									{
										max: recDot?.soHocPhanDangKyNgoaiTienTrinh ?? '--',
										b: (chunks) => <b>{chunks}</b>,
									},
								)}
							</i>
						</div>
					</Col>

					<Col span={24}>
						<div style={{ marginBottom: 12 }}>
							<i>{intl.formatMessage({ id: 'hocphannhucau.form.luuYTuDongChon' })}</i>
						</div>

						<HocPhanCTDT />
					</Col>
				</Row>

				<div className='form-footer'>
					<Tooltip
						title={
							ngoaiThoiGian
								? intl.formatMessage({ id: 'hocphannhucau.alert.ngoaiThoiGian' })
								: intl.formatMessage({ id: 'dangkyhoctap.button.themMoi' })
						}
					>
						<Button loading={formSubmiting} htmlType='submit' type='primary' disabled={ngoaiThoiGian}>
							{intl.formatMessage({ id: 'hocphannhucau.button.dangKy' })}
						</Button>
					</Tooltip>
					<Button onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'dangkyhoctap.form.huy' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormHocPhanDangKyNhuCau;
