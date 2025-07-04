import type { IColumn } from '@/components/Table/typing';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableStaticData from '@/components/Table/TableStaticData';
import moment from 'moment';

const DanhSachDot = () => {
	const { getAllModel, danhSach, record, setRecord } = useModel('diemrenluyenv2.dot');
	const { getByIdModel } = useModel('diemrenluyenv2.bieumau');

	const getData = async () => {
		try {
			getAllModel().then((res) => {
				const dataDot = res;
				const currentDot = dataDot?.find(
					(item) =>
						moment().isAfter(moment(item?.thoiGianSVChamDiem.thoiGianBatDau)) &&
						moment().isBefore(moment(item?.thoiGianSVChamDiem?.thoiGianKetThuc)),
				);
				if (currentDot) setRecord(currentDot);
				else setRecord(dataDot?.[0]);
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (record?.idBieuMau) getByIdModel(record?.idBieuMau ?? '', true);
	}, [record]);

	const onCell = (recordVal: DotChamDiemRenLuyen.IRecord) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight: recordVal._id === record?._id ? 600 : undefined,
			color: recordVal._id === record?._id ? 'var(--primary-color)' : undefined,
			backgroundColor: recordVal._id === record?._id ? 'var(--primary-1)' : undefined,
		},
	});

	const columns: IColumn<DotChamDiemRenLuyen.IRecord>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'tenDot',
			width: 200,
			onCell,
		},
	];

	return (
		<div style={{ paddingTop: 3 }}>
			<TableStaticData columns={columns} data={danhSach} otherProps={{ scrol: { x: 350 }, pagination: false }} />
		</div>
	);
};

export default DanhSachDot;
