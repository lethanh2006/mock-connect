import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import { Button, Modal, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import ViewRender from './ViewRender';
import TableThanhVien from './TableThanhVien';
import ViewSanPham from './ViewSanPham';
import { EKieuDuLieu } from '@/services/KhoaHoc/LoaiHinhNCKH/constants';

const KetQuaSearch = (props: { handleSubmit: any }) => {
	const { ketQuaSearch, visibleKetQuaSearch, setVisibleKetQuaSearch, loading, formSubmiting, record } =
		useModel('khoahoc.sanphamnckh');
	const { getAllModel: getAllLoaiHinh } = useModel('khoahoc.loaihinhnckh');

	const [recordSanPham, setRecordSanPham] = useState<SanPhamNCKH.IRecord>();

	const [recordLoaiHinhNCKH, setRecordLoaiHinhNCKH] = useState<LoaiHinhNCKH.IRecord | undefined>();
	const [danhSachLoaiHinh, setDanhSachLoaiHinh] = useState<LoaiHinhNCKH.IRecord[]>([]);

	const [visibleViewThanhVien, setVisibleViewThanhVien] = useState<boolean>(false);
	const [visibleViewSanPham, setVisibleViewSanPham] = useState<boolean>(false);

	const getLoaiHinh = async () => {
		const res: LoaiHinhNCKH.IRecord[] = await getAllLoaiHinh(false, undefined, undefined, undefined, undefined, false);
		setDanhSachLoaiHinh(res);
	};

	useEffect(() => {
		getLoaiHinh();
	}, []);

	useEffect(() => {
		setRecordLoaiHinhNCKH(danhSachLoaiHinh?.find((item) => item._id === ketQuaSearch?.[0]?.loaiHinhNckhId));
	}, [danhSachLoaiHinh.length, ketQuaSearch.length, record?._id]);

	const handleCancel = useCallback(() => {
		setVisibleKetQuaSearch(false);
	}, []);

	const onCancelViewThanhVien = useCallback(() => {
		setVisibleViewThanhVien(false);
	}, []);

	const onCancelViewSanPham = useCallback(() => {
		setVisibleViewSanPham(false);
	}, []);

	const onCell = (rec: SanPhamNCKH.IRecord) => ({
		onClick: () => {
			setVisibleViewSanPham(true);
			setRecordSanPham(rec);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SanPhamNCKH.IRecord>[] = [
		{
			title: 'Người khai báo',
			width: 120,
			render: (val, rec) => rec.nguoiKhaiBao.hoVaTen,
			onCell,
		},
		{
			title: 'Thành viên',
			width: 100,
			align: 'center',
			render: (rec) => (
				<a
					onClick={() => {
						setRecordSanPham(rec);
						setVisibleViewThanhVien(true);
					}}
				>
					{rec?.danhSachThanhVien?.length ?? 0} thành viên
				</a>
			),
		},
	];

	recordLoaiHinhNCKH?.cauHinhLoaiHinh
		?.filter((item) =>
			recordLoaiHinhNCKH?.danhSachCotHienThi?.length ? recordLoaiHinhNCKH.danhSachCotHienThi.includes(item.ma) : item,
		)
		.map((item) => {
			if (![EKieuDuLieu.TABLE, EKieuDuLieu.DANHSACH].includes(item.kieuDuLieu))
				columns.push({
					title: item.ten,
					// dataIndex: `thongTinKhaiBao.${item.ma}`,
					width: 200,
					align: 'center',
					onCell,
					render: (val, rec) => {
						const recSanPham: any = { ...rec };
						return <ViewRender cauHinh={item} recordSanPham={recSanPham} />;
					},
					// ...buildFilter(item, danhSach),
				});
		});

	return (
		<Modal
			width={1000}
			visible={visibleKetQuaSearch}
			title='Các hoạt động, sản phẩm NCKH tương đồng'
			onCancel={handleCancel}
			footer={
				<>
					<Button
						loading={loading || formSubmiting}
						type='primary'
						onClick={() => {
							if (props.handleSubmit) props.handleSubmit();
						}}
					>
						Tiếp tục lưu
					</Button>
					<Button onClick={handleCancel}>Đóng</Button>
				</>
			}
		>
			<div>
				<b>Lưu ý:</b> Hiện tại trong hệ thống tồn tại một số sản phẩm, hoạt động dưới đây tương đồng với sản phẩm, hoạt
				động mà cán bộ/giảng viên đang khai báo, cán bộ/giảng viên kiểm tra lại thông tin trước khi lưu.
			</div>
			<br />
			<TableStaticData
				hasTotal
				// otherProps={{ pagination: false }}
				data={ketQuaSearch.filter((item) => item.loaiHinhNckhId === recordLoaiHinhNCKH?._id)}
				columns={columns}
			>
				<Select
					style={{ width: 300 }}
					onChange={(val) => setRecordLoaiHinhNCKH(danhSachLoaiHinh.find((item) => item._id === val))}
					value={recordLoaiHinhNCKH?._id}
					options={danhSachLoaiHinh
						?.filter((item) => ketQuaSearch.map((sp) => sp.loaiHinhNckhId).includes(item._id))
						.map((item) => ({ value: item._id, label: item.ten }))}
				/>
			</TableStaticData>

			<Modal
				width={900}
				title='Danh sách thành viên'
				footer={
					<Button type='primary' onClick={onCancelViewThanhVien}>
						Đóng
					</Button>
				}
				visible={visibleViewThanhVien}
				onCancel={onCancelViewThanhVien}
			>
				<TableThanhVien data={recordSanPham?.danhSachThanhVien} mode='view' />
			</Modal>
			<Modal
				destroyOnClose
				width={900}
				title='Chi tiết sản phẩm, hoạt động NCKH'
				footer={false}
				visible={visibleViewSanPham}
				onCancel={onCancelViewSanPham}
			>
				<ViewSanPham
					danhSachThanhVien={recordSanPham?.danhSachThanhVien}
					recordLH={recordLoaiHinhNCKH}
					recordSP={recordSanPham}
					onCancel={onCancelViewSanPham}
					getData={() => {}}
					mode={'view'}
				/>
			</Modal>
		</Modal>
	);
};

export default KetQuaSearch;
