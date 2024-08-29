import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Descriptions } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const TrongSoHocPhanPage = () => {
	const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

	const ts = danhSach.map((i) => (recDeCuong?.[('trongSo' + i.field) as keyof HocPhan.IDeCuongHocPhan] as number) ?? 0);
	const sum = _.sum(ts);

	useEffect(() => {
		getModel();
	}, []);

	return (
		<Descriptions title='Trọng số học phần' bordered column={1}>
			{recDeCuong?.thongTinTrongSo?.length
				? recDeCuong?.thongTinTrongSo?.map((item, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<Descriptions.Item label={danhSach[index]?.ten} key={index}>
							{item?.trongSo}%.
							<br />
							Hình thức đánh giá: {item?.hinhThucDanhGia ?? '--'}
							<br />
							Mô tả: {item?.moTa ?? '--'}
						</Descriptions.Item>
				  ))
				: null}

			<Descriptions.Item key={'2'} label='Điểm thi KTHP'>
				{100 - sum}%
			</Descriptions.Item>
		</Descriptions>
	);
};

export default TrongSoHocPhanPage;
