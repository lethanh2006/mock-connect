import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormTraLoiKhaoSat from './Form';

const ModalKhaoSatBatBuoc = () => {
	const intl = useIntl();
	const { visibleKhaoSatBatBuoc, record, dsKhaoSatBatBuoc, isThanhCong, setIsThanhCong, setVisibleKhaoSatBatBuoc } =
		useModel('tienich.dotkhaosat');
	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');

	const getBieuMauModel = () => {
		if (record?._id) getBieuMau(record?.idKhaoSat ?? '');
	};

	useEffect(() => {
		getBieuMauModel();
	}, [record?._id]);

	return (
		<Modal
			title={intl.formatMessage({ id: 'khaosat.batbuoc.title' })}
			open={visibleKhaoSatBatBuoc}
			footer={null}
			width={800}
			closable={false}
			keyboard={false}
		>
			{isThanhCong ? (
				<>
					<div style={{ marginTop: 12, textAlign: 'center' }}>
						<div>
							<CheckCircleOutlined
								style={{ color: 'var(--ant-success-color)', fontSize: 100, marginBottom: 12 }}
								type='primary'
							/>
						</div>

						<div style={{ color: '#1890ff', fontSize: 20, fontWeight: 600 }}>
							{intl.formatMessage({ id: 'khaosat.batbuoc.thanhcong' })}
						</div>

						<div>
							{dsKhaoSatBatBuoc?.length ? (
								<i>
									{intl.formatMessage(
										{ id: 'khaosat.batbuoc.noti' },
										{
											count: dsKhaoSatBatBuoc?.length,
											b: (chunks) => <b>{chunks}</b>,
										},
									)}
								</i>
							) : (
								<i>{intl.formatMessage({ id: 'khaosat.batbuoc.noti1' })}</i>
							)}
						</div>
					</div>
					<div className='form-footer'>
						{dsKhaoSatBatBuoc?.length ? (
							<Button type='primary' onClick={() => setIsThanhCong(false)}>
								{intl.formatMessage({ id: 'khaosat.batbuoc.chitiet' })}
							</Button>
						) : (
							<Button
								onClick={() => {
									setIsThanhCong(false);
									setVisibleKhaoSatBatBuoc(false);
								}}
							>
								{intl.formatMessage({ id: 'global.button.dong' })}
							</Button>
						)}
					</div>
				</>
			) : (
				<>
					<div style={{ marginBottom: 12 }}>
						<Select
							style={{ width: 300 }}
							value={record?._id}
							placeholder={intl.formatMessage({ id: 'khaosat.batbuoc.place' })}
							options={dsKhaoSatBatBuoc?.map((item) => ({
								value: item._id,
								label: item.ten,
							}))}
						/>
					</div>
					<FormTraLoiKhaoSat hideCard isBatBuoc />
				</>
			)}
		</Modal>
	);
};

export default ModalKhaoSatBatBuoc;
