import { ADVISOR_TYPE_LABEL_KEY, EAdvisorType } from '@/services/AdvisorChange/constant';
import { AdvisorChange } from '@/services/AdvisorChange/typing';
import { ApartmentOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
import type { CSSProperties, ReactNode } from 'react';
import { useIntl } from 'umi';

type AdvisorInfoCardProps = {
	type: EAdvisorType;
	advisor?: AdvisorChange.IMyAdvisor;
	style?: CSSProperties;
};

const AdvisorInfoCard: React.FC<AdvisorInfoCardProps> = ({ type, advisor, style }) => {
	const intl = useIntl();
	const advisorName = advisor?.advisorName;
	const advisorPhone = advisor?.metaData?.soDienThoai as string | undefined;

	// Peer advisor gắn theo Viện, không theo Ngành → hiển thị Viện thay vì Ngành.
	const isPeer = type === EAdvisorType.PEER_ADVISOR;

	type InfoRow = { icon: ReactNode; label: string; value: string };
	const infoRows: InfoRow[] = [
		{
			icon: <ApartmentOutlined />,
			label: intl.formatMessage({
				id: isPeer ? 'idp.advisorChange.advisorInstitute' : 'idp.advisorChange.advisorMajor',
			}),
			value: (isPeer ? advisor?.tenVien : advisor?.tenNganh) || '-',
		},
		{
			icon: <MailOutlined />,
			label: intl.formatMessage({ id: 'idp.advisorChange.advisorEmail' }),
			value: advisor?.email || '-',
		},
		{
			icon: <PhoneOutlined />,
			label: intl.formatMessage({ id: 'idp.advisorChange.advisorPhone' }),
			value: advisorPhone || '-',
		},
	];

	return (
		<div
			style={{
				flex: '1 1 280px',
				minWidth: 0,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				padding: '12px 16px',
				border: '1px solid #f0f0f0',
				borderRadius: 8,
				background: '#fafafa',
				...style,
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
				<Avatar size={36} icon={<UserOutlined />} style={{ flex: '0 0 auto', backgroundColor: '#bfbfbf' }} />
				<div style={{ minWidth: 0, overflowWrap: 'anywhere', flex: 1 }}>
					<Typography.Text type='secondary' style={{ fontSize: 12 }}>
						{intl.formatMessage({ id: ADVISOR_TYPE_LABEL_KEY[type] })}
					</Typography.Text>
					<div>
						{advisorName ? (
							<strong>{advisorName}</strong>
						) : (
							<Typography.Text type='secondary'>
								{intl.formatMessage({ id: 'idp.advisorChange.noAdvisorAssigned' })}
							</Typography.Text>
						)}
					</div>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 6,
					paddingTop: 10,
					borderTop: '1px dashed #e8e8e8',
				}}
			>
				{infoRows.map((row) => (
					<div key={row.label} style={{ display: 'flex', gap: 8, fontSize: 12 }}>
						<Typography.Text
							type='secondary'
							style={{ flex: '0 0 110px', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
						>
							{row.icon}
							{row.label}
						</Typography.Text>
						<Typography.Text style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{row.value}</Typography.Text>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdvisorInfoCard;
