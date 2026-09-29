import { EOperatorType } from '@/components/Table/constant';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { EDoiTuongNhap } from '@/services/DiemRenLuyenV2/MinhChung/MauDon/constants';
import type { MinhChungDrl } from '@/services/DiemRenLuyenV2/MinhChung/typing';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DanhSachMinhChung = () => {
	const { getAllModel, danhSach, record, setRecord } = useModel('diemrenluyenv2.minhchung.cauhinh');
  const intl = useIntl();

	useEffect(() => {
		getAllModel(true, undefined, { dungChoSuKien: false }, [
			{ field: 'doiTuongNhap', operator: EOperatorType.CONTAIN, values: [EDoiTuongNhap.SINH_VIEN] },
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
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.loaiminhchung' }),
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
					return item?.doiTuongNhap?.includes(EDoiTuongNhap.SINH_VIEN);
				})}
				otherProps={{ scroll: { x: 350 }, pagination: false }}
			/>
		</div>
	);
};

export default DanhSachMinhChung;
