import PageCard from '@/components/PageCard';
import VinSelect from '@/components/VinSelect';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { CardContent, CardHeader, CardTitle, Card as VinCard } from '@vinuni/ui';
import { useIntl, useModel } from 'umi';
import { isHocTapPreview } from '../localPreview';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import {
	PREVIEW_DIEM_HOC_PHAN,
	PREVIEW_KET_QUA_HOC_KY,
	PREVIEW_MA_KHOA_NGANH,
	PREVIEW_TONG_TIN_CHI_CHUONG_TRINH,
} from './localPreviewData';
import './style.less';

const KetQuaHocTap = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const preview = isHocTapPreview();
	const maKhoaNganhHienThi = preview ? PREVIEW_MA_KHOA_NGANH : maKhoaNganh;

	return (
		<PageCard
			className='academic-result-page'
			stickyHeader
			title={intl.formatMessage({ id: 'menu.HocTap.GradesTranscript' })}
			extra={
				preview ? (
					<VinSelect
						className='field-w-250'
						value={PREVIEW_MA_KHOA_NGANH}
						options={[{ value: PREVIEW_MA_KHOA_NGANH, label: 'Computer Science' }]}
					/>
				) : (
					<SelectSongNganh className='field-w-250' value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
				)
			}
		>
			<div className='academic-result-content'>
				<VinCard>
					<CardContent>
						<KetQuaToanKhoaSinhVien
							maKhoaNganh={maKhoaNganhHienThi}
							data={preview ? PREVIEW_KET_QUA_HOC_KY : undefined}
							tongSoTinChiChuongTrinh={preview ? PREVIEW_TONG_TIN_CHI_CHUONG_TRINH : undefined}
						/>
					</CardContent>
				</VinCard>
				<VinCard>
					<CardHeader>
						<CardTitle>{intl.formatMessage({ id: 'ketquahoctap.diemtongket' })}</CardTitle>
					</CardHeader>
					<CardContent>
						<DiemThanhPhanSV
							maKhoaNganh={maKhoaNganhHienThi}
							previewDiem={preview ? PREVIEW_DIEM_HOC_PHAN : undefined}
							previewKetQuaHocKy={preview ? PREVIEW_KET_QUA_HOC_KY : undefined}
						/>
					</CardContent>
				</VinCard>
			</div>
		</PageCard>
	);
};

export default KetQuaHocTap;
