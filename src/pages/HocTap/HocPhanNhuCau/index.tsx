import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import {
	colorTrangThaiSinhVienDangKyHocPhanNhuCau,
	ETinhChatHocPhanNhuCau,
	ETrangThaiSinhVienDangKyHocPhanNhuCau,
	mapNameTrangThaiSinhVienDangKyHocPhanNhuCau,
} from '@/services/HocTap/HocPhanNhuCau/constant';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import { PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Card, Checkbox, Empty, Space, Table } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectDotDangKyHocPhanNhuCau from './DotDangKy/Select';
import FormHocPhanDangKyNhuCau from './components/Form';

const DangKyNhuCauHocPhan = () => {
	const { record: recDot, setRecord: setRecDot, danhSach: danhSachDot } = useModel('sinhvien.nhucauhocphan.dotdangky');
	const { getAllModel, danhSach, loading, setVisibleForm } = useModel('sinhvien.nhucauhocphan.sinhvienhocphannhucau');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	const ngoaiThoiGian =
		!recDot?.thoiGianBatDauDangKy ||
		!recDot?.thoiGianKetThucDangKy ||
		moment().isBefore(recDot?.thoiGianBatDauDangKy) ||
		moment().isAfter(recDot?.thoiGianKetThucDangKy);

	const getData = () =>
		recDot?._id && getAllModel(undefined, undefined, undefined, undefined, `dot-dang-ky/${recDot?._id}/me`);

	useEffect(() => {
		getData();
	}, [recDot?._id]);

	const columns: IColumn<HocPhanNhuCau.IRecord>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 100,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tên học phần',
			width: 200,
			render: (val, rec) => rec?.hocPhan?.ten,
		},
		{
			title: 'Số tín chỉ',
			align: 'center',
			dataIndex: 'soTinChi',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Theo tiến trình',
			align: 'center',
			width: 80,
			render: (val, rec) => (
				<Checkbox
					checked={
						rec?.tinhChatHocPhan === ETinhChatHocPhanNhuCau.DUNG_TIEN_TRINH ||
						rec?.tinhChatHocPhan === ETinhChatHocPhanNhuCau.NGOAI_TIEN_TRINH
					}
				/>
			),
		},
	];

	return (
		<Card title='Đăng ký nhu cầu học phần'>
			<Space wrap style={{ marginBottom: 12 }}>
				<FilterHocKy isSetHocKy>
					<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
					<SelectDotDangKyHocPhanNhuCau
						isSetRecord
						value={recDot?._id}
						onChange={(val) => setRecDot(danhSachDot.find((item) => item._id === val))}
						style={{ width: 250 }}
					/>
				</FilterHocKy>
			</Space>

			{recDot?._id ? (
				<>
					<Alert
						style={{ marginBottom: 12 }}
						type={ngoaiThoiGian ? 'warning' : 'info'}
						message={
							ngoaiThoiGian ? (
								'Ngoài thời gian đăng ký nhu cầu !'
							) : (
								<>
									Thời gian đăng ký nhu cầu học phần từ{' '}
									<b>{moment(recDot?.thoiGianBatDauDangKy).format('DD/MM/YYYY')}</b> đến{' '}
									<b>{moment(recDot?.thoiGianKetThucDangKy).format('DD/MM/YYYY')}</b>
								</>
							)
						}
						showIcon
					/>
					{danhSach?.length ? (
						<div style={{ marginBottom: 12 }}>
							<span>
								Trạng thái đăng ký nhu cầu học phần:{' '}
								<b
									style={{
										color:
											colorTrangThaiSinhVienDangKyHocPhanNhuCau[danhSach[0]?.sinhVienDangKyHocPhanNhuCau?.trangThai],
									}}
								>
									{mapNameTrangThaiSinhVienDangKyHocPhanNhuCau[danhSach[0]?.sinhVienDangKyHocPhanNhuCau?.trangThai]}
								</b>
							</span>
							<br />
							<span>
								Ý kiến cố vấn học tập: {danhSach[0]?.sinhVienDangKyHocPhanNhuCau?.ghiChuCVHT ?? 'Chưa có ý kiến'}
							</span>
						</div>
					) : null}
					<TableStaticData
						columns={columns}
						data={danhSach}
						loading={loading}
						addStt
						hasTotal
						otherProps={{
							scroll: { y: 500 },
							pagination: false,
							summary: (pageData: HocPhanNhuCau.IRecord[]) => {
								const tongSTC = _.sumBy(pageData, (item) => item?.soTinChi);
								const hpDungTienTrinh = _.sumBy(
									pageData?.filter((item) => item?.tinhChatHocPhan === ETinhChatHocPhanNhuCau.DUNG_TIEN_TRINH),
									(item) => item?.soTinChi,
								);
								const hpNgoaiTienTrinh = _.sumBy(
									pageData?.filter((item) => item?.tinhChatHocPhan === ETinhChatHocPhanNhuCau.NGOAI_TIEN_TRINH),
									(item) => item?.soTinChi,
								);
								const hpKhac = _.sumBy(
									pageData?.filter((item) => item?.tinhChatHocPhan === ETinhChatHocPhanNhuCau.HOC_PHAN_KHAC),
									(item) => item?.soTinChi,
								);
								return (
									<Table.Summary fixed>
										<Table.Summary.Row>
											<Table.Summary.Cell index={0} colSpan={8}>
												<span>
													Tổng số tín chỉ: <b>{tongSTC}</b> tín chỉ, trong đó{' '}
													<b>{hpDungTienTrinh + hpNgoaiTienTrinh}</b> tín chỉ HP theo tiến trình và <b>{hpKhac}</b> tín
													chỉ HP khác
												</span>
											</Table.Summary.Cell>
										</Table.Summary.Row>
									</Table.Summary>
								);
							},
						}}
					>
						<Space>
							<ButtonExtend
								disabled={
									danhSach[0]?.sinhVienDangKyHocPhanNhuCau?.trangThai ===
										ETrangThaiSinhVienDangKyHocPhanNhuCau.DA_DUYET || ngoaiThoiGian
								}
								onClick={() => {
									setVisibleForm(true);
								}}
								icon={<PlusCircleOutlined />}
								type='primary'
								notHideText
								tooltip='Đăng ký học phần'
							>
								Đăng ký
							</ButtonExtend>
							<ButtonExtend
								onClick={() => {
									getData();
								}}
								icon={<ReloadOutlined />}
								notHideText
								tooltip='Tải lại'
							>
								Tải lại
							</ButtonExtend>
						</Space>
					</TableStaticData>
					<FormHocPhanDangKyNhuCau getData={getData} ngoaiThoiGian={ngoaiThoiGian} />
				</>
			) : (
				<Empty description='Không có đợt đăng ký nhu cầu học phần' style={{ margin: '18px 0px' }} />
			)}
		</Card>
	);
};

export default DangKyNhuCauHocPhan;
