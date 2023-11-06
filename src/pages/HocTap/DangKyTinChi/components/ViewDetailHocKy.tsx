import { Descriptions } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { tinhChatDangKyTC } from '@/services/DaoTao/DangKyTinChi/constant';

const ViewDetailHocKy = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

	return (
		<Descriptions style={{ maxWidth: 400 }} column={1}>
			<Descriptions.Item label='Tên học kỳ'>{recHocKy?.ten}</Descriptions.Item>
			<Descriptions.Item label='Số tuần học'>{recHocKy?.soTuan}</Descriptions.Item>
			<Descriptions.Item label='Thời gian bắt đầu học kỳ'>
				{recHocKy?.thoiGianBatDau ? moment(recHocKy.thoiGianBatDau).format('DD/MM/YYYY') : null}
			</Descriptions.Item>
			{dotDangKyHienTai ? (
				<>
					<Descriptions.Item label='Tên đợt đăng ký học phần'>{dotDangKyHienTai.ten}</Descriptions.Item>
					<Descriptions.Item label='Tính chất đợt'>
						{tinhChatDangKyTC?.[dotDangKyHienTai.tinhChatDangKy]}
					</Descriptions.Item>
				</>
			) : null}
		</Descriptions>
	);
};

export default ViewDetailHocKy;
