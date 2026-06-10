import TableBase from '@/components/Table';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { type IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import { ELoaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { PlusOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import DangKyLopHocPhan from './DangKyLopHocPhan';

const FilterHocPhanDKTC = (props: { tongTinChi: number }) => {
	const { tongTinChi } = props;
	const intl = useIntl();

	const { khoaNganhMe, getKhoaNganhMeModel } = useModel('sinhvien.sinhvien');
	const {
		record: recHocPhan,
		setRecord: setHocPhan,
		page,
		limit,
		getHocPhanDKHPModel,
		loaiDangKy,
	} = useModel('hocphan.hocphan');

	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSachLopDangKy } = useModel('daotao.dotdangkytinchi');

	const [visibleHocPhan, setVisibleHocPhan] = useState<boolean>(false);

	const allLoaiDangKy = Object.values(ELoaiDangKyTheoLop);
	if (!khoaNganhMe?.khoaNganhPhu?.ma) allLoaiDangKy.splice(-2, 1);

	const danhSachMaHpDangKy = danhSachLopDangKy.map((item) => item.maHocPhan);

	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);

	const getData = () => recHocKy?.ma && getHocPhanDKHPModel(recHocKy.ma).then((res) => setHocPhan(res?.[0]));

	useEffect(() => {
		getKhoaNganhMeModel();

		return () => {
			setHocPhan(undefined);
		};
	}, []);

	const handleXemDeCuong = (maHocPhan: string, tenHocPhan?: string) => {
		setDeCuongModal({
			deCuongId: maHocPhan,
			title: `${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${tenHocPhan || maHocPhan || ''}`,
		});
		setVisibleDeCuong(true);
	};

	const onCell = (rec: HocPhan.IRecord) => ({
		onClick: () => {
			setHocPhan(rec);
			setVisibleHocPhan(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<HocPhan.IRecord & { index: number }>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.mahp' }),
			dataIndex: 'ma',
			width: 110,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => (
				<a
					onClick={(e) => {
						e.stopPropagation();
						handleXemDeCuong(val, rec?.ten);
					}}
				>
					{val}
				</a>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.tenhocphan' }),
			dataIndex: 'ten',
			width: 280,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.sotinchi' }),
			dataIndex: 'soTinChi',
			width: 70,
			align: 'center',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'ma',
			width: 120,
			align: 'center',
			render: (ma: string) =>
				danhSachMaHpDangKy.includes(ma) ? <Tag color='green'>Đã đăng ký</Tag> : <Tag color='red'>Chưa đăng ký</Tag>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, rec) => (
				<button
					type='button'
					className='custom-action-btn'
					onClick={() => {
						setHocPhan(rec);
						setVisibleHocPhan(true);
					}}
				>
					<PlusOutlined />
				</button>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit, loaiDangKy, recHocKy?.ma]}
				getData={getData}
				modelName='hocphan.hocphan'
				hideCard
				buttons={{ create: false }}
				otherText={[
					<span>
						Tổng STC đã đăng ký: <b style={{ color: '#c80f1f', fontSize: '1.1rem' }}>{tongTinChi ?? 0}</b>
					</span>,
				]}
			/>

			{deCuongModal && (
				<ModalHocPhan
					visible={visibleDeCuong}
					setVisible={setVisibleDeCuong}
					deCuongId={deCuongModal.deCuongId}
					title={deCuongModal.title}
				/>
			)}

			<ModalExpandable
				title={[recHocPhan?.ten, recHocPhan?.ma, `${recHocPhan?.soTinChi} tín chỉ`].filter(Boolean).join(' - ')}
				open={visibleHocPhan}
				onCancel={() => setVisibleHocPhan(false)}
				footer={null}
				width={1100}
			>
				<DangKyLopHocPhan />
			</ModalExpandable>
		</>
	);
};

export default FilterHocPhanDKTC;
