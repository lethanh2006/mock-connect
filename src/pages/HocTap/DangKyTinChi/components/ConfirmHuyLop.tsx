import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { resetFieldsForm } from '@/utils/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ConfirmKetHuyLopDKTC = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	recLopDangKy?: DangKyTinChi.ILopDangKy;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visible, setVisible, recLopDangKy } = props;
	const {
		deleteDangKyTinChiModel,
		phieuDangKy,
		danhSachLopDangKy,
		tinhDataLichHoc,
		setDanhSachLopDangKy,
		formSubmiting,
	} = useModel('daotao.dotdangkytinchi');
	const commit: boolean = Form.useWatch('commit', form);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const handleXoaDangKyTinChi = async () => {
		try {
			await deleteDangKyTinChiModel(
				{
					phieuDktcId: phieuDangKy?._id ?? '',
					lopHocPhanId: recLopDangKy?._id ?? '',
				},
				intl.formatMessage({ id: 'global.message.xoathanhcong' }),
			);

			const data = danhSachLopDangKy.filter((item) => item.maHocPhan !== recLopDangKy?.maHocPhan);
			tinhDataLichHoc(data);
			setDanhSachLopDangKy(data);
			setVisible(false);
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'dangkytinchi.modalconfimhuylop.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={500}
			maskClosable={false}
		>
			<Form form={form} layout='vertical'>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 8,
								alignItems: 'center',
							}}
						>
							<div style={{ color: 'orange', fontSize: 48 }}>
								<ExclamationCircleFilled />
							</div>
							<div style={{ textAlign: 'center' }}>
								{intl.formatMessage({ id: 'dangkytinchi.modalconfimhuylop.confirm.cochacmuonhuy' })}
								<br />
								{`${recLopDangKy?.hocPhan?.ten} - ${recLopDangKy?.ten}`}?
							</div>

							<p style={{ color: 'red' }}>
								{intl.formatMessage(
									{ id: 'dangkytinchi.modalconfimhuylop.luuy.thaotackhonthehuy' },
									{
										b: (chunks) => <b>{chunks}</b>,
									},
								)}{' '}
							</p>
						</div>
					</Col>

					<Col span={24}>
						<Form.Item name='commit' valuePropName='checked' initialValue={false}>
							<Checkbox>{intl.formatMessage({ id: 'dangkytinchi.modalconfimhuylop.check.dahieuvaxacnhan' })}</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button
						type='primary'
						danger
						disabled={!commit}
						loading={formSubmiting}
						onClick={() => handleXoaDangKyTinChi()}
					>
						{intl.formatMessage({ id: 'dangkytinchi.action.xacnhan' })}
					</Button>
					<Button onClick={() => setVisible(false)}>
						{intl.formatMessage({ id: 'dangkytinchi.modalconfimhuylop.check.dahieuvaxacnhan' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ConfirmKetHuyLopDKTC;
