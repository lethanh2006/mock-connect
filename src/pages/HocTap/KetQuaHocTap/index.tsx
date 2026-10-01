import PageCard from '@/components/PageCard';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { CardContent, CardHeader, CardTitle, Card as VinCard } from '@vinuni/ui';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import './style.less';

const KetQuaHocTap = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	return (
		<PageCard
			stickyHeader
			title={intl.formatMessage({ id: 'menu.HocTap.GradesTranscript' })}
			extra={<SelectSongNganh className='field-w-250' value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<div className='academic-result-content'>
				<VinCard>
					<CardContent>
						<KetQuaToanKhoaSinhVien maKhoaNganh={maKhoaNganh} />
					</CardContent>
				</VinCard>
				<VinCard>
					<CardHeader>
						<CardTitle>{intl.formatMessage({ id: 'ketquahoctap.diemtongket' })}</CardTitle>
					</CardHeader>
					<CardContent>
						<DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />
					</CardContent>
				</VinCard>
			</div>
		</PageCard>
	);
};

export default KetQuaHocTap;
