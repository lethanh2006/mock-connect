import { vaiTroSvLhc } from '@/services/DaoTao/SinhVien/constants';
import { Descriptions } from 'antd';
import { useIntl, useModel } from 'umi';
import DanhSachSinhVien from '../../LopHocPhan/components/DanhSachSinhVien';

const ThongTinChungLopHanhChinh = () => {
	const intl = useIntl();
	const { record, loading, recordDetail } = useModel('daotao.lophanhchinh');

	return (
		<>
			<Descriptions
				column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
				title={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop' })}
			>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.tenlop' })}>
					{record?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.khoasv' })}>
					{recordDetail?.khoaSinhVien?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.nganhdaotao' })}>
					{recordDetail?.nganh?.ten ?? '--'}
				</Descriptions.Item>
				{/* <Descriptions.Item label='Sĩ số'>
					{record?.siSo ?? record?.sinhVienList?.length ?? 0} sinh viên
				</Descriptions.Item> */}
				{recordDetail?.lopHcSvKy ? (
					<>
						<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.vaitro' })}>
							{recordDetail?.lopHcSvKy.vaiTro ? vaiTroSvLhc[recordDetail.lopHcSvKy.vaiTro] : '--'}
						</Descriptions.Item>
					</>
				) : null}
			</Descriptions>

			{/* <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, marginTop: 18 }}>Danh sách sinh viên</h4> */}
			<DanhSachSinhVien
				sinhVienList={
					recordDetail?.lopHcSvKyList?.map((i) => ({ ...i, ...i.sinhVien })) ?? recordDetail?.sinhVienList ?? []
				}
				loading={loading}
			/>
		</>
	);
};

export default ThongTinChungLopHanhChinh;
