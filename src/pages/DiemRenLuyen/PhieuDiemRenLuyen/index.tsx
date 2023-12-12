import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DotChamDiem } from '@/services/DiemRenLuyen/DotChamDiem/typing';
import { EVaiTroPhieuDiem } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ModalPhieuDiem from './components/ModalPhieuDiem';
import TrangThaiPhieuDiem from './components/TrangThaiPhieuDiem';

const PhieuDiemRenLuyenSinhVienPage = () => {
	const { page, limit, getModelBySinhVien, setRecord } = useModel('diemrenluyen.dotchamdiem');
	const { sinhVienGetKetQuaModel, setVisiblePhieuDiem } = useModel('diemrenluyen.phieudiemrenluyen');

	const handleView = (rec: DotChamDiem.IRecord) => {
		if (rec?._id) {
			setRecord(rec);

			sinhVienGetKetQuaModel(rec._id).then(() => {
				setVisiblePhieuDiem(true);
			});
		}
	};

	const columns: IColumn<DotChamDiem.IRecord>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			filterType: 'string',
			width: 170,
		},
		{
			title: 'Thời gian bắt đầu',
			render: (_, rec) =>
				rec.thoiGianSVChamDiem?.thoiGianBatDau &&
				moment(rec.thoiGianSVChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY'),
			width: 120,
			align: 'center',
		},
		{
			title: 'Thời gian kết thúc',
			render: (_, rec) =>
				rec.thoiGianSVChamDiem?.thoiGianKetThuc &&
				moment(rec.thoiGianSVChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY'),
			width: 120,
			align: 'center',
		},
		{
			title: 'Xếp loại',
			width: 100,
		},
		{
			title: 'Trạng thái',
			align: 'center',
			width: 150,
			render: (_, rec) => <TrangThaiPhieuDiem ketQua={rec.ketQua} />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, rec) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button onClick={() => handleView(rec)} type='link' icon={<EditOutlined />} />
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				getData={getModelBySinhVien}
				columns={columns}
				dependencies={[page, limit]}
				modelName='diemrenluyen.dotchamdiem'
				title='Phiếu điểm rèn luyện'
        buttons={{create:false}}
			/>
			<ModalPhieuDiem role={EVaiTroPhieuDiem.SINH_VIEN} onOk={getModelBySinhVien} />
		</>
	);
};

export default PhieuDiemRenLuyenSinhVienPage;
