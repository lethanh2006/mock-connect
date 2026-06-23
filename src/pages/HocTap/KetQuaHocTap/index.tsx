import PageCard from '@/components/PageCard';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';

const KetQuaHocTap = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	return (
		<PageCard
			title={intl.formatMessage({ id: 'menu.Academic.GradesTranscript' })}
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<KetQuaToanKhoaSinhVien maKhoaNganh={maKhoaNganh} loadData={false} />

			<Divider className='divider-big-title' dashed orientation='left'>
				{intl.formatMessage({ id: 'ketquahoctap.diemtongket' })}
			</Divider>
			{/* <TabViewPage
					hideCard
					menu={[
						{
							title: intl.formatMessage({ id: 'ketquahoctap.diemtongket' }),
							menuKey: 'diem',
							content: <DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />,
							icon: <PicCenterOutlined />,
						},
						// {
						// 	title: intl.formatMessage({ id: 'ketquahoctap.maytinh' }),
						// 	menuKey: 'may-tinh',
						// 	content: <MayTinhThongMinh maKhoaNganh={maKhoaNganh} />,
						// 	icon: <SnippetsOutlined />,
						// },
					]}
				/> */}
			<DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />
		</PageCard>
	);
};

export default KetQuaHocTap;
