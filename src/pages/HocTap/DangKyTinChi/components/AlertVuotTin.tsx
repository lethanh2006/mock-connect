import {
	TrangThaiDonDangKyHocVuot,
	trangThaiDonDangKyHocVuotType,
} from '@/services/DaoTao/DkVuotTinChi/constant';
import { SunOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Row } from 'antd';
import React from 'react';
import { useIntl, useModel } from 'umi';

interface Props {
	onViewLichSu: () => void;
}

const AlertVuotTin: React.FC<Props> = ({ onViewLichSu }) => {
	const intl = useIntl();
	const { danhSach } = useModel('daotao.dkvuottinchi');
	const trangThaiDonDangKy = danhSach[0]?.trangThai;

	if (!trangThaiDonDangKy) return null;

	return (
		<Alert
			style={{ marginBottom: 12 }}
			message={
				<Row justify='space-between' align='middle'>
					<Col style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						{intl.formatMessage({ id: `dangkytinchi.vuottin.status.message.${trangThaiDonDangKy}` })}
					</Col>
					<Col>
						<Button type='primary' onClick={onViewLichSu}>
							{intl.formatMessage({ id: 'dangkytinchi.vuottin.button.xemlichsu' })}
						</Button>
					</Col>
				</Row>
			}
			type={trangThaiDonDangKyHocVuotType[trangThaiDonDangKy]}
			icon={
				trangThaiDonDangKy === TrangThaiDonDangKyHocVuot.YEU_CAU_CHINH_SUA ? <SunOutlined /> : <WarningOutlined />
			}
			showIcon
		/>
	);
};

export default AlertVuotTin;
