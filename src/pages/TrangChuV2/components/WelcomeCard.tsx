import { Button } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import { Card } from '@/components/PageCard';
import dayjs from '@/utils/dayjs';
import { Flex, Typography } from 'antd';
import { useIntl, useModel } from 'umi';

const pillStyle = {
	background: '#2a5e96',
	cursor: 'default',
} as const;

const getSemesterKey = (month: number) => {
	if (month >= 0 && month <= 4) return 'spring';
	if (month >= 5 && month <= 6) return 'summer';
	return 'fall';
};

const WelcomeCard = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { record: recSinhVien, loading } = useModel('sinhvien.sinhvien');
	const { danhSach } = useModel('daotao.thoikhoabieu');

	const ten =
		recSinhVien?.ten?.trim() ||
		[recSinhVien?.firstName, recSinhVien?.lastName].filter(Boolean).join(' ').trim() ||
		initialState?.currentUser?.given_name ||
		'bạn';

	const now = dayjs();
	const semester = intl.formatMessage({
		id: `trangchu.v2.welcome.semester.${getSemesterKey(now.month())}`,
	});
	const metaText = intl.formatMessage(
		{ id: 'trangchu.v2.welcome.meta' },
		{ semester, year: now.year(), week: now.isoWeek() },
	);
	const greeting = intl.formatMessage(
		{ id: 'trangchu.v2.welcome.greeting' },
		{
			ten,
			welcome: intl.formatMessage({ id: 'trangchu.title.quaylai' }),
		},
	);

	return (
		<Card
			loading={loading}
			bordered={false}
			hideInnerCard
			style={{
				background: 'var(--color-official-300)',
				borderRadius: 'var(--rd-primary, 22px)',
				padding: '12px 24px',
			}}
		>
			<Row gutter={[16, 16]} align='middle' justify='space-between'>
				<Col xs={24} lg={14}>
					<Flex vertical gap={'8px'}>
						<Typography.Text style={{ color: '#FFFFFF99', fontSize: 14, lineHeight: '20px', fontWeight: 400 }}>
							{metaText}
						</Typography.Text>
						<h1 style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: 16, lineHeight: '24px' }}>{greeting}</h1>
					</Flex>
				</Col>

				<Col xs={24} lg={10}>
					<Flex gap={8} wrap justify='flex-end'>
						<Button style={{ ...pillStyle, pointerEvents: 'none' }} tabIndex={-1}>
							{intl.formatMessage({ id: 'trangchu.v2.welcome.classesToday' }, { count: danhSach?.length ?? 0 })}
						</Button>
					</Flex>
				</Col>
			</Row>
		</Card>
	);
};

export default WelcomeCard;
