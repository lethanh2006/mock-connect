import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import FormKhaiBao from '@/pages/DiemRenLuyenV2/MinhChung/KhaiBao/components/FormKhaiBao';
import {
	ETrangThaiTiepNhanMinhChung,
	MapColorETrangThaiTiepNhanMinhChung,
} from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/constants';
import { useModel } from '@@/plugin-model/useModel';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	MenuOutlined,
	UndoOutlined,
} from '@ant-design/icons';
import { Button, Divider, Popconfirm, Popover, Spin, Tag } from 'antd';
import { useEffect } from 'react';

import type { KhaiBaoDRL } from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/typing';
import { EDoiTuongNhap } from '@/services/DiemRenLuyenV2/MinhChung/MauDon/constants';

const KhaiBaoMinhChungCVHT = (props: { idLopHanhChinh?: string; getDataMinhChung?: () => void }) => {
	const { getModel, page, limit, condition, handleEdit, deleteModel, handleView, putModel } = useModel(
		'diemrenluyenv2.minhchung.khaibaobcs',
	);

	const { record: recordCauHinh } = useModel('diemrenluyenv2.minhchung.cauhinh');
	const { getAllModel } = useModel('quytrinh.danhmuc');
	const { getAllModel: getAllMinhChung, record: recLoaiMinhChung } = useModel('diemrenluyenv2.minhchung.cauhinh');

	const { record: recordDot, loading: loadingDot, getAllModel: getAllDotDiemRenLuyen } = useModel('diemrenluyenv2.dot');

	const { record: recordLopHanhChinh } = useModel('daotao.lophanhchinh');
	const { record: recHocKy } = useModel('daotao.hocky');

	const getAllMinhChungModel = () => {
		getAllMinhChung(false, undefined, {
			dungChoSuKien: false,
			dotChamDiemId: recordDot?._id,
			lopHanhChinh: recordLopHanhChinh?.ten,
		});
	};

	const getData = () => {
		if (recordCauHinh?._id && recordDot?._id && recordLopHanhChinh?.ten && recHocKy?.ma === recordDot?.kyHoc) {
			getModel({
				cauHinhMinhChungId: recordCauHinh?._id,
				dotChamDiemId: recordDot?._id,
				lopHanhChinh: recordLopHanhChinh?.ten,
			});
			if (props?.getDataMinhChung) props?.getDataMinhChung();
		}
	};

	const handleChangeTrangThai = async (id: string, trangThai: ETrangThaiTiepNhanMinhChung) => {
		try {
			putModel(id, { trangThai: trangThai }, () => {
				getData();
				getAllMinhChungModel();
			});
		} catch (e) {
			console.log(e);
		}
	};

	const onCell = (rec: KhaiBaoDRL.IRecord) => ({
		onClick: () => {
			handleView(rec);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<KhaiBaoDRL.IRecord>[] = [
		{
			title: 'Họ và tên',
			dataIndex: 'hoTen',
			filterType: 'string',
			onCell,
			width: 150,
			align: 'center',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSinhVien',
			align: 'center',
			filterType: 'string',
			onCell,
			width: 150,
		},

		{
			title: 'Người khai báo',
			dataIndex: 'nguoiKhaiBao',
			align: 'center',
			onCell,
			width: 150,
			render: (val) => val?.ten ?? '',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			onCell,
			width: 120,
			render: (val) => (
				<Tag color={MapColorETrangThaiTiepNhanMinhChung?.[val as ETrangThaiTiepNhanMinhChung]}>{val}</Tag>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			// hide: dataPhanQuyen?.isKhoa,
			render: (val, rec) => (
				<Popover
					placement='right'
					content={
						<>
							<Popconfirm
								title={'Bạn có chắc chắn muốn duyệt minh chứng này'}
								placement={'topLeft'}
								disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
								onConfirm={() => {
									handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.DUYET);
								}}
							>
								<ButtonExtend
									disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
									tooltip='Duyệt'
									type='link'
									icon={<CheckOutlined />}
								/>
							</Popconfirm>
							<Divider type={'vertical'} />
							<Popconfirm
								title={'Bạn có chắc chắn muốn từ chối minh chứng này'}
								placement={'topLeft'}
								disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
								onConfirm={() => {
									handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.KHONG_DUYET);
								}}
							>
								<ButtonExtend
									disabled={rec?.trangThai !== ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
									tooltip='Từ chối'
									type='link'
									danger
									icon={<CloseOutlined />}
								/>
							</Popconfirm>
							<Divider type={'vertical'} />
							<Popconfirm
								title={'Bạn có chắc chắn chuyển về trạng thái chờ xử lý'}
								placement={'topLeft'}
								disabled={rec?.trangThai === ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
								onConfirm={() => {
									handleChangeTrangThai(rec?._id ?? '', ETrangThaiTiepNhanMinhChung.CHO_XU_LY);
								}}
							>
								<ButtonExtend
									disabled={rec?.trangThai === ETrangThaiTiepNhanMinhChung.CHO_XU_LY}
									tooltip='Chuyển vể chờ xử lý'
									type='link'
									icon={<UndoOutlined />}
								/>
							</Popconfirm>
							<Divider type={'vertical'} />
							<ButtonExtend
								disabled={
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.DUYET ||
									rec?.trangThai === ETrangThaiTiepNhanMinhChung.XAC_NHAN
								}
								tooltip='Chỉnh sửa'
								type='link'
								icon={<EditOutlined />}
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
								title={'Bạn có chắc chắn muốn xoá minh chứng này'}
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
									tooltip='Xoá'
									type='link'
									danger
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						</>
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	useEffect(() => {
		getAllModel();
	}, []);

	useEffect(() => {
		if (recHocKy?.ma) getAllDotDiemRenLuyen(true, undefined, { kyHoc: recHocKy?.ma });
	}, [recHocKy?.ma]);

	return (
		<Spin spinning={loadingDot}>
			<TableBase
				hideCard
				Form={FormKhaiBao as any}
				modelName={'diemrenluyenv2.minhchung.khaibaobcs'}
				columns={columns}
				getData={getData}
				dependencies={[recordCauHinh, page, limit, condition, recordDot, recordLopHanhChinh, recHocKy?.ma]}
				widthDrawer={700}
				destroyModal
				formProps={{
					getData: getData,
					idLopHanhChinh: props?.idLopHanhChinh,
					mode: 'bancansu',
				}}
				buttons={{ create: recLoaiMinhChung?.doiTuongNhap?.includes(EDoiTuongNhap.SINH_VIEN) }}
				// otherButtons={[
				// 	<>
				// 		<SelectDotDiemRenLuyen
				// 			style={{ width: 300 }}
				// 			value={recordDot?._id}
				// 			onChange={(val, option) => {
				// 				const rawData = option?.rawData;
				// 				setRecortdDot(rawData);
				// 			}}
				// 			isSetRecord={true}
				// 		/>
				// 	</>,
				// ]}
			/>
		</Spin>
	);
};
export default KhaiBaoMinhChungCVHT;
