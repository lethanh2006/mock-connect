import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import StepDotChamDiemRenLuyen from '@/pages/DiemRenLuyenV2/Dot/Step';
import FormNhapPhieuDiemBCS from '@/pages/DiemRenLuyenV2/PhieuDiemRenLuyen/PhieuDiemBCS/components/Form';
import {
	ETrangThaiPhieuDiemRL,
	MapColorETrangThaiPhieuDiemRL,
	MapTitleETrangThaiPhieuDiemRL,
} from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import dayjs from '@/utils/dayjs';
import { IconPencil01, IconEyeOpen } from '@/components/Icons';
import { Button, Tag, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const PhieuDiemBCS = (props: { idLopHanhChinh: string }) => {
	const { idLopHanhChinh } = props;
	const { getModel, page, limit, condition, handleView } = useModel('diemrenluyenv2.phieudiemrenluyenbcs');
	const { record: recordDot, getAllModel: getAllDotDiemRenLuyen } = useModel('diemrenluyenv2.dot');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { getByIdModel } = useModel('diemrenluyenv2.bieumau');
	const intl = useIntl();
	const getData = () => {
		if (idLopHanhChinh && recordDot?._id && recordDot?.kyHoc === recHocKy?.ma)
			getModel({
				lopHanhChinh: idLopHanhChinh,
				dotChamDiemId: recordDot?._id,
			});
	};
	const onCell = (rec: PhieuDiemRenLuyenV2.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const isTrongThoiGianChamDiem =
		recordDot?._id &&
		dayjs().isAfter(dayjs(recordDot?.thoiGianBCSChamDiem?.thoiGianBatDau)) &&
		dayjs().isBefore(dayjs(recordDot?.thoiGianBCSChamDiem?.thoiGianKetThuc));

	const columns: IColumn<PhieuDiemRenLuyenV2.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.masv' }),
			dataIndex: 'maSinhVien',
			width: 120,
			sortable: true,
			filterType: 'string',
			align: 'center',
			onCell,
			render: (val) => (val ? val?.toUpperCase() : ''),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.hoten' }),
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.sinhvien' }),
			dataIndex: 'trangThaiNopSV',
			width: 160,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiPhieuDiemRL)?.map((item) => ({
				value: item,
				label: MapTitleETrangThaiPhieuDiemRL?.[item],
			})),
			onCell,
			render: (val: ETrangThaiPhieuDiemRL) =>
				val ? <Tag color={MapColorETrangThaiPhieuDiemRL?.[val]}>{MapTitleETrangThaiPhieuDiemRL?.[val]}</Tag> : '',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.bancansu' }),
			dataIndex: 'trangThaiNopBCS',
			width: 160,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiPhieuDiemRL)?.map((item) => ({
				value: item,
				label: MapTitleETrangThaiPhieuDiemRL?.[item],
			})),
			onCell,
			render: (val) =>
				val ? (
					<Tag color={MapColorETrangThaiPhieuDiemRL?.[val as ETrangThaiPhieuDiemRL]}>
						{MapTitleETrangThaiPhieuDiemRL?.[val]}
					</Tag>
				) : (
					''
				),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.covanhoctap' }),
			dataIndex: 'trangThaiNopCoVan',
			width: 160,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiPhieuDiemRL)?.map((item) => ({
				value: item,
				label: MapTitleETrangThaiPhieuDiemRL?.[item],
			})),
			onCell,
			render: (val) =>
				val ? (
					<Tag color={MapColorETrangThaiPhieuDiemRL?.[val as ETrangThaiPhieuDiemRL]}>
						{MapTitleETrangThaiPhieuDiemRL?.[val]}
					</Tag>
				) : (
					''
				),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.thaotac' }),
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (record: PhieuDiemRenLuyenV2.IRecord) => (
				<>
					<Tooltip title={isTrongThoiGianChamDiem ? intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.tooltip.chamdiem' }) : intl.formatMessage({ id: 'diemrenluyen.phieudiem.bcs.tooltip.xemchitiet' })}>
						<Button
							onClick={() => handleView(record)}
							type='link'
							icon={isTrongThoiGianChamDiem ? <IconPencil01 /> : <IconEyeOpen />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	useEffect(() => {
		if (recordDot?.idBieuMau) getByIdModel(recordDot?.idBieuMau ?? '', true);
	}, [recordDot]);

	useEffect(() => {
		if (recHocKy?.ma) getAllDotDiemRenLuyen(true, undefined, { kyHoc: recHocKy?.ma });
	}, [recHocKy?.ma]);

	return (
		<>
			<StepDotChamDiemRenLuyen />
			<TableBase
				hideCard
				// title={'Danh sách khai báo'}
				Form={FormNhapPhieuDiemBCS as any}
				modelName={'diemrenluyenv2.phieudiemrenluyenbcs'}
				columns={columns}
				getData={getData}
				dependencies={[page, limit, condition, idLopHanhChinh, recordDot]}
				widthDrawer={900}
				destroyModal
				formProps={{ getData: getData }}
				buttons={{ create: false, filter: false }}
				// otherButtons={[
				// 	<>
				// 		<SelectDotDiemRenLuyen
				// 			style={{ width: 300 }}
				// 			value={recodDot?._id}
				// 			onChange={(val, option) => {
				// 				const rawData = option?.rawData;
				// 				setRecortdDot(rawData);
				// 			}}
				// 			isSetRecord={true}
				// 		/>
				// 	</>,
				// ]}
			/>
		</>
	);
};
export default PhieuDiemBCS;
