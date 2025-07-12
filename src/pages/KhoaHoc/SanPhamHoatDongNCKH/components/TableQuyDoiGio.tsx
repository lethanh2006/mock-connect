import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import {
	ETrangThaiSanPham,
	MapKeyColorTrangThaiSanPham,
	MapKeyTextTrangThaiSanPham,
} from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import {
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusCircleOutlined,
	RollbackOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Select, Space, Tag, Tooltip, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import FormKetQuaTinhGioThanhVien from './FormKetQuaTinhGioThanhVien';

const TableQuyDoiGio = (props: {
	getData: any;
	role: 'admin' | 'cbgv';
	mode: 'GIO' | 'DIEM';
	fieldNameKetQua: 'danhSachKetQuaQuyDoiGio' | 'danhSachKetQuaQuyDoiDiem';
	fieldNameYeuCau: 'danhSachYeuCauQuyDoiGio' | 'danhSachYeuCauQuyDoiDiem';
}) => {
	const {
		quyDoiGio,
		record: recordSanPham,
		setQuyDoiGio,
		quyDoiDiem,
		setQuyDoiDiem,
		getQuyDoiGioTheoCongThucModel,
		formSubmiting,
		setEditKetQuaTinhGioThanhVien,
		setRecordKetQuaTinhGioThanhVien,
		setVisibleForm,
		setCurrent,
		getByIdModel,
	} = useModel('khoahoc.sanphamnckh');
	const { record: recordLoaiHinh } = useModel('khoahoc.loaihinhnckh');
	const { createYeuCauQuyDoiGioModel, loading } = useModel('khoahoc.yeucauquydoigio');
	const { danhSach } = useModel('khoahoc.danhmuc.namhoc');
	const [visibleKetQuaTinhGioThanhVien, setVisibleKetQuaTinhGioThanhVien] = useState<boolean>(false);
	const [recordNamHoc, setRecordNamHoc] = useState<NamHoc.IRecord | undefined>(danhSach?.[0]);
	const isGio = props.fieldNameKetQua === 'danhSachKetQuaQuyDoiGio';

	const quyDoi = isGio ? quyDoiGio : quyDoiDiem;

	useEffect(() => {
		const buildQuyDoiGio: any = {};
		recordSanPham?.[props.fieldNameYeuCau]?.map((item) => {
			buildQuyDoiGio[item.namHocId] = item.danhSachKetQuaTinhGioThanhVien;
		});
		if (isGio) setQuyDoiGio(buildQuyDoiGio);
		else setQuyDoiDiem(buildQuyDoiGio);
	}, [recordSanPham?._id, props.fieldNameYeuCau]);

	useEffect(() => {
		if (!recordNamHoc?._id) return;
		const quyDoiFinal = isGio ? quyDoiGio : quyDoiDiem;
		const recYeuCauQuyDoiGio =
			quyDoiFinal?.[recordNamHoc._id] ||
			recordSanPham?.[props.fieldNameYeuCau]?.find((item) => item.namHocId === recordNamHoc._id)
				?.danhSachKetQuaTinhGioThanhVien;
		if (recordSanPham?._id && !recYeuCauQuyDoiGio?.length) {
			getQuyDoiGioTheoCongThucModel(recordNamHoc._id, props.mode, recordSanPham);
		}
	}, [recordNamHoc?._id, recordSanPham?._id, props.mode]);

	const tongGio = useMemo(() => {
		const quyDoiFinal = isGio ? quyDoiGio : quyDoiDiem;
		const tong = recordNamHoc?._id
			? quyDoiFinal?.[recordNamHoc._id]?.reduce(
					(preVal, curVal: SanPhamNCKH.KetQuaTinhGioThanhVien) => preVal + curVal.tongGio,
					0,
			  )
			: 0;
		return tong;
	}, [quyDoiGio?.[recordNamHoc?._id ?? ''], quyDoiDiem?.[recordNamHoc?._id ?? '']]);

	const isHandle =
		(recordSanPham &&
			[ETrangThaiSanPham.CHUA_TIEP_NHAN, ETrangThaiSanPham.CHINH_SUA_LAI].includes(recordSanPham?.trangThaiSanPham)) ||
		!recordSanPham?._id;

	const columns: IColumn<SanPhamNCKH.KetQuaTinhGioThanhVien>[] = [
		{
			title: 'Thành viên',
			dataIndex: 'ssoId',
			width: 200,
			render: (val) => {
				const recThanhVien = recordSanPham?.danhSachThanhVien?.find((item) => item.ssoId === val);

				return (
					<div>
						{recThanhVien?.hoVaTen} ({recThanhVien?.danhSachVaiTro?.join(', ')})
					</div>
				);
			},
		},
		{
			title: `Tổng ${isGio ? 'giờ' : 'điểm'}`,
			dataIndex: 'tongGio',
			align: 'center',
			width: 150,
		},
		{
			title: 'Chi tiết',
			width: 150,
			render: (val: SanPhamNCKH.KetQuaTinhGioThanhVien) => {
				return (
					<div>
						{val?.danhSachThongTinGio?.map((item) => (
							<div key={item.index}>
								- {item?.tongGio ?? 0} {isGio ? 'giờ' : 'điểm'} {item.moTa ? `(${item.moTa})` : ''}
							</div>
						))}
					</div>
				);
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			hide: !isHandle,
			render: (rec: SanPhamNCKH.KetQuaTinhGioThanhVien) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleKetQuaTinhGioThanhVien(true);
								setRecordKetQuaTinhGioThanhVien(rec);
								setEditKetQuaTinhGioThanhVien(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (recordNamHoc?._id) {
									if (isGio)
										setQuyDoiGio({
											...quyDoiGio,
											[recordNamHoc._id]:
												quyDoiGio?.[recordNamHoc?._id] ?? []?.filter((item: any) => item.ssoId !== rec.ssoId),
										});
									else
										setQuyDoiDiem({
											...quyDoiDiem,
											[recordNamHoc._id]:
												quyDoiDiem?.[recordNamHoc?._id] ?? []?.filter((item: any) => item.ssoId !== rec.ssoId),
										});
								}
							}}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			hide: isHandle,
			render: (rec: SanPhamNCKH.KetQuaTinhGioThanhVien) => (
				<>
					<Tooltip title='Chi tiết'>
						<Button
							onClick={() => {
								setVisibleKetQuaTinhGioThanhVien(true);
								setRecordKetQuaTinhGioThanhVien(rec);
								setEditKetQuaTinhGioThanhVien(true);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];

	const onCancelFormKetQuaTinhGioThanhVien = () => {
		setVisibleKetQuaTinhGioThanhVien(false);
	};

	const chuaKhaiBao = !recordSanPham?.[props.fieldNameYeuCau]?.find((item) => item.namHocId === recordNamHoc?._id)
		?.danhSachKetQuaTinhGioThanhVien?.length;

	return (
		<>
			{recordSanPham && (
				<>
					<Descriptions>
						<Descriptions.Item span={3} label='Trạng thái'>
							{recordSanPham?.trangThaiSanPham && (
								<Tag color={chuaKhaiBao ? 'gray' : MapKeyColorTrangThaiSanPham[recordSanPham?.trangThaiSanPham]}>
									{chuaKhaiBao
										? 'Chưa khai báo giờ chuẩn'
										: MapKeyTextTrangThaiSanPham[recordSanPham?.trangThaiSanPham]}
								</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item span={3} label='Ghi chú tiếp nhận'>
							{recordSanPham?.ghiChuTiepNhan ?? 'Không có ghi chú'}
						</Descriptions.Item>
					</Descriptions>
					<Descriptions>
						<Descriptions.Item
							label={`Danh sách kết quả ${
								isGio ? 'giờ chuẩn nghiên cứu khoa học' : 'điểm công trình khoa học'
							} của từng thành viên`}
						>
							{' '}
						</Descriptions.Item>
					</Descriptions>
				</>
			)}

			<TableStaticData
				loading={loading}
				totalComponent={
					<div className='total'>
						Tổng {isGio ? 'giờ' : 'điểm'}:<span>{tongGio || 0}</span>
					</div>
				}
				otherProps={{
					pagination: false,
					size: 'small',
					footer: chuaKhaiBao
						? () => (
								<div>
									Trên đây là dữ liệu do Hệ thống đề xuất, cán bộ/giảng viên có thể chỉnh sửa khai báo giờ chuẩn NCKH
									dựa trên dữ liệu do Hệ thống đề xuất
								</div>
						  )
						: undefined,
				}}
				addStt
				hasTotal
				data={recordNamHoc?._id ? quyDoi?.[recordNamHoc._id] ?? [] : []}
				columns={columns}
			>
				{isHandle && (
					<Space wrap>
						<Button
							type='primary'
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setEditKetQuaTinhGioThanhVien(false);
								setVisibleKetQuaTinhGioThanhVien(true);
								setRecordKetQuaTinhGioThanhVien(undefined);
							}}
						>
							Thêm mới
						</Button>
					</Space>
				)}
				<Select
					style={{ width: 200 }}
					placeholder='Lọc theo năm học'
					value={recordNamHoc?._id}
					options={danhSach.map((item) => ({ value: item._id, label: item.tenNamHoc }))}
					onChange={(val) => {
						setRecordNamHoc(danhSach.find((item) => item._id === val));
					}}
				/>
			</TableStaticData>
			<Modal
				width={900}
				visible={visibleKetQuaTinhGioThanhVien}
				destroyOnClose
				footer={false}
				bodyStyle={{ padding: 0 }}
				onCancel={onCancelFormKetQuaTinhGioThanhVien}
			>
				<FormKetQuaTinhGioThanhVien
					namHocId={recordNamHoc?._id ?? ''}
					fieldName={props.fieldNameKetQua}
					mode={isHandle ? 'handle' : 'view'}
					onCancel={onCancelFormKetQuaTinhGioThanhVien}
				/>
			</Modal>
			<div className='form-footer'>
				<Button
					onClick={() => {
						setCurrent(props.mode === 'DIEM' ? 1 : 0);
					}}
					icon={<RollbackOutlined />}
				>
					Quay lại bước trước
				</Button>
				{isHandle && (
					<Button
						onClick={async () => {
							if (!recordSanPham?._id || !recordNamHoc?._id) return;
							// if (quyDoiGio.length === 0) {
							// 	message.error('Chưa có dữ liệu');
							// 	return;
							// }
							for (const item in quyDoiGio) {
								const danhSachKetQuaTinhGioThanhVien = quyDoiGio[item];
								await createYeuCauQuyDoiGioModel(
									recordSanPham._id,
									{ namHocId: item, danhSachKetQuaTinhGioThanhVien },
									() => {},
									props.mode,
								);
							}
							props.getData();
							message.success('Lưu thành công');
							getByIdModel(recordSanPham._id);
							if (props.mode === 'DIEM' || !recordLoaiHinh?.tinhDiem) setVisibleForm(false);
							else setCurrent(2);
						}}
						icon={<SaveOutlined />}
						loading={formSubmiting || loading}
						htmlType='submit'
						type='primary'
					>
						Lưu
					</Button>
				)}

				<Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)}>
					Hủy
				</Button>
			</div>
		</>
	);
};

export default TableQuyDoiGio;
