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
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
			}}
		>
			<PageCard
				stickyHeader
				title={intl.formatMessage({ id: 'menu.HocTap.GradesTranscript' })}
				extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
			>
				<KetQuaToanKhoaSinhVien maKhoaNganh={maKhoaNganh} loadData={false} />
			</PageCard>
			<div
				style={{
					backgroundColor: '#fff',
					padding: '20px',
					borderRadius: '10px',
				}}
			>
				<Divider className='divider-big-title' dashed orientation='left'>
					{intl.formatMessage({ id: 'ketquahoctap.diemtongket' })}
				</Divider>
				<DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />
			</div>
		</div>
	);
};

export default KetQuaHocTap;
