import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { EHoatDongChungType1 } from '@/services/SuKien/constant';
import type { SuKien } from '@/services/SuKien/typings';
import { ELoaiThongTinXemSau } from '@/services/TienIch/XemSau/constant';
import dayjs from '@/utils/dayjs';
import { EyeOutlined, FileExcelOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalChiTiet from './ModalChiTiet';

const SinhVienHoatDongCTSV = () => {
	const { getAllModel, danhSach, setDanhSach, loading, handleEdit } = useModel('sukien.sinhvienhoatdongctsv');
	const {
		postModel: postXemSau,
		getAllModel: getAllXemSau,
		danhSach: danhSachXemSau,
		deleteModel,
	} = useModel('tienich.xemsau');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { getAllModel: getAllHocKy, danhSach: danhSachHocKy } = useModel('daotao.hocky');
	const [tabActive, setTabActive] = useState<EHoatDongChungType1>(EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG);
	const [loadingXemSau, setLoadingXemSau] = useState<boolean>(false);
	const intl = useIntl();

	const getDataXemSau = () => {
		getAllXemSau(undefined, undefined, { loaiThongTin: ELoaiThongTinXemSau.SU_KIEN }, undefined, 'me/many');
	};

	useEffect(() => {
		getDataXemSau();
		getAllHocKy();
	}, []);

	const getData = () => {
		getAllModel(undefined, undefined, undefined, undefined, 'my', false).then((res) => {
			const data = res?.filter((item) => tabActive?.includes(item?.hoatDongCtsv?.phanLoaiCap1));
			setDanhSach(data);
		});
	};

	useEffect(() => {
		getData();
	}, [tabActive]);

	const handleXemSau = (rec: any) => {
		setLoadingXemSau(true);
		const data = {
			userSsoId: recSinhVien?.ssoId,
			sourceId: rec?._id,
			loaiThongTin: ELoaiThongTinXemSau.SU_KIEN,
			thongTin: rec,
		};
		postXemSau(
			data,
			getDataXemSau,
			undefined,
			intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.message.luuthanhcong' }),
		)
			.then()
			.catch((err) => console.log(err))
			.finally(() => setLoadingXemSau(false));
	};

	const handleBoXemSau = (rec: any) => {
		setLoadingXemSau(true);
		deleteModel(rec?._id, getDataXemSau)
			.then()
			.catch((err) => console.log(err))
			.finally(() => setLoadingXemSau(false));
	};

	const columns: IColumn<SuKien.ISinhVienHoatDongCTSV>[] = [
		{
			title: intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.table.ten' }),
			width: 200,
			render: (val, rec) => rec?.hoatDongCtsv?.ten,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.table.loai' }),
			width: 200,
			align: 'center',
			render: (val, rec) => rec?.hoatDongCtsv?.loai,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.table.hocky' }),
			width: 150,
			align: 'center',
			render: (val, rec) => danhSachHocKy?.find((item) => item?.ma === rec?.hoatDongCtsv?.maHocKy)?.ten,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.table.batdau' }),
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.hoatDongCtsv?.thoiGianBatDau && dayjs(rec?.hoatDongCtsv?.thoiGianBatDau).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.table.ketthuc' }),
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.hoatDongCtsv?.thoiGianKetThuc && dayjs(rec?.hoatDongCtsv?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY'),
		},

		{
			title: intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.table.trangthai' }),
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.trangThaiThamGia,
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.table.thaotac' }),
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.button.chitiet' })}
						type='link'
						icon={<EyeOutlined />}
						onClick={() => handleEdit(rec)}
					/>
					{danhSachXemSau?.find((items) => items?.sourceId === rec?._id)?._id ? (
						<ButtonExtend
							loading={loadingXemSau}
							type='link'
							danger
							icon={<FileExcelOutlined />}
							tooltip={intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.button.boluu' })}
							onClick={() => handleBoXemSau(danhSachXemSau?.find((items) => items?.sourceId === rec?._id))}
						/>
					) : (
						<ButtonExtend
							className='text-success'
							loading={loadingXemSau}
							type='link'
							icon={<SaveOutlined />}
							tooltip={intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.button.luu' })}
							onClick={() => handleXemSau(rec)}
						/>
					)}
				</>
			),
		},
	];

	return (
		<Card
			title={intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.page.title' })}
			className='card-big-title card-borderless'
			variant='borderless'
		>
			<Card>
				<Tabs activeKey={tabActive} onChange={(tab) => setTabActive(tab as EHoatDongChungType1)}>
					{Object.values(EHoatDongChungType1).map((item) => (
						<Tabs.TabPane tab={item} key={item} />
					))}
				</Tabs>

				<TableStaticData
					columns={columns}
					data={danhSach ?? []}
					loading={loading}
					addStt
					otherProps={{ pagination: true }}
					hasTotal
				>
					<div style={{ position: 'absolute', right: 130 }}>
						<ButtonExtend
							onClick={() => getData()}
							icon={<ReloadOutlined />}
						>
							{intl.formatMessage({ id: 'diemrenluyen.hoatdongctsv.button.tailai' })}
						</ButtonExtend>
					</div>
				</TableStaticData>

				<ModalChiTiet />
			</Card>
		</Card>
	);
};

export default SinhVienHoatDongCTSV;
