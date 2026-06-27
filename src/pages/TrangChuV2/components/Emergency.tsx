import bao_mat from '@/assets/trangchu/bao_mat.svg';
import canh_sat from '@/assets/trangchu/canh_sat.svg';
import chu_thap from '@/assets/trangchu/chu_thap.svg';
import Clinic from '@/assets/trangchu/Clinic.svg';
import ky_thuat from '@/assets/trangchu/ky_thuat.svg';
import nha_o from '@/assets/trangchu/nha_o.svg';
import suc_khoe from '@/assets/trangchu/suc_khoe.svg';
import { Card, Col, Flex, Image, Row, Typography } from 'antd';

const hotlines = [
	{ id: 1, title: 'Clinic', phone: '(+84) 866 200 019', icon: Clinic },
	{ id: 2, title: 'Well-being', phone: '(+84) 868 900 016', icon: suc_khoe },
	{ id: 3, title: 'Residential Office', phone: '(+84) 866 100 018', icon: nha_o },
	{ id: 4, title: 'Technical Unit', phone: '(+84) 24 710 897 79', icon: ky_thuat },
	{ id: 5, title: 'Security Unit', phone: '(+84) 24 710 897 79', icon: bao_mat },
	{ id: 6, title: 'Gia Lam Hospital', phone: '(+84) 24 710 897 79', icon: chu_thap },
	{ id: 7, title: 'Vinmec Times City', phone: '(+84) 24 710 897 79', icon: chu_thap },
	{ id: 8, title: 'Police', phone: '(+84) 24 710 897 79', icon: canh_sat },
];

const Emergency = () => {
	return (
		<Card
			title={
				<span className='title' style={{ color: '#000' }}>
					Emergency 24/7 Hotline
				</span>
			}
			className='card-big-title card-borderless'
			variant='borderless'
		>
			<Row gutter={[12, 12]}>
				{hotlines.map((item) => (
					<Col xs={24} sm={12} key={item.id}>
						<Card size='small' variant='outlined'>
							<Flex vertical gap={12} align='flex-start'>
								<Image src={item.icon} alt={item.title} width={20} height={20} preview={false} />
								<Typography.Text strong style={{ fontSize: 12 }}>
									{item.title}
								</Typography.Text>
								<Typography.Link
									href={`tel:${item.phone.replace(/\D/g, '')}`}
									underline
									type='secondary'
									style={{ fontSize: 12 }}
								>
									{item.phone}
								</Typography.Link>
							</Flex>
						</Card>
					</Col>
				))}
			</Row>
		</Card>
	);
};

export default Emergency;
