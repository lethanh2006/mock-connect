import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { PicCenterOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import MayTinhThongMinh from './components/MayTinhThongMinh';
import PageCard from '@/components/PageCard';

const KetQuaHocTap = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	return (
		<PageCard
			title={intl.formatMessage({ id: 'ketquahoctap.title' })}
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
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
		</PageCard>
	);
};

export default KetQuaHocTap;
