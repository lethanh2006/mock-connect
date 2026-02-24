import ButtonExtend from '@/components/Table/ButtonExtend';
import { Activity } from '@/services/CCT/Activity/typing';
import { Modal, Popconfirm, Space } from 'antd';
import { useIntl, useModel } from 'umi';
import CardChiTietSuKien from './components/CardChiTietSuKien';

const ChiTietActivity = (props: {
	getData?: () => void;
	setVisibleDangKy?: (val: boolean) => void;
	activeKey?: string;
}) => {
	const { getData, setVisibleDangKy, activeKey } = props;
	const intl = useIntl();
	const { visibleForm, setVisibleForm, record, registerActivityModel } = useModel('cct.activity');
	const { deleteActivityModel } = useModel('cct.activityoutcome');

	return (
		<Modal
			title='Activity Detail'
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={1000}
			footer={null}
			styles={{
				body: { backgroundColor: '#F8F8F8', borderRadius: 2 },
				header: { backgroundColor: '#F8F8F8' },
			}}
		>
			<div style={{ marginTop: -12 }}>
				<CardChiTietSuKien record={record ?? ({} as Activity.IRecord)} activeKey={activeKey} />
			</div>

			<div
				style={{
					backgroundColor: '#fff',
					display: 'flex',
					gap: 8,
					justifyContent: !record?.workflow ? 'flex-end' : 'space-between',
					margin: '15px -15px -15px -15px',
					padding: 16,
				}}
			>
				{!!record?.workflow && (
					<Popconfirm
						title='Confirm cancellation of activity registration'
						placement='topLeft'
						onConfirm={() => deleteActivityModel(record?._id ?? '', getData).then(() => setVisibleForm(false))}
					>
						<ButtonExtend type='link' className='btn-unregister'>
							UNREGISTER
						</ButtonExtend>
					</Popconfirm>
				)}

				<Space wrap>
					<ButtonExtend onClick={() => setVisibleForm(false)}>CLOSE</ButtonExtend>
					<ButtonExtend
						type='primary'
						onClick={() =>
							registerActivityModel(record?._id ?? '', getData).then(() => {
								setVisibleForm(false);
								setVisibleDangKy && setVisibleDangKy(true);
							})
						}
						disabled={!!record?.workflow}
					>
						REGISTER NOW
					</ButtonExtend>
				</Space>
			</div>
		</Modal>
	);
};

export default ChiTietActivity;
