import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectSinhVienDebounce from '@/pages/SinhVien/components/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { primaryColor } from '@/services/base/constant';
import { EKieuDuLieu, ETextDisplay } from '@/services/FormDong/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { getSafeHref } from '@/utils/security';
import { currencyFormat, sanitizeObject } from '@/utils/utils';
import { Modal, Tag } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import FormTable from './FormTable';

const ViewRender = (props: {
	cauHinh: LoaiHinh.TruongThongTin | LoaiHinh.Cot;
	recordSanPham?: any;
	isCot?: boolean;
}): any => {
	// const { danhSach } = useModel('quanlykhoahoc.danhmuc.chung');
	// const { danhSach: danhSachLoaiHinh } = useModel('quanlykhoahoc.loaihinhnckh');
	const { cauHinh, recordSanPham, isCot } = props;
	const intl = useIntl();

	const [visibleFormTable, setVisibleFormTable] = useState<boolean>(false);
	const [editFormTable, setEditFormTable] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(false);
	const [recordTable, setRecordTable] = useState<any>({});
	const onCellTable = (record: any) => ({
		onClick: () => {
			setIsView(true);
			setEditFormTable(true);
			setRecordTable(record);
			setVisibleFormTable(true);
		},
		style: { cursor: 'pointer' },
	});

	let value = <div />;

	const recordSanPhamFinal = isCot ? recordSanPham : recordSanPham?.thongTinKhaiBao;
	const valueFinal = isCot ? recordSanPhamFinal?.[cauHinh.ma] : recordSanPhamFinal?.[cauHinh.ma]?.value;
	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.TEXT:
			value =
				cauHinh.textDisplay === ETextDisplay.TEXT_EDITOR ? (
					<div dangerouslySetInnerHTML={{ __html: sanitizeObject(valueFinal ?? '') }} />
				) : (
					<div>{valueFinal}</div>
				);
			break;

		case EKieuDuLieu.CAN_BO:
			value = <SelectNhanSuDebounce value={valueFinal} isView />;
			break;
		case EKieuDuLieu.SINH_VIEN:
			value = <SelectSinhVienDebounce value={valueFinal} isView />;
			break;

		case EKieuDuLieu.BOOLEAN:
			value = (
				<div>
					{valueFinal
						? intl.formatMessage({ id: 'diemrenluyen.maudon.co' })
						: intl.formatMessage({ id: 'diemrenluyen.maudon.khong' })}
				</div>
			);
			break;

		case EKieuDuLieu.DANHMUC:
			value = <div>{(value = cauHinh.laDangMang && valueFinal?.join ? valueFinal?.join(', ') : valueFinal)}</div>;

			break;
		case EKieuDuLieu.NUMBER:
			value = valueFinal ? (
				<div>
					{currencyFormat(
						(value = cauHinh.laDangMang ? valueFinal?.map((item: number) => item)?.join(', ') : valueFinal),
					)}
				</div>
			) : (
				<div />
			);

			break;
		case EKieuDuLieu.DECIMAL:
			value = valueFinal ? <div>{(value = cauHinh.laDangMang ? valueFinal?.join(', ') : valueFinal)}</div> : <div />;

			break;

		case EKieuDuLieu.HOUR:
			value = <div>{formatDateTime(valueFinal)}</div>;
			break;
		case EKieuDuLieu.DATE:
			value = <div>{formatDate(valueFinal)}</div>;
			// value = <div>{valueFinal}</div>;
			break;
		case EKieuDuLieu.MONTH:
			value = <div>{formatDate(valueFinal, 'MM/YYYY')}</div>;
			// value = <div>{valueFinal}</div>;
			break;
		case EKieuDuLieu.FILE:
			value =
				typeof valueFinal === 'string' ? (
					<div>
						{getSafeHref(valueFinal) && (
							<Tag style={{ marginLeft: 8 }} color={primaryColor} key={cauHinh.ma}>
								<a href={getSafeHref(valueFinal)} target='_blank' rel='noreferrer'>
									{intl.formatMessage({ id: 'diemrenluyen.minhchung.xemtaptin' })}
								</a>
							</Tag>
						)}
					</div>
				) : (
					<div>
						{recordSanPhamFinal?.[cauHinh.ma] &&
							valueFinal?.length > 0 &&
							valueFinal?.map((item: string) => {
								const href = getSafeHref(item);
								return href ? (
									<Tag style={{ marginLeft: 8 }} color={primaryColor} key={cauHinh.ma}>
										<a href={href} target='_blank' rel='noreferrer'>
											{intl.formatMessage({ id: 'diemrenluyen.minhchung.xemtaptin' })}
										</a>
									</Tag>
								) : null;
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
						onCell: onCellTable,
						render: (val, rec) => {
							return <ViewRender cauHinh={item} recordSanPham={rec} isCot />;
						},
						// ...buildFilter(item, danhSach),
					});
				});

			value = (
				<>
					<TableStaticData
						otherProps={{ pagination: false }}
						addStt
						size='small'
						data={recordSanPham?.thongTinKhaiBao?.[cauHinh.ma]?.value ?? []}
						columns={columns}
					/>
					<Modal
						destroyOnClose
						width={700}
						footer={false}
						title={`${editFormTable ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.chinhsua' }) : intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' })} ${cauHinh.ten}`}
						open={visibleFormTable}
						onCancel={() => setVisibleFormTable(false)}
					>
						<FormTable
							isView={isView}
							record={recordTable}
							onCancel={() => setVisibleFormTable(false)}
							edit={editFormTable}
							cauHinh={cauHinh}
						/>
					</Modal>
				</>
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
