import PageCard from '@/components/PageCard';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { EVaiTroSvLhc } from '@/services/DaoTao/SinhVien/constants';
import {
	colorTrangThaiSvDkHpNhuCau,
	ETinhChatHocPhanNhuCau,
	ETrangThaiSvDkHpNhuCau,
	mapNameTrangThaiSvDkHpNhuCau,
} from '@/services/HocTap/HocPhanNhuCau/constant';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { IconHumberger, Icon3SquarePlusmark, IconRotateArrow } from '@/components/Icons';
import { Alert, Checkbox, Empty, Space, Table } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotDangKyHocPhanNhuCau from './DotDangKy/Select';
import DanhSachDangKyLop from './components/DanhSachDangKy';
import FormHocPhanDangKyNhuCau from './components/Form';

const DangKyNhuCauHocPhan = () => {
	const intl = useIntl();
	const { record: recDot, setRecord: setRecDot, danhSach: danhSachDot } = useModel('sinhvien.nhucauhocphan.dotdangky');
	const { getAllModel, danhSach, loading, setVisibleForm } = useModel('sinhvien.nhucauhocphan.sinhvienhocphannhucau');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const {
		recordDetail: recLopHanhChinh,
		sinhVienGetModel: getLopHc,
		sinhVienGetByIdModel,
		setRecordDetail: setLopHc,
	} = useModel('daotao.lophanhchinh');
	const { record: recHocKy } = useModel('daotao.hocky');
	const [visibleLop, setVisibleLop] = useState<boolean>(false);
	const isBanCanSu =
		recLopHanhChinh?.lopHcSvKy?.vaiTro === EVaiTroSvLhc.LOP_TRUONG ||
		recLopHanhChinh?.lopHcSvKy?.vaiTro === EVaiTroSvLhc.LOP_PHO;

	const ngoaiThoiGian =
		!recDot?.thoiGianBatDauDangKy ||
		!recDot?.thoiGianKetThucDangKy ||
		dayjs().isBefore(dayjs(recDot?.thoiGianBatDauDangKy)) ||
		dayjs().isAfter(dayjs(recDot?.thoiGianKetThucDangKy));

	const getData = () =>
		recDot?._id && getAllModel(true, undefined, undefined, undefined, `dot-dang-ky/${recDot?._id}/me`);

	useEffect(() => {
		getData();
	}, [recDot?._id]);

	useEffect(() => {
		// Get thông tin lớp hành chính hiện tại
		if (maKhoaNganh && recHocKy?.ma)
			getLopHc({ maKhoaNganh }, recHocKy?.ma).then((res) => {
				if (res.length) sinhVienGetByIdModel(res[0]._id, recHocKy?.ma);
				else setLopHc(undefined);
			});
	}, [maKhoaNganh, recHocKy?.ma]);

	const columns: IColumn<HocPhanNhuCau.IRecord>[] = useMemo(
		() => [
			{
				title: intl.formatMessage({ id: 'hocphannhucau.table.maHP' }),
				dataIndex: 'maHocPhan',
				width: 100,
				align: 'center',
				filterType: 'string',
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.table.tenHocPhan' }),
				width: 200,
				render: (val, rec) => rec?.hocPhan?.ten,
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.table.soTinChi' }),
				align: 'center',
				dataIndex: 'soTinChi',
				width: 80,
				filterType: 'number',
				sortable: true,
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.table.theoTienTrinh' }),
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
		],
		[intl],
	);

	const ttSv = danhSach?.[0]?.sinhVienDangKyHocPhanNhuCau?.trangThai as ETrangThaiSvDkHpNhuCau | undefined;

	return (
		<PageCard
			title={intl.formatMessage({ id: 'menu.HocTap.NhuCauHocPhan' })}
			extra={
				<FilterHocKy isSetHocKy selectLatest>
					<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
					<SelectDotDangKyHocPhanNhuCau
						isSetRecord
						value={recDot?._id}
						onChange={(val) => setRecDot(danhSachDot.find((item) => item._id === val))}
						style={{ width: 250 }}
					/>
				</FilterHocKy>
			}
		>
			{recDot?._id ? (
				<>
					<Alert
						style={{ marginBottom: 12 }}
						type={ngoaiThoiGian ? 'warning' : 'info'}
						message={
							ngoaiThoiGian
								? intl.formatMessage({ id: 'hocphannhucau.alert.ngoaiThoiGian' })
								: intl.formatMessage(
										{ id: 'hocphannhucau.alert.trongThoiGian' },
										{
											tuNgay: formatDate(recDot?.thoiGianBatDauDangKy),
											denNgay: formatDate(recDot?.thoiGianKetThucDangKy),
											b: (chunks) => <b>{chunks}</b>,
										},
									)
						}
						showIcon
					/>
					{danhSach?.length ? (
						<div style={{ marginBottom: 12 }}>
							<span>
								{intl.formatMessage({ id: 'hocphannhucau.block.trangThaiLabel' })}{' '}
								<b style={{ color: ttSv ? colorTrangThaiSvDkHpNhuCau[ttSv] : undefined }}>
									{ttSv && mapNameTrangThaiSvDkHpNhuCau[ttSv]
										? intl.formatMessage({ id: mapNameTrangThaiSvDkHpNhuCau[ttSv] })
										: ''}
								</b>
							</span>
							<br />
							<span>
								{intl.formatMessage({ id: 'hocphannhucau.block.yKienCvht' })}{' '}
								{danhSach[0]?.sinhVienDangKyHocPhanNhuCau?.ghiChuCVHT ??
									intl.formatMessage({ id: 'hocphannhucau.cvht.chuaCoYKien' })}
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
							summary: (pageData: readonly HocPhanNhuCau.IRecord[]) => {
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
								const hpTheoTienTrinh = hpDungTienTrinh + hpNgoaiTienTrinh;
								return (
									<Table.Summary fixed>
										<Table.Summary.Row>
											<Table.Summary.Cell index={0} colSpan={8}>
												<span>
													{intl.formatMessage(
														{ id: 'hocphannhucau.table.summary' },
														{
															tongSTC,
															hpTheoTienTrinh,
															hpKhac,
															b: (chunks) => <b>{chunks}</b>,
														},
													)}
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
									danhSach[0]?.sinhVienDangKyHocPhanNhuCau?.trangThai === ETrangThaiSvDkHpNhuCau.DA_DUYET ||
									ngoaiThoiGian
								}
								onClick={() => setVisibleForm(true)}
								icon={<Icon3SquarePlusmark />}
								type='primary'
								notHideText
								tooltip={intl.formatMessage({ id: 'hocphannhucau.tooltip.dangKyNhuCau' })}
							>
								{intl.formatMessage({ id: 'hocphannhucau.button.dangKy' })}
							</ButtonExtend>

							{isBanCanSu ? (
								<ButtonExtend onClick={() => setVisibleLop(true)} icon={<IconHumberger />}>
									{intl.formatMessage({ id: 'hocphannhucau.button.dsLop' })}
								</ButtonExtend>
							) : null}

							<ButtonExtend onClick={() => getData()} icon={<IconRotateArrow />}>
								{intl.formatMessage({ id: 'hocphannhucau.button.taiLai' })}
							</ButtonExtend>
						</Space>
					</TableStaticData>

					<FormHocPhanDangKyNhuCau getData={getData} ngoaiThoiGian={ngoaiThoiGian} />

					<DanhSachDangKyLop visible={visibleLop} setVisible={setVisibleLop} />
				</>
			) : (
				<Empty
					description={intl.formatMessage({ id: 'hocphannhucau.empty.khongCoDot' })}
					style={{ margin: '18px 0px' }}
				/>
			)}
		</PageCard>
	);
};

export default DangKyNhuCauHocPhan;
