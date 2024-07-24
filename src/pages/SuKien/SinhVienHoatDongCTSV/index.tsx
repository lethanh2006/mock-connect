import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { EHoatDongChungType1 } from '@/services/SuKien/constant';
import type { SuKien } from '@/services/SuKien/typings';
import { ELoaiThongTinXemSau } from '@/services/XemSau/constant';
import { CheckOutlined, CloseOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalChiTiet from './ModalChiTiet';

const SinhVienHoatDongCTSV = () => {
	const { getAllModel, danhSach, setDanhSach, loading, handleEdit } = useModel('sukien.sinhvienhoatdongctsv');
	const {
		postModel: postXemSau,
		getAllModel: getAllXemSau,
		danhSach: danhSachXemSau,
		deleteModel,
	} = useModel('xemsau');
	const { getThongTinCuaToiModel, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { getAllModel: getAllHocKy, danhSach: danhSachHocKy } = useModel('daotao.hocky');
	const [tabActive, setTabActive] = useState<EHoatDongChungType1>(EHoatDongChungType1.GIAO_DUC_CHINH_TRI_TU_TUONG);
	const [loadingXemSau, setLoadingXemSau] = useState<boolean>(false);

	const getDataXemSau = () => {
		getAllXemSau(undefined, undefined, { loaiThongTin: ELoaiThongTinXemSau.SU_KIEN }, undefined, 'me/many');
	};

	useEffect(() => {
		getThongTinCuaToiModel();
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
		postXemSau(data, getDataXemSau, undefined, 'Lưu thành công')
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
			title: 'Tên hoạt động',
			width: 200,
			render: (val, rec) => rec?.hoatDongCtsv?.ten,
		},
		{
			title: 'Loại',
			width: 200,
			align: 'center',
			render: (val, rec) => rec?.hoatDongCtsv?.loai,
		},
		{
			title: 'Học kỳ',
			width: 150,
			align: 'center',
			render: (val, rec) => danhSachHocKy?.find((item) => item?.ma === rec?.hoatDongCtsv?.maHocKy)?.ten,
		},
		{
			title: 'Thời gian bắt đầu',
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.hoatDongCtsv?.thoiGianBatDau && moment(rec?.hoatDongCtsv?.thoiGianBatDau).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thời gian kết thúc',
			align: 'center',
			width: 100,
			render: (val, rec) =>
				rec?.hoatDongCtsv?.thoiGianKetThuc && moment(rec?.hoatDongCtsv?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			align: 'center',
			width: 120,
			render: (val, rec) => rec?.trangThaiThamGia,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chi tiết' type='link' icon={<EyeOutlined />} onClick={() => handleEdit(rec)} />
					{danhSachXemSau?.find((items) => items?.sourceId === rec?._id)?._id ? (
						<ButtonExtend
							loading={loadingXemSau}
							type='link'
							danger
							icon={<CloseOutlined />}
							tooltip='Bỏ lưu'
							onClick={() => handleBoXemSau(danhSachXemSau?.find((items) => items?.sourceId === rec?._id))}
						/>
					) : (
						<ButtonExtend
							className='text-success'
							loading={loadingXemSau}
							type='link'
							icon={<CheckOutlined />}
							tooltip='Lưu'
							onClick={() => handleXemSau(rec)}
						/>
					)}
				</>
			),
		},
	];

	return (
		<Card title='Danh sách hoạt động công tác sinh viên'>
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
					<ButtonExtend onClick={() => getData()} icon={<ReloadOutlined />}>
						Tải lại
					</ButtonExtend>
				</div>
			</TableStaticData>

			<ModalChiTiet />
		</Card>
	);
};

export default SinhVienHoatDongCTSV;
