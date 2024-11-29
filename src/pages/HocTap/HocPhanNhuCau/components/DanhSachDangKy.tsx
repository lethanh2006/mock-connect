import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { exportSinhVienDangKyNhuCau } from '@/services/HocTap/HocPhanNhuCau';
import { colorTrangThaiSvDkHpNhuCau, ETrangThaiSvDkHpNhuCau } from '@/services/HocTap/HocPhanNhuCau/constant';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';
import { getFilenameHeader } from '@/utils/utils';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Space, Tag } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CardThongKe from './CardThongKe';

const DanhSachDangKyLop = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
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

	const columns: IColumn<HocPhanNhuCau.IPhieuDangKy>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Họ tên',
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
			title: 'Số học phần',
			align: 'center',
			width: 200,
			children: [
				{
					title: 'Đúng tiến trình',
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
					title: 'Ngoài tiến trình',
					dataIndex: 'soTinChiNgoaiCtdt',
					align: 'center',
					width: 100,
				},
			],
		},
		{
			title: 'Tổng STC',
			width: 80,
			align: 'center',
			render: (val, rec) => _.sumBy(rec?.danhSachHocPhanDangKy, 'soTinChi'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={colorTrangThaiSvDkHpNhuCau[val as ETrangThaiSvDkHpNhuCau]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiSvDkHpNhuCau).map((item) => ({ value: item, label: item })),
		},
		{
			title: 'Thời gian đăng ký',
			dataIndex: 'thoiGianDangKy',
			width: 140,
			align: 'center',
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Ghi chú CVHT',
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
	];

	return (
		<Modal
			title='Danh sách phiếu đăng ký nhu cầu học phần'
			visible={visible}
			onCancel={() => setvisible(false)}
			footer={null}
			width={1000}
		>
			<Descriptions column={1}>
				<Descriptions.Item label='Học kỳ'>{recHocKy?.ten}</Descriptions.Item>
				<Descriptions.Item label='Đợt đăng ký'>{recDot?.tenDot}</Descriptions.Item>
				<Descriptions.Item label='Tên lớp hành chính'>{recLHC?.ten}</Descriptions.Item>
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
						Xuất DS phiếu đăng ký
					</ButtonExtend>
					<ButtonExtend onClick={() => getData()} icon={<ReloadOutlined />} notHideText>
						Tải lại
					</ButtonExtend>
				</Space>
			</TableStaticData>

			{/* <ChiTietSinhVienDangKy /> */}

			<div className='form-footer'>
				<Button onClick={() => setvisible(false)}>Đóng</Button>
			</div>
		</Modal>
	);
};

export default DanhSachDangKyLop;
