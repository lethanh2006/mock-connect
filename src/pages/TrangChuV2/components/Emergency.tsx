import bao_mat from '@/assets/trangchu/bao_mat.svg';
import canh_sat from '@/assets/trangchu/canh_sat.svg';
import chu_thap from '@/assets/trangchu/chu_thap.svg';
import Clinic from '@/assets/trangchu/Clinic.svg';
import ky_thuat from '@/assets/trangchu/ky_thuat.svg';
import nha_o from '@/assets/trangchu/nha_o.svg';
import suc_khoe from '@/assets/trangchu/suc_khoe.svg';
import PageCard from '@/components/PageCard';
import { Flex, Image, Typography } from 'antd';
import { useIntl } from 'umi';
import { Col, Row } from '@/components/MyGrid';

const hotlines = [
	{ id: 1, titleId: 'trangchu.v2.emergency.clinic', phone: '(+84) 866 200 019', icon: Clinic },
	{ id: 2, titleId: 'trangchu.v2.emergency.wellBeing', phone: '(+84) 868 900 016', icon: suc_khoe },
	{ id: 3, titleId: 'trangchu.v2.emergency.residentialOffice', phone: '(+84) 866 100 018', icon: nha_o },
	{ id: 4, titleId: 'trangchu.v2.emergency.technicalUnit', phone: '(+84) 24 710 897 79', icon: ky_thuat },
	{ id: 5, titleId: 'trangchu.v2.emergency.securityUnit', phone: '(+84) 24 710 897 79', icon: bao_mat },
	{ id: 6, titleId: 'trangchu.v2.emergency.giaLamHospital', phone: '(+84) 24 710 897 79', icon: chu_thap },
	{ id: 7, titleId: 'trangchu.v2.emergency.vinmecTimesCity', phone: '(+84) 24 710 897 79', icon: chu_thap },
	{ id: 8, titleId: 'trangchu.v2.emergency.police', phone: '(+84) 24 710 897 79', icon: canh_sat },
];

const Emergency = () => {
	const intl = useIntl();

	return (
		<PageCard level={3} hideInnerCard title={intl.formatMessage({ id: 'trangchu.v2.emergency.title' })}>
			<Row gutter={[12, 12]}>
				{hotlines.map((item) => {
					const title = intl.formatMessage({ id: item.titleId });
					return (
						<Col xs={24} sm={12} key={item.id}>
							<div
								className='vin-hotline-card'
								style={{
									padding: '12px 16px',
									border: '1px solid var(--color-border-secondary, #f0f0f0)',
									borderRadius: 'var(--vin-border-radius, 16px)',
									background: 'var(--color-bg-container, #ffffff)',
								}}
							>
								<Flex vertical gap={12} align='flex-start'>
									<Image src={item.icon} alt={title} width={20} height={20} preview={false} />
									<Typography.Text strong style={{ fontSize: 12 }}>
										{title}
									</Typography.Text>
									<Typography.Link
										href={`tel:${item.phone.replace(/\D/g, '')}`}
										underline
										type='secondary'
										style={{ fontSize: 12, whiteSpace: 'nowrap' }}
									>
										{item.phone}
									</Typography.Link>
								</Flex>
							</div>
						</Col>
					);
				})}
			</Row>
		</PageCard>
	);
};

export default Emergency;
