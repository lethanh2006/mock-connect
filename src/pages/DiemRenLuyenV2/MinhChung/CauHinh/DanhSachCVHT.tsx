import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/constants';
import { EDoiTuongNhap } from '@/services/DiemRenLuyenV2/MinhChung/MauDon/constants';
import type { MinhChungDrl } from '@/services/DiemRenLuyenV2/MinhChung/typing';
import React, { useEffect, useImperativeHandle } from 'react';
import { useModel } from 'umi';

const DanhSachMinhChungCVHT = React.forwardRef((props: { idLopHanhChinh?: string }, ref) => {
	const { getAllModel, danhSach, record, setRecord } = useModel('diemrenluyenv2.minhchung.cauhinh');
	const { record: recordDot } = useModel('diemrenluyenv2.dot');
	const { record: recordLopHanhChinh } = useModel('daotao.lophanhchinh');

	const getData = async (isSetRecord: boolean) => {
		try {
			getAllModel(isSetRecord, undefined, {
				dungChoSuKien: false,
				dotChamDiemId: recordDot?._id,
				lopHanhChinh: recordLopHanhChinh?.ten,
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData(!record);
		return () => {};
	}, [recordDot, recordLopHanhChinh]);

	useImperativeHandle(ref, () => ({
		getDataLoaiMinhChung: () => getData(false),
	}));

	const onCell = (recordVal: MinhChungDrl.IBieuMau) => ({
		onClick: () => {
			setRecord(recordVal);
		},
		style: {
			cursor: 'pointer',
			fontWeight: recordVal.maMinhChung === record?.maMinhChung ? 700 : 600,
			color: recordVal.maMinhChung === record?.maMinhChung ? 'var(--primary-color)' : undefined,
			backgroundColor: recordVal.maMinhChung === record?.maMinhChung ? '#f0f0f0' : undefined,
		},
	});

	const columns: IColumn<MinhChungDrl.IBieuMau>[] = [
		{
			title: 'Tên minh chứng',
			dataIndex: 'tenMinhChung',
			width: 200,
			filterType: 'string',
			onCell,
			render: (val, rec) => {
				return (
					<>
						{val} {/*<Space>*/}
						{/*	{rec?.doiTuongNhap?.map((item) => {*/}
						{/*		return (*/}
						{/*			<Tag color={item === 'CAN_BO' ? 'orange' : 'yellow'}>*/}
						{/*				{item === 'CAN_BO' ? 'Cán bộ' : 'Sinh viên'}*/}
						{/*			</Tag>*/}
						{/*		);*/}
						{/*	})}*/}
						{/*</Space>*/}
						{rec?.trangThaiMinhChung && (
							<div>
								({/*<b>{rec?.trangThaiMinhChung?.['Xác nhận']}</b> Xác nhận,*/}
								{/*<b>{rec?.trangThaiMinhChung?.['Duyệt']}</b> Duyệt,*/}
								<b style={{ color: 'red' }}>{rec?.trangThaiMinhChung?.[ETrangThaiTiepNhanMinhChung.CHO_XU_LY]}</b> Chờ
								xử lý
								{/*<b>{rec?.trangThaiMinhChung?.['Không duyệt']}</b> Không duyệt*/})
							</div>
						)}
					</>
				);
			},
		},
	];

	return (
		<div style={{ marginTop: '-8px' }}>
			<TableStaticData
				columns={columns}
				data={danhSach?.filter((item) => item?.doiTuongNhap?.includes(EDoiTuongNhap.SINH_VIEN))}
				otherProps={{ scroll: { x: 350 }, pagination: false }}
			/>
		</div>
	);
});

export default DanhSachMinhChungCVHT;
