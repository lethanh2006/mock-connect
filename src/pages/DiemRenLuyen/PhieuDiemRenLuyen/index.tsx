import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DotChamDiem } from '@/services/CongTacSinhVien/DiemRenLuyen/DotChamDiem/typing';
import { EVaiTroPhieuDiem } from '@/services/CongTacSinhVien/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import dayjs from '@/utils/dayjs';
import { EditOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import ModalPhieuDiem from './components/ModalPhieuDiem';
import TrangThaiPhieuDiem from './components/TrangThaiPhieuDiem';

const PhieuDiemRenLuyenSinhVienPage = () => {
	const { page, limit, getModelBySinhVien, setRecord } = useModel('diemrenluyen.dotchamdiem');
	const { sinhVienGetKetQuaModel, setVisiblePhieuDiem } = useModel('diemrenluyen.phieudiemrenluyen');
  const intl = useIntl();

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
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.tendot' }),
			dataIndex: 'tenDot',
			filterType: 'string',
			width: 170,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.thoigianbatdau' }),
			render: (_, rec) =>
				rec.thoiGianSVChamDiem?.thoiGianBatDau &&
				dayjs(rec.thoiGianSVChamDiem.thoiGianBatDau).format('HH:mm DD/MM/YYYY'),
			width: 120,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.thoigianketthuc' }),
			render: (_, rec) =>
				rec.thoiGianSVChamDiem?.thoiGianKetThuc &&
				dayjs(rec.thoiGianSVChamDiem.thoiGianKetThuc).format('HH:mm DD/MM/YYYY'),
			width: 120,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.xeploai' }),
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.trangthai' }),
			align: 'center',
			width: 150,
			render: (_, rec) => <TrangThaiPhieuDiem ketQua={rec.ketQua} />,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'diemrenluyen.phieudiem.xemchitiet' })}>
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
				title={intl.formatMessage({ id: 'diemrenluyen.phieudiem.title' })}
				buttons={{ create: false }}
			/>
			<ModalPhieuDiem role={EVaiTroPhieuDiem.SINH_VIEN} onOk={getModelBySinhVien} />
		</>
	);
};

export default PhieuDiemRenLuyenSinhVienPage;
