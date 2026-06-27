import dayjs from '@/utils/dayjs';
import { Card, Col, Flex, Row, Tag, Typography } from 'antd';
import { useIntl, useModel } from 'umi';

const pillStyle = {
	background: 'rgba(255, 255, 255, 0.2)',
	border: 'none',
	color: '#fff',
	borderRadius: 20,
	padding: '6px 14px',
	fontSize: 13,
	fontWeight: 600,
	margin: 0,
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
			variant='borderless'
			style={{ background: 'var(--color-official-300)', borderRadius: 8 }}
			styles={{ body: { padding: '20px 24px' } }}
		>
			<Row gutter={[16, 16]} align='middle' justify='space-between'>
				<Col xs={24} lg={14}>
					<Flex vertical gap={4}>
						<Typography.Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{metaText}</Typography.Text>
						<Typography.Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
							{greeting}
						</Typography.Title>
					</Flex>
				</Col>

				<Col xs={24} lg={10}>
					<Flex gap={8} wrap justify='flex-end'>
						<Tag style={pillStyle}>
							{intl.formatMessage({ id: 'trangchu.v2.welcome.classesToday' }, { count: danhSach?.length ?? 0 })}
						</Tag>
					</Flex>
				</Col>
			</Row>
		</Card>
	);
};

export default WelcomeCard;
