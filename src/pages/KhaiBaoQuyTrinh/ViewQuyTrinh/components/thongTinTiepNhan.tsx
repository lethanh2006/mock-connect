import { Descriptions, Tag } from 'antd';
import type { KhaiBaoQuyTrinh } from '@/services/KhaiBaoQuyTrinh/typings';
import type { TrangThaiTiepNhanDon } from '@/services/KhaiBaoQuyTrinh/constants';
import { MapColorTrangThaiTiepNhanDon } from '@/services/KhaiBaoQuyTrinh/constants';
import { useModel } from '@@/plugin-model/useModel';

const ThongTinTiepNhan = (props: { data: KhaiBaoQuyTrinh.IBuocXuLy; modelName: any }) => {
	const { data, modelName } = props;
	const model = useModel(modelName);
	const { dataQuyTrinh } = model;
	return (
		<Descriptions column={2} bordered>
			<Descriptions.Item label='Trạng thái'>
				{' '}
				<Tag color={MapColorTrangThaiTiepNhanDon?.[data?.trangThaiTiepNhan as TrangThaiTiepNhanDon] ?? 'yellow'}>
					{data?.trangThaiTiepNhan}
				</Tag>
			</Descriptions.Item>
			<Descriptions.Item label='Bộ phận xử lý'>
				{
					dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find((item: { ma: string }) => item?.ma === data?.maBoPhanXuLy)
						?.ten
				}
			</Descriptions.Item>
			<Descriptions.Item span={24} label='Ghi chú'>
				{data?.ghiChu}
			</Descriptions.Item>
		</Descriptions>
	);
};
export default ThongTinTiepNhan;
