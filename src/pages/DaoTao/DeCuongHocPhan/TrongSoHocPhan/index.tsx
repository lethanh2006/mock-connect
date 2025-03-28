import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Descriptions, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TrongSoHocPhanPage = () => {
	const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
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

	const ts = danhSach.map((i) => (recDeCuong?.[('trongSo' + i.field) as keyof HocPhan.IDeCuongHocPhan] as number) ?? 0);
	const sum = _.sum(ts);

	useEffect(() => {
		if (!danhSach.length) getModel();
	}, []);

	return (
		<Descriptions title='Trọng số học phần' bordered column={1}>
			{thongTinTrongSo?.length
				? thongTinTrongSo?.map((item, index) => (
						<Descriptions.Item
							label={`Điểm thành phần ${index + 1} (${
								item.field && item.field > 0 ? danhSach[item.field - 1].ma : ''
							})`}
							// eslint-disable-next-line react/no-array-index-key
							key={index}
						>
							Mô tả:{' '}
							<b>{item?.moTa ?? danhSach.find((i) => i.field === item.field)?.ten ?? danhSach[index]?.ten ?? '--'}</b>
							<br />
							Trọng số: <b>{item?.trongSo}%</b>. Ngưỡng điểm đủ ĐKDT: <b>{item.nguongDiemDieuKien}</b>
							<br />
							Hình thức đánh giá: {item?.hinhThucDanhGia ?? '--'}
						</Descriptions.Item>
					))
				: null}

			<Descriptions.Item key={'2'} label='Điểm thi KTHP'>
				Trọng số: <b>{100 - sum}%</b> (Ngưỡng đạt: {recDeCuong?.nguongDiemDieuKienKthp ?? '--'}{' '}
				<Tooltip title='Sinh viên phải đạt điểm thi từ ngưỡng điểm trở lên mới đủ điều kiện đạt học phần'>
					<QuestionCircleOutlined />
				</Tooltip>
				)
			</Descriptions.Item>
		</Descriptions>
	);
};

export default TrongSoHocPhanPage;
