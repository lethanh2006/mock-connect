import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Descriptions, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TrongSoHocPhanPage = () => {
	const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
	const { danhSach: danhSachHinhThucThi, getAllModel: getAllHinhThucThi } = useModel('khaothi.hinhthucthi');

	const thongTinTrongSo = recDeCuong?.thongTinTrongSo ?? [];
	if (!thongTinTrongSo.length) {
		for (let i = 1; i <= danhSach.length; i++) {
			if (recDeCuong?.[`trongSo${i}` as keyof HocPhan.IDeCuongHocPhan])
				thongTinTrongSo.push({
					trongSo: recDeCuong?.[`trongSo${i}` as keyof HocPhan.IDeCuongHocPhan] as number,
					field: i,
					nguongDiemDieuKien: 0.1,
				});
		}
	}
	const thongTinTrongSoThi = recDeCuong?.thongTinTrongSoThi ?? [];
	if (!thongTinTrongSoThi.length) {
		for (let i = 1; i <= 5; i++) {
			if (recDeCuong?.[`trongSoThi${i}` as keyof HocPhan.IDeCuongHocPhan])
				thongTinTrongSoThi.push({
					trongSo: recDeCuong?.[`trongSoThi${i}` as keyof HocPhan.IDeCuongHocPhan] as number,
					field: i,
					nguongDiemDieuKien: 0.1,
				});
		}
	}

	const ts = danhSach.map((i) => (recDeCuong?.[('trongSo' + i.field) as keyof HocPhan.IDeCuongHocPhan] as number) ?? 0);
	const trongSoThanhPhan = _.sum(ts);
	if (!thongTinTrongSoThi.length)
		thongTinTrongSoThi.push({
			trongSo: 100 - trongSoThanhPhan,
			field: 1,
			nguongDiemDieuKien: recDeCuong?.nguongDiemDieuKienKthp ?? 0.1,
		});

	useEffect(() => {
		if (!danhSach.length) getModel();
		if (!danhSachHinhThucThi.length) getAllHinhThucThi();
	}, []);

	return (
		<Descriptions
			title={
				<>
					Trọng số đánh giá học phần{' '}
					<Tooltip title='Sinh viên phải đạt điểm từ điểm tối thiểu (ngưỡng điểm) trở lên mới đủ điều kiện đạt học phần'>
						<QuestionCircleOutlined />
					</Tooltip>
				</>
			}
			column={1}
			bordered
		>
			{thongTinTrongSo?.map((item, index) => (
				<Descriptions.Item
					label={`Điểm thành phần ${index + 1} (${item.field > 0 ? danhSach[item.field - 1]?.ma : ''})`}
					key={item.field ?? index}
				>
					Trọng số: <b>{item?.trongSo}%</b>. Điểm tối thiểu: <b>{item.nguongDiemDieuKien}</b>
					<br />
					Mô tả: {item?.moTa ?? danhSach.find((i) => i.field === item.field)?.ten ?? danhSach[index]?.ten ?? '--'}. Hình
					thức đánh giá: {item?.hinhThucDanhGia ?? '--'}
				</Descriptions.Item>
			))}

			{thongTinTrongSoThi?.map((item, index) => (
				<Descriptions.Item label={`Điểm thi ${index + 1}`} key={item.field ?? index}>
					Trọng số: <b>{item?.trongSo}%</b>. Điểm tối thiểu: <b>{item.nguongDiemDieuKien}</b>
					<br />
					Mô tả: {item?.moTa ?? danhSach.find((i) => i.field === item.field)?.ten ?? danhSach[index]?.ten ?? '--'}. Hình
					thức đánh giá:{' '}
					{item?.hinhThucDanhGia ? danhSachHinhThucThi.find((i) => i._id === item.hinhThucDanhGia)?.ten : '--'}
				</Descriptions.Item>
			))}
		</Descriptions>
	);
};

export default TrongSoHocPhanPage;
