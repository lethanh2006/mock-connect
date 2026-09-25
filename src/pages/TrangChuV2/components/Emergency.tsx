import bao_mat from '@/assets/trangchu/bao_mat.svg';
import canh_sat from '@/assets/trangchu/canh_sat.svg';
import chu_thap from '@/assets/trangchu/chu_thap.svg';
import Clinic from '@/assets/trangchu/Clinic.svg';
import ky_thuat from '@/assets/trangchu/ky_thuat.svg';
import nha_o from '@/assets/trangchu/nha_o.svg';
import suc_khoe from '@/assets/trangchu/suc_khoe.svg';
import { Col, Row } from '@/components/MyGrid';
import { CardContent, CardHeader, CardTitle, Card as VinCard } from '@vinuni/ui';
import { Flex, Image, Typography } from 'antd';
import { useIntl } from 'umi';

const hotlines = [
	{ id: 1, titleId: 'trangchu.v2.emergency.clinic', phone: '(+84) 866 200 019', icon: Clinic },
	{ id: 2, titleId: 'trangchu.v2.emergency.wellBeing', phone: '(+84) 868 900 016', icon: suc_khoe },
	{ id: 3, titleId: 'trangchu.v2.emergency.residentialOffice', phone: '(+84) 866 100 018', icon: nha_o },
	{ id: 4, titleId: 'trangchu.v2.emergency.technicalUnit', phone: '(+84) 24 710 897 79', icon: ky_thuat },
	{ id: 5, titleId: 'trangchu.v2.emergency.securityUnit', phone: '(+84) 24 710 897 79', icon: bao_mat },
	{ id: 6, titleId: 'trangchu.v2.emergency.giaLamHospital', phone: '(+84) 968 059 536', icon: chu_thap },
	{ id: 7, titleId: 'trangchu.v2.emergency.vinmecTimesCity', phone: '(+84)24 3974 3556', icon: chu_thap },
	{ id: 8, titleId: 'trangchu.v2.emergency.police', phone: '113', icon: canh_sat },
];

const Emergency = () => {
	const intl = useIntl();

	return (
		<VinCard>
			<CardHeader>
				<CardTitle>{intl.formatMessage({ id: 'trangchu.v2.emergency.title' })}</CardTitle>
			</CardHeader>
			<CardContent>
				<Row gutter={[12, 12]}>
					{hotlines.map((item) => {
						const title = intl.formatMessage({ id: item.titleId });
						return (
							<Col xs={24} sm={12} key={item.id}>
								<a className='vin-hotline-card' href={`tel:${item.phone.replace(/\D/g, '')}`}>
									<Flex vertical gap={8} align='flex-start'>
										<Image src={item.icon} alt={title} width={20} height={20} preview={false} />
										<Typography.Text strong className='vin-hotline-card__title'>
											{title}
										</Typography.Text>
										<Typography.Text className='vin-hotline-card__phone'>{item.phone}</Typography.Text>
									</Flex>
								</a>
							</Col>
						);
					})}
				</Row>
			</CardContent>
		</VinCard>
	);
};

export default Emergency;
