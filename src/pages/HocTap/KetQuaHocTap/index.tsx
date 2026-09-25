import PageCard from '@/components/PageCard';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { CardContent, Card as VinCard } from '@vinuni/ui';
import { Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';

const KetQuaHocTap = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	return (
		<PageCard
			stickyHeader
			title={intl.formatMessage({ id: 'menu.HocTap.GradesTranscript' })}
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<VinCard>
				<CardContent>
					<KetQuaToanKhoaSinhVien maKhoaNganh={maKhoaNganh} loadData={false} />
				</CardContent>
			</VinCard>
			<VinCard>
				<CardContent>
					<Divider className='divider-big-title' dashed orientation='left'>
						{intl.formatMessage({ id: 'ketquahoctap.diemtongket' })}
					</Divider>
					<DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />
				</CardContent>
			</VinCard>
		</PageCard>
	);
};

export default KetQuaHocTap;
