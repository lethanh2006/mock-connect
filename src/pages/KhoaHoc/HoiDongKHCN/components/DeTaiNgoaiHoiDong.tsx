import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

import { ELoaiDeTaiCaNhan } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { currencyFormat } from '@/utils/utils';
import moment from 'moment';
import { useModel } from 'umi';

const DeTaiNgoaiHoiDong = () => {
	const { danhSach, setVisibleViewDetail, setRecord, setSelectedIds, selectedIds } = useModel('khoahoc.detaikhcn');
	const { record: recHoiDong } = useModel('khoahoc.hoidongkhcn');

	const onCell = (recordDeTai: DeTaiKHCN.IRecord) => ({
		onClick: () => {
			setVisibleViewDetail(true);
			setRecord(recordDeTai);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Tên đề tài',
			dataIndex: ['dangKyKhcn', 'ten'],
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Đề tài tập thể/cá nhân',
			dataIndex: ['dangKyKhcn', 'loaiCaNhan'],
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDeTaiCaNhan).map((item) => ({ value: item, label: item })),
			onCell,
		},

		{
			title: 'Sinh viên chịu trách nhiệm thực hiện chính',
			dataIndex: ['dangKyKhcn', 'chuTriDeTai', 'ten'] as any,
			width: 150,
			filterType: 'string',
			align: 'center',
			onCell,
		},
		{
			title: 'Đơn vị',
			dataIndex: ['dangKyKhcn', 'chuTriDeTai', 'tenDonVi'] as any,
			width: 150,
			filterType: 'string',
			align: 'center',
			onCell,
		},
		{
			title: 'Thời gian thực hiện',
			width: 150,
			align: 'center',
			render: (val: DeTaiKHCN.IRecord) => (
				<div>
					{moment(val.dangKyKhcn.thoiGianThucHienBatDau).format('MM/YYYY')} -{' '}
					{moment(val.dangKyKhcn.thoiGianThucHienKetThuc).format('MM/YYYY')}
				</div>
			),
			onCell,
		},
		{
			title: 'Kinh phí đề xuất',
			width: 120,
			align: 'center',
			dataIndex: ['dangKyKhcn', 'kinhPhi', 'kinhPhi'] as any,
			sortable: true,
			render: (val, rec) => {
				return (
					<div>
						{currencyFormat(rec?.dangKyKhcn?.kinhPhi?.kinhPhi)} {rec?.dangKyKhcn?.kinhPhi?.menhGia}
					</div>
				);
			},
		},
	];

	return (
		<>
			<TableStaticData
				hasTotal
				setSelectedIds={setSelectedIds}
				selectedIds={selectedIds}
				rowSelection
				addStt
				data={danhSach.filter((item) => !recHoiDong?.danhSachDeTai?.map((ele) => ele._id).includes(item._id))}
				columns={columns}
			/>
		</>
	);
};

export default DeTaiNgoaiHoiDong;
