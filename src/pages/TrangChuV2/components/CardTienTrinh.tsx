import { Card, Col, Flex, Row, Typography } from 'antd';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

interface StatCardProps {
	title: string;
	value: string | number;
	subValue?: string;
	periodText?: string;
	disabled?: boolean;
}

const StatCard = ({ title, value, subValue, periodText, disabled }: StatCardProps) => (
	<Card size='small'>
		<Flex vertical gap={4}>
			<Typography.Text type='secondary' style={{ fontSize: 14 }}>
				{title}
			</Typography.Text>

			<Typography.Text
				style={{
					fontSize: 18,
					lineHeight: 1.2,
					fontWeight: 700,
					color: disabled ? '#cfcfcf' : '#2e2e2e',
				}}
			>
				{disabled ? '--' : value}
				{!disabled && subValue && (
					<Typography.Text type='secondary' style={{ fontSize: 12, fontWeight: 600 }}>
						{' '}
						{subValue}
					</Typography.Text>
				)}
			</Typography.Text>

			{periodText && (
				<Typography.Text type='secondary' style={{ fontSize: 12 }}>
					{periodText}
				</Typography.Text>
			)}
		</Flex>
	</Card>
);

const CardTienTrinh = () => {
	const intl = useIntl();
	const { record: recTienTrinh, loading: loadingTienTrinh } = useModel('sinhvien.tientrinhtotnghiep');
	const { danhSach: danhSachActivity } = useModel('cct.activity');

	const stats = useMemo<StatCardProps[]>(() => {
		const gpa = recTienTrinh?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4;
		const credits = recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa;
		const totalCredits = recTienTrinh?.ctdtKeHoach?.tongSoTinChi;
		const activities = danhSachActivity?.length ?? 0;

		return [
			{
				title: intl.formatMessage({ id: 'trangchu.v2.academicProgress.cgpa' }),
				// value: gpa ?? '--',
				value: '--',
				periodText: intl.formatMessage({ id: 'trangchu.v2.academicProgress.lastSemester' }),
				disabled: gpa === null || gpa === undefined,
			},
			{
				title: intl.formatMessage({ id: 'trangchu.v2.academicProgress.credits' }),
				value: credits ?? '--',
				subValue: totalCredits ? `/ ${totalCredits}` : undefined,
				periodText: intl.formatMessage({ id: 'trangchu.v2.academicProgress.lastSemester' }),
				disabled: credits === null || credits === undefined,
			},
			{
				title: intl.formatMessage({ id: 'trangchu.v2.academicProgress.activities' }),
				value: activities ?? '--',
				periodText: intl.formatMessage({ id: 'trangchu.v2.academicProgress.lastWeek' }),
				disabled: activities === null || activities === undefined,
			},
			{
				title: intl.formatMessage({ id: 'trangchu.v2.academicProgress.awards' }),
				value: '--',
				periodText: intl.formatMessage({ id: 'trangchu.v2.academicProgress.lastSemester' }),
			},
		];
	}, [intl, recTienTrinh, danhSachActivity]);

	return (
		<Card
			title={
				<span className='title' style={{ color: '#000' }}>
					{intl.formatMessage({ id: 'trangchu.v2.academicProgress.title' })}
				</span>
			}
			className='card-big-title card-borderless'
			variant='borderless'
			loading={loadingTienTrinh}
		>
			<Row gutter={[12, 12]}>
				{stats.map((item) => (
					<Col xs={24} sm={12} key={item.title}>
						<StatCard {...item} />
					</Col>
				))}
			</Row>
		</Card>
	);
};

export default CardTienTrinh;
