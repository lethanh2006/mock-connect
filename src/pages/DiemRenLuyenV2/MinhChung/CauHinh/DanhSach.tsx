import { EOperatorType } from '@/components/Table/constant';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { MinhChungDrl } from '@/services/DiemRenLuyenV2/MinhChung/typing';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DanhSachMinhChung = () => {
	const { getAllModel, danhSach, record, setRecord } = useModel('diemrenluyenv2.minhchung.cauhinh');

	useEffect(() => {
		getAllModel(true, undefined, { dungChoSuKien: false }, [
			{ field: 'doiTuongNhap', operator: EOperatorType.CONTAIN, values: ['SINH_VIEN'] },
		]);

		return () => {};
	}, []);

	const onCell = (recordVal: MinhChungDrl.IBieuMau) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight: recordVal.maMinhChung === record?.maMinhChung ? 600 : undefined,
			color: recordVal.maMinhChung === record?.maMinhChung ? 'var(--color-primary)' : undefined,
			backgroundColor: recordVal.maMinhChung === record?.maMinhChung ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const columns: IColumn<MinhChungDrl.IBieuMau>[] = [
		{
			title: 'Loại minh chứng',
			dataIndex: 'tenMinhChung',
			width: 200,
			onCell,
		},
	];

	return (
		<div style={{ paddingTop: 3 }}>
			<TableStaticData
				columns={columns}
				data={danhSach?.filter((item) => {
					return item?.doiTuongNhap?.includes('SINH_VIEN');
				})}
				otherProps={{ scrol: { x: 350 }, pagination: false }}
			/>
		</div>
	);
};

export default DanhSachMinhChung;
