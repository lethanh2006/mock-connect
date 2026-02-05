import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { type IColumn } from '@/components/Table/typing';
import {
	ColorTrangThaiMinhChungDiemRenLuyen,
	ELoaiMinhChungDiemRenLuyen,
	ELoaiMinhChungDiemRenLuyenMappingToTitle,
	EPhanLoaiNoiNgoaiTru,
	EPhanLoaiNoiNgoaiTruMappingToLabel,
	ETrangThaiMinhChungDiemRenLuyen,
} from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/constants';
import { type MinhChungDiemRenLuyen } from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/typing';
import { formatDate } from '@/utils/formatDate';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Carousel, Popconfirm, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { FormKhaiBaoMinhChung } from './components/Form';

export default () => {
	const {
		danhSach,
		page,
		limit,
		getLoaiMinhChung,
		handleView,
		handleEdit,
		deleteModel,
		getModel,
		record: recMinhChung,
		setRecord,
	} = useModel('diemrenluyen.minhchung');
  const intl = useIntl();
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const onCell = (rec: MinhChungDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(rec);
		},
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<MinhChungDiemRenLuyen.IRecord>[] = [
		// Nội ngoại trú
		{
			width: 120,
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.ngaykhaibao' }),
			align: 'center',
			filterType: 'date',
			dataIndex: 'createdAt',
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			render: (value) => formatDate(value),
		},
		{
			width: 100,
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.phanloai' }),
			dataIndex: 'phanLoai',
			align: 'center',
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			filterType: 'select',
			filterData: Object.values(EPhanLoaiNoiNgoaiTru).map((item) => ({
				value: item,
				label: EPhanLoaiNoiNgoaiTruMappingToLabel[item],
			})),
			render: (_, record) => EPhanLoaiNoiNgoaiTruMappingToLabel[record.phanLoai],
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.noio' }),
			dataIndex: 'thongTinNgoaiTru',
			width: 200,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			render: (val, record) => {
				if (record.phanLoai === 'noi_tru') {
					return (
						<p>
							{intl.formatMessage({ id: 'diemrenluyen.minhchung.ktx' })} {record?.kyTucXa?.ten}, {intl.formatMessage({ id: 'diemrenluyen.minhchung.sophong' })} {record?.soPhong?.ten}
						</p>
					);
				} else if (record.phanLoai === 'ngoai_tru') {
					return (
						<p>
							{val?.soNha}, {val?.quan}, {val?.xa}, {val?.tinh}
						</p>
					);
				} else {
					return null;
				}
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.lienhe' }),
			dataIndex: 'thongTinNgoaiTru',
			width: 200,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			onCell,
			render: (val, rec) => {
				if (rec.phanLoai === EPhanLoaiNoiNgoaiTru.NGOAI_TRU)
					return val?.nhaRieng ? intl.formatMessage({ id: 'diemrenluyen.minhchung.nharieng' }) : `${val?.tenChuTro ?? ''} ${intl.formatMessage({ id: 'diemrenluyen.minhchung.chutro' })}, ${val?.sdtChuTro ?? ''}`;
				return intl.formatMessage({ id: 'diemrenluyen.minhchung.ktx' });
			},
		},

		// Tham gia công tác xã hội

		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.thamgiacongtac' }),
			dataIndex: 'idNoiDungCongTacXaHoi',
			render: (_, rec) => rec.noiDungCongTacXaHoi?.ten,
			width: 200,
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.capdatgiai' }),
			dataIndex: 'idCapDatGiai',
			width: 120,
			render: (_, rec) => rec.capDatGiai?.ten,
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.noidunghoatdong' }),
			dataIndex: 'noiDungHoatDong',
			render: (val) => (
				<ExpandText style={{ marginBottom: 0 }} ellipsis={{ rows: 2, expandable: true, symbol: <span>{intl.formatMessage({ id: 'diemrenluyen.minhchung.xemtiep' })}</span> }}>
					{val}
				</ExpandText>
			),
			width: 200,
			onCell,
			hide: ![
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
			].includes(getLoaiMinhChung()),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.sukien' }),
			dataIndex: 'idSuKienCTSV',
			width: 150,
			render: (_, rec) => rec.suKienCTSV?.tenSuKien,
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
		},
		{
			title: getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC ? intl.formatMessage({ id: 'diemrenluyen.minhchung.thoigianchiase' }) : intl.formatMessage({ id: 'diemrenluyen.minhchung.thoigianthamgia' }),
			dataIndex: 'ngayThamGia',
			align: 'center',
			width: 120,
			render: (val) => formatDate(val),
			onCell,
			hide: ![
				ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
			].includes(getLoaiMinhChung()),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.duongdan' }),
			dataIndex: 'duongDan',
			align: 'center',
			width: 120,
			render: (_, record) => {
				if (record.duongDan) {
					return (
						<Button type='link' href={record.duongDan} target='_blank' rel='noreferrer'>
							{intl.formatMessage({ id: 'diemrenluyen.minhchung.moduongdan' })}
						</Button>
					);
				}
				return null;
			},
			hide: ![
				ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
			].includes(getLoaiMinhChung()),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.taptin' }),
			dataIndex: 'urlFileList',
			align: 'center',
			render: (_, record) =>
				record.urlFileList?.length ? (
					<Button
						type='link'
						onClick={() => {
							setRecord(record);
							setVisibleFormFile(true);
						}}
					>
						{intl.formatMessage({ id: 'diemrenluyen.minhchung.xemtaptin' })}
					</Button>
				) : null,

			width: 120,
			hide: ![
				ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
			].includes(getLoaiMinhChung()),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.diem' }),
			dataIndex: 'diemQuyDoi',
			align: 'center',
			sortable: true,
			width: 100,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.minhchung.danhsach.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ETrangThaiMinhChungDiemRenLuyen).map((value) => ({
				value,
				label: value,
			})),
			render: (_, record) => (
				<Tag color={ColorTrangThaiMinhChungDiemRenLuyen[record.trangThai]}>{record.trangThai}</Tag>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.danhmuc.thaotac' }),
			align: 'center',
			width: 70,
			fixed: 'right',
			hide: getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			render: (val, rec) => {
				return (
					<>
						<Tooltip title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.chinhsua' })}>
							<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
						</Tooltip>

						<Tooltip title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.xoa' })}>
							<Popconfirm
								placement='topRight'
								onConfirm={() => deleteModel(val._id, getModel)}
								title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.xacnhanxoa' })}
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				);
			},
		},
	];

	return (
		<>
			<TableBase
				widthDrawer={600}
				Form={FormKhaiBaoMinhChung}
				title={ELoaiMinhChungDiemRenLuyenMappingToTitle[getLoaiMinhChung()]}
				modelName='diemrenluyen.minhchung'
				columns={columns}
				dependencies={[page, limit]}
				buttons={{
					create:
						getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU ||
						!danhSach.find((item) => item.trangThai === ETrangThaiMinhChungDiemRenLuyen.DA_DUYET),
				}}
			/>

			<ModalExpandable
				title={intl.formatMessage({ id: 'diemrenluyen.minhchung.chitiettaptin' })}
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{recMinhChung?.urlFileList?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item ?? ''} />
					))}
				</Carousel>

				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>{intl.formatMessage({ id: 'diemrenluyen.minhchung.dong' })}</Button>
				</div>
			</ModalExpandable>
		</>
	);
};
