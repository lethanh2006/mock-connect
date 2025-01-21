import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiThi, EDKDTCongNo, EDKDTKetQuaHocTap, ETrangThaiThi } from '@/services/KhaoThi/constant';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { InfoCircleFilled } from '@ant-design/icons';
import { Popover, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DiemThiHocKy = (props: { maHocKy: string; maHocPhan: string }) => {
	const { maHocKy, maHocPhan } = props;
	const { loading, getDiemThiHocKySinhVienModel } = useModel('khaothi.sinhvienthi');
	const [diemThiHocKySinhVien, setDiemThiHocKySinhVien] = useState<SinhVienThi.IDiemThiHocKySinhVien[]>([]);

	useEffect(() => {
		if (maHocKy && maHocPhan) {
			getDiemThiHocKySinhVienModel(maHocKy, maHocPhan).then((res) => setDiemThiHocKySinhVien(res));
		}
	}, []);

	const columns: IColumn<SinhVienThi.IDiemThiHocKySinhVien>[] = [
		{
			title: 'Kỳ thi',
			width: 250,
			render: (val, rec) => rec?.kyThi?.ten ?? '--',
		},
		{
			title: 'Hình thức thi',
			width: 120,
			render: (val, rec) => rec?.hocPhanThi?.tenHinhThucThi ?? '--',
		},
		{
			title: 'Số báo danh',
			align: 'center',
			width: 80,
			render: (val, rec) => rec?.sinhVienThi?.sbd ?? '--',
		},
		{
			title: 'Trạng thái',
			align: 'center',
			width: 120,
			render: (val, rec) => {
				const trangThai = rec?.sinhVienThi?.trangThai ?? '--';
				const trangThaiColor = colorTrangThaiThi[trangThai as ETrangThaiThi];

				let extraInfo = null;

				if (trangThai === ETrangThaiThi.KHONG_DU) {
					const dieuKienCongNo = rec?.sinhVienThi?.dieuKienCongNo;
					const dieuKienHocTap = rec?.sinhVienThi?.dieuKienKetQuaHocTap;

					if (dieuKienCongNo !== EDKDTCongNo.DU) {
						extraInfo = dieuKienCongNo;
					} else if (dieuKienHocTap !== EDKDTKetQuaHocTap.DAT) {
						extraInfo = dieuKienHocTap;
					}
				}

				return (
					<Tag color={trangThaiColor}>
						{trangThai} {extraInfo ? `(${extraInfo})` : null}
					</Tag>
				);
			},
		},
		{
			title: 'Điểm thi',
			dataIndex: 'diemThi',
			align: 'center',
			width: 100,
			render: (val, rec) => (
				<>
					{val ?? '--'}{' '}
					<Popover
						content={
							<div>
								{(rec?.hocPhanThi?.danhSachDiemThanhPhan?.length ?? 0) > 0
									? rec.hocPhanThi.danhSachDiemThanhPhan.map((item, index) => (
											// eslint-disable-next-line react/no-array-index-key
											<p key={index}>{`${item.tenDauDiem}: ${
												rec?.sinhVienThi?.ketQuaChamChinhThuc?.danhSachDiem?.[0]?.diemThanhPhan?.[index] ?? '--'
											}`}</p>
									  ))
									: rec?.sinhVienThi?.ketQuaChamChinhThuc?.danhSachDiem?.[0]?.diemThanhPhan?.map(
											(item: any, index: number) => (
												// eslint-disable-next-line react/no-array-index-key
												<p key={index}>
													Câu {index + 1}: {item}
												</p>
											),
									  )}
							</div>
						}
						title='Chi tiết'
					>
						<ButtonExtend type='link' icon={<InfoCircleFilled />} />
					</Popover>
				</>
			),
		},
		{
			title: 'Điểm phúc khảo',
			dataIndex: 'diemPhucKhao',
			align: 'center',
			width: 100,
			render: (val, rec) => val ?? '--',
		},
	];

	return (
		<TableStaticData
			addStt
			data={diemThiHocKySinhVien}
			columns={columns}
			size='small'
			loading={loading}
			otherProps={{ pagination: false, scroll: { y: 150 } }}
		/>
	);
};

export default DiemThiHocKy;
