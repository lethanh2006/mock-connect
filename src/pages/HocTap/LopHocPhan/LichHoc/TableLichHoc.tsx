import PreviewFile from '@/components/PreviewFile';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorTrangThaiUserDiemDanh, ETrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
import { colorHinhThucGiangDay, EHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { THU_TRONG_TUAN } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { MailOutlined } from '@ant-design/icons';
import { Button, Carousel, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalXinNghi from '../YeuCauNghiHoc/ModalXinNghi';

const TableLichHocLopHP = (props: {
	items: ThoiKhoaBieu.IRecord[];
	onClickItem: (val: ThoiKhoaBieu.IRecord) => void;
}) => {
	const intl = useIntl();
	const { loading, setRecord } = useModel('daotao.thoikhoabieu');
	const { visibleForm, setVisibleForm, daXinNghiHoc } = useModel('daotao.dangkynghihoc');
	const { items, onClickItem } = props;
	const [url, setUrl] = useState<any[]>([]);
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const onCellStyle = (rec: ThoiKhoaBieu.IRecord) => ({
		onClick: () => onClickItem(rec),
		style: {
			cursor: 'pointer',
			backgroundColor: dayjs().isSame(dayjs(rec.ngay), 'day') ? '#005fcc1f' : undefined,
		},
	});

	const onCell = (rec: ThoiKhoaBieu.IRecord) => ({
		...onCellStyle(rec),
		onClick: () => onClickItem(rec),
	});

	const columns: IColumn<ThoiKhoaBieu.IRecord>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.ngayhoc' }),
			dataIndex: 'ngay',
			align: 'center',
			width: 150,
			render: (val) => (val ? `${THU_TRONG_TUAN[dayjs(val).day()]}, ${dayjs(val).format('DD/MM/YYYY')}` : null),
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.tiethoc' }),
			width: 60,
			align: 'center',
			render: (val, rec) => `${rec.tietBatDau} - ${rec.tietKetThuc}`,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.phonghoc' }),
			dataIndex: 'phongHoc',
			align: 'center',
			width: 100,
			render: (val) => (val ? val : <i>{intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.chuacapnhat' })}</i>),
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.hinhthuc' }),
			dataIndex: 'hinhThucGiangDay',
			align: 'center',
			width: 100,
			render: (val: EHinhThucGiangDay) => val && <Tag color={colorHinhThucGiangDay[val]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(EHinhThucGiangDay),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.diemdanh' }),
			dataIndex: 'trangThaiDiemDanhCaNhan',
			align: 'center',
			width: 120,
			render: (val: ETrangThaiUserDiemDanh) =>
				val ? <Tag color={colorTrangThaiUserDiemDanh[val]}>{trangThaiUserDiemDanh[val]}</Tag> : null,

			filterType: 'select',
			filterData: Object.values(ETrangThaiUserDiemDanh),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.giangvien' }),
			dataIndex: 'nhanSuSsoId',
			width: 140,
			render: (val, rec) =>
				rec.nhanSu?.ten
					? [rec.nhanSu?.hoDem, rec.nhanSu?.ten].join(' ')
					: (rec.tenNhanSu ?? <i>{intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.chuacapnhat' })}</i>),
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.tieude' }),
			dataIndex: 'tieuDeBaiHoc',
			width: 180,
			// render: (val, rec) => rec.noiDungHp?.tieuDe ?? '',
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.hoclieu' }),
			width: 140,
			render: (val, rec) =>
				rec.hocLieuList?.filter((item) => item?.url)?.length ? (
					<a
						onClick={() => {
							setUrl(rec?.hocLieuList ?? []);
							setVisibleFormFile(true);
						}}
					>
						{intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.xemchitiet' })}
					</a>
				) : null,
			onCell: onCellStyle,
		},
		// {
		// 	title: 'Loại hình',
		// 	dataIndex: 'loaiHinhHocTap',
		// 	width: 80,
		// 	render: (val) => (val ? val : ''),
		// 	onCell,
		// },
		// {
		// 	title: 'Nhóm lớp',
		// 	align: 'center',
		// 	width: 80,
		// 	render: (val, rec) => !!rec.lopHocPhan?.tenCha && `Nhóm ${rec.lopHocPhan?.loai} ${rec.lopHocPhan?.soThuTuNhom}`,
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.thaotac' }),
			width: 60,
			align: 'center',
			render: (_, rec) => (
				<ButtonExtend
					type='link'
					tooltip={
						daXinNghiHoc(rec._id)
							? intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.dagoidon' })
							: intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.xinnghihoc' })
					}
					icon={<MailOutlined />}
					// TODO: Chỉ cho phép gửi đơn chậm nhất 1 ngày sau buổi học => TH Muốn gửi lại/Hủy đơn thì sao?
					// disabled={dayjs().isAfter(dayjs(rec.ngay).add(1, 'day').endOf('day')) || daXinNghiHoc(rec._id)}
					onClick={(e) => {
						e.stopPropagation();
						setRecord(rec);
						setVisibleForm(true);
					}}
				/>
			),
		},
	];

	return (
		<>
			<TableStaticData
				hasTotal
				data={items}
				columns={columns}
				otherProps={{ pagination: false, loading, scroll: { y: 600 } }}
			/>

			<ModalExpandable
				title={intl.formatMessage({ id: 'lophocphan.id.lichhoc.table.chitiet' })}
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{url?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item.url ?? ''} tenFile={item?.ten} />
					))}
				</Carousel>

				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>

			<ModalXinNghi visible={visibleForm} onClose={() => setVisibleForm(false)} />
		</>
	);
};

export default TableLichHocLopHP;
