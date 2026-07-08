import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { primaryColor } from '@/services/base/constant';
import { EKieuDuLieu } from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { getSafeHref } from '@/utils/security';
import { sanitizeObject } from '@/utils/utils';
import { Tag } from 'antd';
import { useModel } from 'umi';
import { buildFilter } from './BuildFilter';

const safeDisplayText = (val: unknown): string => {
	if (typeof val === 'string') return sanitizeObject(val);
	if (Array.isArray(val)) {
		return val.map((item) => (typeof item === 'string' ? sanitizeObject(item) : String(item ?? ''))).join(', ');
	}
	if (val == null) return '';
	return String(val);
};

const ViewRender = (props: {
	cauHinh: LoaiHinhNCKH.TruongThongTin | LoaiHinhNCKH.Cot;
	recordSanPham: SanPhamNCKH.IRecord;
	isCot?: boolean;
}): any => {
	const { danhSach } = useModel('khoahoc.danhmuc.chung');
	const { danhSach: danhSachLoaiHinh } = useModel('khoahoc.loaihinhnckh');

	const { cauHinh, recordSanPham, isCot } = props;
	let value = <div />;

	const buildRecSanPham: any = {};
	if (recordSanPham?.thongTinKhaiBao?.map) {
		recordSanPham?.thongTinKhaiBao?.map((item) => {
			buildRecSanPham[item.ma] = item.value;
		});
	}

	const recordSanPhamFinal = isCot ? recordSanPham : buildRecSanPham;

	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.TEXT:
			value = <div>{safeDisplayText(recordSanPhamFinal?.[cauHinh.ma])}</div>;
			break;

		case EKieuDuLieu.CAN_BO:
			// const recNhanSu: ToChucNhanSu.INhanSu = recordSanPhamFinal?.[cauHinh.ma];
			value = <div />;
			break;

		case EKieuDuLieu.BOOLEAN:
			value = <div>{recordSanPhamFinal?.[cauHinh.ma] ? 'Có' : 'Không'}</div>;
			break;

		case EKieuDuLieu.DANHMUC:
			value = <div>{safeDisplayText(recordSanPhamFinal?.[cauHinh.ma])}</div>;

			break;
		case EKieuDuLieu.NUMBER:
			value = recordSanPhamFinal?.[cauHinh.ma] ? (
				<div>{safeDisplayText(recordSanPhamFinal?.[cauHinh.ma])}</div>
			) : (
				<div />
			);

			break;
		case EKieuDuLieu.DECIMAL:
			value = recordSanPhamFinal?.[cauHinh.ma] ? (
				<div>{safeDisplayText(recordSanPhamFinal?.[cauHinh.ma])}</div>
			) : (
				<div />
			);

			break;

		case EKieuDuLieu.HOUR:
			value = <div>{formatDateTime(recordSanPhamFinal?.[cauHinh.ma])}</div>;
			break;
		case EKieuDuLieu.DATE:
			value = <div>{formatDate(recordSanPhamFinal?.[cauHinh.ma])}</div>;
			break;
		case EKieuDuLieu.MONTH:
			value = <div>{formatDate(recordSanPhamFinal?.[cauHinh.ma], 'MM/YYYY')}</div>;
			break;
		case EKieuDuLieu.FILE:
			value = (
				<div>
					{recordSanPhamFinal[cauHinh.ma] &&
						recordSanPhamFinal[cauHinh.ma].map &&
						recordSanPhamFinal?.[cauHinh.ma]?.map((item: string) => {
							const href = getSafeHref(item);
							if (!href) return null;
							return (
								<Tag color={primaryColor} key={href}>
									<a href={href} target='_blank' rel='noreferrer'>
										Xem tập tin
									</a>
								</Tag>
							);
						})}
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
						...buildFilter(item, danhSach),
					});
				});

			value = (
				<TableStaticData
					otherProps={{ pagination: false }}
					addStt
					size='small'
					data={recordSanPhamFinal?.[cauHinh.ma] ?? []}
					columns={columns}
				/>
			);

			break;

		case EKieuDuLieu.DANHSACH:
			const columnsDs: IColumn<any>[] = [];
			danhSachLoaiHinh
				?.find((value2) => value2?._id === cauHinh?.loaiHinhNckhId)
				?.cauHinhLoaiHinh?.map((item) => {
					columnsDs.push({
						title: item.ten,
						dataIndex: item.ma,
						align: 'center',
						width: 100,
						render: (val, rec) => {
							return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
						},
						...buildFilter(item, danhSach),
					});
				});

			value = (
				<TableStaticData
					otherProps={{ pagination: false }}
					addStt
					size='small'
					data={recordSanPham?.[cauHinh.ma] ?? []}
					columns={columnsDs}
				/>
			);

			break;

		default:
			break;
	}

	return value;
};

export default ViewRender;
