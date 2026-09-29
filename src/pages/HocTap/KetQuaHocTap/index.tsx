import PageCard from '@/components/PageCard';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { CardContent, Card as VinCard } from '@vinuni/ui';
import { Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import {
	ENABLE_KET_QUA_HOC_TAP_MOCK,
	MOCK_DIEM_HOC_PHAN,
	MOCK_KET_QUA_HOC_KY,
	MOCK_MA_KHOA_NGANH,
	MOCK_TONG_TIN_CHI_CHUONG_TRINH,
} from './mockData';

const KetQuaHocTap = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const maKhoaNganhHienThi = ENABLE_KET_QUA_HOC_TAP_MOCK ? MOCK_MA_KHOA_NGANH : maKhoaNganh;

	return (
		<PageCard
			stickyHeader
			title={intl.formatMessage({ id: 'menu.HocTap.GradesTranscript' })}
			extra={
				<SelectSongNganh className='field-w-250' value={maKhoaNganhHienThi} onChange={(val) => setMaKhoaNganh(val)} />
			}
		>
			<VinCard>
				<CardContent>
					<KetQuaToanKhoaSinhVien
						maKhoaNganh={maKhoaNganhHienThi}
						loadData={false}
						data={ENABLE_KET_QUA_HOC_TAP_MOCK ? MOCK_KET_QUA_HOC_KY : undefined}
						tongSoTinChiChuongTrinh={ENABLE_KET_QUA_HOC_TAP_MOCK ? MOCK_TONG_TIN_CHI_CHUONG_TRINH : undefined}
					/>
				</CardContent>
			</VinCard>
			<VinCard>
				<CardContent>
					<Divider className='divider-big-title' dashed orientation='left'>
						{intl.formatMessage({ id: 'ketquahoctap.diemtongket' })}
					</Divider>
					<DiemThanhPhanSV
						maKhoaNganh={maKhoaNganhHienThi}
						mockDiem={ENABLE_KET_QUA_HOC_TAP_MOCK ? MOCK_DIEM_HOC_PHAN : undefined}
						mockKetQuaHocKy={ENABLE_KET_QUA_HOC_TAP_MOCK ? MOCK_KET_QUA_HOC_KY : undefined}
					/>
				</CardContent>
			</VinCard>
		</PageCard>
	);
};

export default KetQuaHocTap;
