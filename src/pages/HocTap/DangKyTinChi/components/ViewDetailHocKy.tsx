import dayjs from '@/utils/dayjs';
import { Descriptions } from 'antd';
import { useIntl, useModel } from 'umi';

const ViewDetailHocKy = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { dotDangKyHienTai } = useModel('daotao.dotdangkytinchi');

	return (
		<Descriptions style={{ maxWidth: 400 }} column={1}>
			<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.chitiethocky.description.tenhocky' })}>
				{recHocKy?.ten}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.chitiethocky.description.sotuanhoc' })}>
				{recHocKy?.soTuan}
			</Descriptions.Item>
			<Descriptions.Item
				label={intl.formatMessage({ id: 'dangkytinchi.chitiethocky.description.thoigianbatdauhocky' })}
			>
				{recHocKy?.thoiGianBatDau ? dayjs(recHocKy.thoiGianBatDau).format('DD/MM/YYYY') : null}
			</Descriptions.Item>
			{dotDangKyHienTai ? (
				<>
					<Descriptions.Item
						label={intl.formatMessage({ id: 'dangkytinchi.chitiethocky.description.tendotdangkytinchi' })}
					>
						{dotDangKyHienTai.ten}
					</Descriptions.Item>
					{/* <Descriptions.Item label='Tính chất đợt'>
						{tinhChatDangKyTC?.[dotDangKyHienTai.tinhChatDangKy]}
					</Descriptions.Item> */}
				</>
			) : null}
		</Descriptions>
	);
};

export default ViewDetailHocKy;
