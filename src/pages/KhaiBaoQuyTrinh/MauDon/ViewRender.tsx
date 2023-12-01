import type { IColumn } from '@/components/Table/typing';
import { tienVietNam } from '@/utils/utils';
import { Tag } from 'antd';
import moment from 'moment';
import TableStaticData from '@/components/Table/TableStaticData';
import type { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';
import { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';

const ViewRender = (props: {
	cauHinh: LoaiHinh.TruongThongTin | LoaiHinh.Cot;
	recordSanPham?: any;
	isCot?: boolean;
}): any => {
	// const { danhSach } = useModel('quanlykhoahoc.danhmuc.chung');
	// const { danhSach: danhSachLoaiHinh } = useModel('quanlykhoahoc.loaihinhnckh');
	const { cauHinh, recordSanPham, isCot } = props;
	let value = <div />;

	const recordSanPhamFinal = isCot ? recordSanPham : recordSanPham?.thongTinKhaiBao;
	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.TEXT:
			value = <div>{recordSanPhamFinal?.[cauHinh.ma]}</div>;
			break;

		case EKieuDuLieu.BOOLEAN:
			value = <div>{recordSanPhamFinal?.[cauHinh.ma] ? 'Có' : 'Không'}</div>;
			break;

		case EKieuDuLieu.DANHMUC:
			value = (
				<div>
					{
						(value = cauHinh.laDangMang
							? recordSanPhamFinal?.[cauHinh.ma]?.join(', ')
							: recordSanPhamFinal?.[cauHinh.ma])
					}
				</div>
			);

			break;
		case EKieuDuLieu.NUMBER:
			value = recordSanPhamFinal?.[cauHinh.ma] ? (
				<div>
					{
						(value = cauHinh.laDangMang
							? recordSanPhamFinal?.[cauHinh.ma]?.map((item: number) => item)?.join(', ')
							: recordSanPhamFinal?.[cauHinh.ma])
					}
				</div>
			) : (
				<div />
			);

			break;
		case EKieuDuLieu.DECIMAL:
			value = recordSanPhamFinal?.[cauHinh.ma] ? (
				<div>
					{
						(value = cauHinh.laDangMang
							? recordSanPhamFinal?.[cauHinh.ma]?.join(', ')
							: recordSanPhamFinal?.[cauHinh.ma])
					}
				</div>
			) : (
				<div />
			);

			break;

		case EKieuDuLieu.HOUR:
			value = <div>{moment(recordSanPhamFinal?.[cauHinh.ma]).format('HH:mm DD/MM/YYYY')}</div>;
			break;
		case EKieuDuLieu.DATE:
			value = <div>{moment(recordSanPhamFinal?.[cauHinh.ma]).format('DD/MM/YYYY')}</div>;
			break;
		case EKieuDuLieu.MONTH:
			value = <div>{moment(recordSanPhamFinal?.[cauHinh.ma]).format('MM/YYYY')}</div>;
			break;
		case EKieuDuLieu.FILE:
			value = (
				<div>
					{recordSanPhamFinal[cauHinh.ma] &&
						recordSanPhamFinal[cauHinh.ma].map &&
						recordSanPhamFinal?.[cauHinh.ma]?.map((item: string) => (
							<Tag color={'red'} key={cauHinh.ma}>
								<a href={item} target='_blank' rel='noreferrer'>
									Xem tập tin
								</a>
							</Tag>
						))}
				</div>
			);

			break;

		case EKieuDuLieu.TABLE:
			const columns: IColumn<any>[] = [];
			cauHinh?.danhSachCot
				?.filter((item) =>
					cauHinh?.danhSachCotHienThi?.length ? cauHinh?.danhSachCotHienThi?.includes(item.ma) : item,
				)
				?.map((item) => {
					columns.push({
						title: item.ten,
						dataIndex: item.ma,
						align: 'center',
						width: 100,
						render: (val, rec) => {
							return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
						},
						// ...buildFilter(item, danhSach),
					});
				});

			value = (
				<TableStaticData
					otherProps={{ pagination: false }}
					addStt
					size='small'
					data={recordSanPham?.thongTinKhaiBao?.[cauHinh.ma] ?? []}
					columns={columns}
				/>
			);

			break;

		// case EKieuDuLieu.DANHSACH:
		// 	const columnsDs: IColumn<any>[] = [];
		// 	danhSachLoaiHinh
		// 		?.find((value2) => value2?._id === cauHinh?.loaiHinhNckhId)
		// 		?.cauHinhLoaiHinh?.map((item) => {
		// 			columnsDs.push({
		// 				title: item.ten,
		// 				dataIndex: item.ma,
		// 				align: 'center',
		// 				width: 100,
		// 				render: (val, rec) => {
		// 					return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
		// 				},
		// 				...buildFilter(item, danhSach),
		// 			});
		// 		});
		//
		// 	value = (
		// 		<TableStaticData
		// 			otherProps={{ pagination: false }}
		// 			addStt
		// 			size='small'
		// 			data={recordSanPham?.thongTinKhaiBao?.[cauHinh.ma] ?? []}
		// 			columns={columnsDs}
		// 		/>
		// 	);
		//
		// 	break;

		default:
			break;
	}

	return value;
};

export default ViewRender;
