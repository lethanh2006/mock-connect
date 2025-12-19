import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { PicCenterOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import MayTinhThongMinh from './components/MayTinhThongMinh';

const KetQuaHocTap = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	return (
		<Card
			className='card-big-title card-borderless'
			variant='borderless'
			title={
				<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
					<span>{intl.formatMessage({ id: 'ketquahoctap.title' })}</span>
					<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
				</Space>
			}
		>
			<Card>
				<KetQuaToanKhoaSinhVien maKhoaNganh={maKhoaNganh} loadData={false} />

				<div style={{ marginTop: 8 }}>
					<TabViewPage
						hideCard
						menu={[
							{
								title: intl.formatMessage({ id: 'ketquahoctap.diemtongket' }),
								menuKey: 'diem',
								content: <DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />,
								icon: <PicCenterOutlined />,
							},
							{
								title: intl.formatMessage({ id: 'ketquahoctap.maytinh' }),
								menuKey: 'may-tinh',
								content: <MayTinhThongMinh maKhoaNganh={maKhoaNganh} />,
								icon: <SnippetsOutlined />,
							},
						]}
					/>
				</div>
			</Card>
		</Card>
	);
};

export default KetQuaHocTap;
