import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { resetFieldsForm } from '@/utils/utils';
import { Button, IconWarningCircle } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { Checkbox, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { isDuThinhDaDuyet } from '../utils';

const ConfirmKetHuyLopDKTC = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	recLopDangKy?: DangKyTinChi.ILopDangKy;
	onReload?: () => void | Promise<unknown>;
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visible, setVisible, recLopDangKy, onReload } = props;
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
			const successMsg = intl.formatMessage({ id: 'global.message.xoathanhcong' });

			await deleteDangKyTinChiModel(
				{
					phieuDktcId: phieuDangKy?._id ?? '',
					lopHocPhanId: recLopDangKy?._id ?? '',
				},
				successMsg,
			);

			const data = danhSachLopDangKy.filter((item) => item.maHocPhan !== recLopDangKy?.maHocPhan);
			tinhDataLichHoc(data);
			setDanhSachLopDangKy(data);
			await onReload?.();
			setVisible(false);
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'dangkytinchi.modalconfimhuylop.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={500}
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
								<IconWarningCircle />
							</div>
							<div style={{ textAlign: 'center' }}>
								{intl.formatMessage({ id: 'dangkytinchi.modalconfimhuylop.confirm.cochacmuonhuy' })}
								<br />
								{`${recLopDangKy?.hocPhan?.ten} - ${recLopDangKy?.ten}`}?
							</div>

							<p style={{ color: 'red' }}>
								{isDuThinhDaDuyet(recLopDangKy)
									? intl.formatMessage({ id: 'dangkytinchi.phieudangky.huy.duthinh.daduyet.luuy' })
									: intl.formatMessage(
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
						variant='destructive'
						disabled={!commit}
						loading={formSubmiting}
						onClick={() => handleXoaDangKyTinChi()}
					>
						{intl.formatMessage({ id: 'dangkytinchi.action.xacnhan' })}
					</Button>
					<Button variant='outline' onClick={() => setVisible(false)}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</ModalExpandable>
	);
};

export default ConfirmKetHuyLopDKTC;
