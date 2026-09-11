import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import FormKhaiBao from '@/pages/DiemRenLuyenV2/MinhChung/KhaiBao/components/FormKhaiBao';
import {
	ETrangThaiTiepNhanMinhChung,
	MapColorETrangThaiTiepNhanMinhChung,
} from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/constants';
import type { KhaiBaoDRL } from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/typing';
import dayjs from '@/utils/dayjs';
import { IconTrash, IconPencil01, IconHumberger } from '@/components/Icons';
import { Button, Card, Divider, Popconfirm, Popover, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const KhaiBaoMinhChung = () => {
	const { getModel, page, limit, condition, handleEdit, deleteModel, handleView } = useModel(
		'diemrenluyenv2.minhchung.khaibao',
	);
	const { record: recordCauHinh } = useModel('diemrenluyenv2.minhchung.cauhinh');
	const { record: recordDot } = useModel('diemrenluyenv2.dot');
	const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const { getAllModel } = useModel('quytrinh.danhmuc');
	const intl = useIntl();

	const ngoaiThoiGian = recordDot
		? recordDot?.thoiGianTiepNhanMinhChung &&
			(dayjs().isAfter(dayjs(recordDot.thoiGianTiepNhanMinhChung.thoiGianKetThuc)) ||
				dayjs().isBefore(dayjs(recordDot?.thoiGianTiepNhanMinhChung?.thoiGianBatDau)))
		: true;

	const getData = () => {
		getModel(
			{ cauHinhMinhChungId: recordCauHinh?._id, dotChamDiemId: recordDot?._id },
			undefined,
			undefined,
			undefined,
			undefined,
			'me/page',
		);
	};

	const onCell = (rec: KhaiBaoDRL.IRecord) => ({
		onClick: () => {
			handleView(rec);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<KhaiBaoDRL.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.masv' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			filterType: 'string',
			onCell,
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.hoten' }),
			dataIndex: 'hoTen',
			filterType: 'string',
			onCell,
			width: 170,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.lop' }),
			dataIndex: 'lopHanhChinh',
			filterType: 'string',
			onCell,
			width: 120,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.nguoikhaibao' }),
			dataIndex: 'nguoiKhaiBao',
			onCell,
			width: 150,
			render: (val) => val?.ten ?? '',
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			onCell,
			width: 120,
			render: (val) => (
				<Tag color={MapColorETrangThaiTiepNhanMinhChung?.[val as ETrangThaiTiepNhanMinhChung]}>{val}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='topLeft'
					content={
						<>
							<ButtonExtend
								disabled={
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET ||
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.XAC_NHAN
								}
								tooltip={intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.chinhsua' })}
								type='link'
								icon={<IconPencil01 />}
								onClick={() => {
									handleEdit(rec);
								}}
							/>
							<Divider type={'vertical'} />
							<Popconfirm
								disabled={
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET ||
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.XAC_NHAN
								}
								title={intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.xacnhanxoa' })}
								placement={'topLeft'}
								onConfirm={() => {
									deleteModel(rec?._id, getData);
								}}
							>
								<ButtonExtend
									disabled={
										rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET ||
										rec?.trangThai === ETrangThaiTiepNhanMinhChung.XAC_NHAN
									}
									tooltip={intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.xoa' })}
									type='link'
									danger
									icon={<IconTrash />}
								/>
							</Popconfirm>
						</>
					}
				>
					<Button type='link' icon={<IconHumberger />} />
				</Popover>
			),
		},
	];

	useEffect(() => {
		getThongTinCuaToiModel();
		getAllModel();
	}, []);

	return (
		<Card
			title={intl.formatMessage({ id: 'diemrenluyen.minhchung.title' })}
			bordered={false}
			headStyle={{ padding: 0 }}
			bodyStyle={{ padding: '8px 0 0 0', marginBottom: 12 }}
		>
			<TableBase
				Form={FormKhaiBao as any}
				modelName='diemrenluyenv2.minhchung.khaibao'
				columns={columns}
				getData={getData}
				dependencies={[recordCauHinh?._id, page, limit, condition, recordDot?._id]}
				widthDrawer={800}
				destroyModal
				hideCard
				formProps={{ getData, mode: 'sinhvien' }}
				buttons={{ create: !!recordDot?._id && !ngoaiThoiGian }}
			/>
		</Card>
	);
};
export default KhaiBaoMinhChung;
