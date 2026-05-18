import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { exportSinhVienDangKyNhuCau } from '@/services/HocTap/HocPhanNhuCau';
import {
	colorTrangThaiSvDkHpNhuCau,
	ETrangThaiSvDkHpNhuCau,
	mapNameTrangThaiSvDkHpNhuCau,
} from '@/services/HocTap/HocPhanNhuCau/constant';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import { formatDateTime } from '@/utils/formatDate';
import { getFilenameHeader } from '@/utils/utils';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Tag } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import CardThongKe from './CardThongKe';

const DanhSachDangKyLop = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible: setvisible } = props;
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recDot } = useModel('sinhvien.nhucauhocphan.dotdangky');
	const { getAllModel, danhSach, loading } = useModel('sinhvien.nhucauhocphan.phieudangky');
	const { recordDetail: recLHC } = useModel('daotao.lophanhchinh');
	const [loadingExport, setLoadingExport] = useState<boolean>(false);

	const getData = () => {
		if (recDot?._id && recLHC?.ten) {
			getAllModel(undefined, undefined, { dotDangKyHocPhanNhuCauId: recDot?._id, tenLopHanhChinh: recLHC?.ten });
		}
	};

	useEffect(() => {
		if (visible) getData();
	}, [visible]);

	const hanldeExport = () => {
		setLoadingExport(true);
		exportSinhVienDangKyNhuCau(recDot?._id ?? '', {
			condition: { tenLopHanhChinh: recLHC?.ten },
		})
			.then((res) => {
				fileDownload(res.data, getFilenameHeader(res));
			})
			.catch((er) => console.log(er))
			.finally(() => setLoadingExport(false));
	};

	const columns: IColumn<HocPhanNhuCau.IPhieuDangKy>[] = useMemo(
		() => [
			{
				title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.maSV' }),
				dataIndex: 'maSinhVien',
				width: 120,
				align: 'center',
				filterType: 'string',
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.hoTen' }),
				width: 170,
				dataIndex: 'hoTen',
				filterType: 'string',
			},
		// {
		// 	title: 'Lớp hành chính',
		// 	dataIndex: 'tenLopHanhChinh',
		// 	align: 'center',
		// 	width: 130,
		// },
			{
				title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.soHocPhan' }),
				align: 'center',
				width: 200,
				children: [
					{
						title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.dungTienTrinh' }),
						dataIndex: 'soTinChiTrongTienTrinh',
						align: 'center',
						width: 100,
					},
				// {
				// 	title: 'Trong CTĐT',
				// 	dataIndex: 'soTinChiTrongCtdt',
				// 	align: 'center',
				// 	width: 80,
				// },
					{
						title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.ngoaiTienTrinh' }),
						dataIndex: 'soTinChiNgoaiCtdt',
						align: 'center',
						width: 100,
					},
				],
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.tongStc' }),
				width: 80,
				align: 'center',
				render: (val, rec) => _.sumBy(rec?.danhSachHocPhanDangKy, 'soTinChi'),
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.block.trangThaiLabel' }),
				dataIndex: 'trangThai',
				width: 120,
				align: 'center',
				render: (val) => (
					<Tag color={colorTrangThaiSvDkHpNhuCau[val as ETrangThaiSvDkHpNhuCau]}>
						{mapNameTrangThaiSvDkHpNhuCau[val as ETrangThaiSvDkHpNhuCau]
							? intl.formatMessage({ id: mapNameTrangThaiSvDkHpNhuCau[val as ETrangThaiSvDkHpNhuCau] })
							: val}
					</Tag>
				),
				filterType: 'select',
				filterData: Object.values(ETrangThaiSvDkHpNhuCau).map((item) => ({
					value: item,
					label: mapNameTrangThaiSvDkHpNhuCau[item]
						? intl.formatMessage({ id: mapNameTrangThaiSvDkHpNhuCau[item] })
						: item,
				})),
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.thoiGianDangKy' }),
				dataIndex: 'thoiGianDangKy',
				width: 140,
				align: 'center',
				render: (val, rec) => val && formatDateTime(val),
			},
			{
				title: intl.formatMessage({ id: 'hocphannhucau.dsdk.table.ghiChuCvht' }),
				dataIndex: 'ghiChuCVHT',
				width: 200,
				render: (val, rec) => <ExpandText>{val}</ExpandText>,
			},
		// {
		// 	title: 'Khóa ngành',
		// 	dataIndex: 'maKhoaNganh',
		// 	width: 180,
		// 	render: (val, rec) => rec?.khoaNganh?.ten ?? val,
		// },
		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 90,
		// 	fixed: 'right',
		// 	render: (val, rec) => (
		// 		<>
		// 			<ButtonExtend tooltip='Chi tiết' type='link' icon={<EyeOutlined />} onClick={() => handleView(rec)} />
		// 		</>
		// 	),
		// },
		],
		[intl],
	);

	return (
		<Modal
			title={intl.formatMessage({ id: 'hocphannhucau.dsdk.modal.title' })}
			open={visible}
			onCancel={() => setvisible(false)}
			footer={null}
			width={1000}
		>
			<Descriptions column={1}>
				<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.vuottin.form.descriptions.hocky' })}>
					{recHocKy?.ten}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'hocphannhucau.dsdk.desc.dotDangKy' })}>
					{recDot?.tenDot}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'hocphannhucau.dsdk.desc.tenLopHanhChinh' })}>
					{recLHC?.ten}
				</Descriptions.Item>
			</Descriptions>

			<div style={{ marginBottom: 12 }}>
				<CardThongKe />
			</div>

			<TableStaticData columns={columns} data={danhSach} loading={loading} addStt hasTotal>
				<Space wrap>
					<ButtonExtend
						loading={loadingExport}
						icon={<ExportOutlined />}
						onClick={() => hanldeExport()}
						disabled={!recLHC?._id}
					>
						{intl.formatMessage({ id: 'hocphannhucau.dsdk.button.xuatDs' })}
					</ButtonExtend>
					<ButtonExtend onClick={() => getData()} icon={<ReloadOutlined />} notHideText>
						{intl.formatMessage({ id: 'hocphannhucau.button.taiLai' })}
					</ButtonExtend>
				</Space>
			</TableStaticData>

			{/* <ChiTietSinhVienDangKy /> */}

			<div className='form-footer'>
				<Button onClick={() => setvisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default DanhSachDangKyLop;
