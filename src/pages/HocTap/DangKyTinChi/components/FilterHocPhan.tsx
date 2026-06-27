import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
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
	const { danhSachLopDangKy, dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

	const [visibleHocPhan, setVisibleHocPhan] = useState<boolean>(false);

	const allLoaiDangKy = Object.values(ELoaiDangKyTheoLop);
	if (!khoaNganhMe?.khoaNganhPhu?.ma) allLoaiDangKy.splice(-2, 1);

	const danhSachMaHpDangKy = danhSachLopDangKy.map((item) => item.maHocPhan);

	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);

	const getData = () =>
		recHocKy?.ma &&
		dotDangKyHienTai?._id &&
		dotDangKyHienTai.maHocKy === recHocKy.ma &&
		getHocPhanDKHPModel(recHocKy.ma, undefined, {
			isOpenLop: true,
			idDot: dotDangKyHienTai._id,
		});

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
			// render: (val, rec) => (
			// 	<a
			// 		onClick={(e) => {
			// 			e.stopPropagation();
			// 			handleXemDeCuong(val, rec?.ten);
			// 		}}
			// 	>
			// 		{val}
			// 	</a>
			// ),
			onCell,
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
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.trangthai' }),
			dataIndex: 'ma',
			width: 120,
			align: 'center',
			render: (ma: string) =>
				danhSachMaHpDangKy.includes(ma) ? (
					<Tag color='green'>
						{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.trangthai.dadangky' })}
					</Tag>
				) : (
					<Tag color='red'>
						{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.trangthai.chuadangky' })}
					</Tag>
				),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (_, rec) => (
				<div>
					<ButtonExtend
						size='small'
						type='primary'
						icon={<PlusOutlined />}
						onClick={() => {
							setHocPhan(rec);
							setVisibleHocPhan(true);
						}}
					/>
				</div>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit, loaiDangKy, recHocKy?.ma, dotDangKyHienTai?._id]}
				getData={getData}
				modelName='hocphan.hocphan'
				hideCard
				buttons={{ create: false }}
				hideFilterColumn={false}
				header={{
					total: {
						prefix: intl.formatMessage({ id: 'dangkytinchi.filter.hocphan.total.prefix' }),
					},
				}}
				otherExtra={[
					<span>
						{intl.formatMessage({ id: 'dangkytinchi.tcdangky' })}:{' '}
						<b style={{ color: '#c80f1f', fontSize: 15 }}>{tongTinChi ?? 0}</b>
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
				title={[
					recHocPhan?.ten,
					recHocPhan?.ma,
					`${recHocPhan?.soTinChi} ${intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}`,
				]
					.filter(Boolean)
					.join(' - ')}
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
