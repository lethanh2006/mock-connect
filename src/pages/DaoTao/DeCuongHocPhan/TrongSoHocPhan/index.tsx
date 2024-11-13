import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Descriptions } from 'antd';
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
						// eslint-disable-next-line react/no-array-index-key
						<Descriptions.Item label={`Điểm thành phần ${index + 1}`} key={index}>
							Mô tả: {item?.moTa ?? danhSach.find((i) => i.field === item.field)?.ten ?? danhSach[index]?.ten ?? '--'}
							<br />
							Trọng số: <b>{item?.trongSo}%</b>
							<br />
							Hình thức đánh giá: {item?.hinhThucDanhGia ?? '--'}
						</Descriptions.Item>
				  ))
				: null}

			<Descriptions.Item key={'2'} label='Điểm thi KTHP'>
				Trọng số: <b>{100 - sum}%</b>
			</Descriptions.Item>
		</Descriptions>
	);
};

export default TrongSoHocPhanPage;
