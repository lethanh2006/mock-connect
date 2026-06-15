import ModalExpandable from '@/components/Table/ModalExpandable';
import { thongTinWithdraw } from '@/services/HocTap/LopHocPhan';
import { Alert, Button, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

type Props = {
	visible: boolean;
	setVisible: (val: boolean) => void;
};

const getWithdrawResult = (
	currentProgress: number,
	totalWCredits: number,
	maxWCredits: number,
	maxPercent: number,
): 'W' | 'F' => {
	const isOverPercent = currentProgress > maxPercent;
	const isOverWLimit = totalWCredits >= maxWCredits;

	if (!isOverPercent && !isOverWLimit) return 'W';
	return 'F';
};

const ModalWithdraw: React.FC<Props> = ({ visible, setVisible }) => {
	const intl = useIntl();
	const { record: recLHP, postWithdrawModel, formSubmiting } = useModel('lophocphan.lophocphan');
	const [loading, setLoading] = useState<boolean>(false);

	const [record, setRecord] = useState<{
		gioiHanTinChiW: number;
		gioiHanPhanTram: number;
		tongTinChiW: number;
		tongSoBuoi: number;
		soBuoiDaQua: number;
	}>();

	useEffect(() => {
		if (recLHP?._id && visible) {
			setLoading(true);
			thongTinWithdraw(recLHP._id)
				.then((res) => setRecord(res?.data?.data))
				.finally(() => setLoading(false));
		}
	}, [recLHP?._id, visible]);

	const currentProgress = record?.tongSoBuoi ? Math.round((record.soBuoiDaQua / record.tongSoBuoi) * 100) : 0;

	const totalWCredits = record?.tongTinChiW || 0;
	const maxWCredits = record?.gioiHanTinChiW || 0;
	const maxPercent = record?.gioiHanPhanTram || 0;

	const result = getWithdrawResult(currentProgress, totalWCredits, maxWCredits, maxPercent);
	const isW = result === 'W';

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'lophocphan.withdraw.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			width={720}
		>
			<Spin spinning={loading}>
				<div style={{ lineHeight: 1.6 }}>
					<h3>{intl.formatMessage({ id: 'lophocphan.withdraw.currentInfo' })}</h3>
					<ul>
						<li>{intl.formatMessage({ id: 'lophocphan.withdraw.progress' }, { value: currentProgress })}</li>
						<li>
							{intl.formatMessage(
								{ id: 'lophocphan.withdraw.totalWCredits' },
								{ current: totalWCredits, max: maxWCredits },
							)}
						</li>
					</ul>

					<h3>{intl.formatMessage({ id: 'lophocphan.withdraw.rule' })}</h3>
					<ul>
						<li>{intl.formatMessage({ id: 'lophocphan.withdraw.rule.before' }, { percent: maxPercent })}</li>
						<li>{intl.formatMessage({ id: 'lophocphan.withdraw.rule.maxW' }, { max: maxWCredits })}</li>
						<li>{intl.formatMessage({ id: 'lophocphan.withdraw.rule.after' }, { percent: maxPercent })}</li>
					</ul>

					<h3>{intl.formatMessage({ id: 'lophocphan.withdraw.resultTitle' })}</h3>
					<div style={{ marginBottom: 12 }}>
						<Tag color={isW ? 'gold' : 'red'}>
							{intl.formatMessage({
								id: isW ? 'lophocphan.withdraw.result.W' : 'lophocphan.withdraw.result.F',
							})}
						</Tag>
					</div>

					{isW ? (
						<Alert
							type='warning'
							showIcon
							message={intl.formatMessage({ id: 'lophocphan.withdraw.alert.W.title' })}
							description={intl.formatMessage({ id: 'lophocphan.withdraw.alert.W.desc' })}
						/>
					) : (
						<Alert
							type='error'
							showIcon
							message={intl.formatMessage({ id: 'lophocphan.withdraw.alert.F.title' })}
							description={intl.formatMessage({ id: 'lophocphan.withdraw.alert.F.desc' })}
						/>
					)}
				</div>

				<div className='form-footer'>
					<Button
						loading={formSubmiting}
						type='primary'
						danger={!isW}
						onClick={() => {
							if (recLHP?._id) {
								postWithdrawModel({
									lopHpSvId: recLHP?._id,
								}).then(() => history.push('/hoc-tap/lop-tin-chi'));
							}
						}}
					>
						{intl.formatMessage({ id: 'lophocphan.withdraw.confirm' })}
					</Button>

					<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Spin>
		</ModalExpandable>
	);
};

export default ModalWithdraw;
