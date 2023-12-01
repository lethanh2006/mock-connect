import { Button, Descriptions, Modal, Tag } from 'antd';
import type { KhaiBaoQuyTrinh } from '@/services/KhaiBaoQuyTrinh/typings';
import type { TrangThaiTiepNhanDon } from '@/services/KhaiBaoQuyTrinh/constants';
import { MapColorTrangThaiTiepNhanDon } from '@/services/KhaiBaoQuyTrinh/constants';
import { useModel } from '@@/plugin-model/useModel';
import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { useState } from 'react';
import ThongTinThanhToan from '@/pages/TaiChinh/ChiTietThu/components/ThongTinThanhToan';

const ThongTinTiepNhan = (props: { data: KhaiBaoQuyTrinh.IBuocXuLy; modelName: any }) => {
	const { data, modelName } = props;
	const model = useModel(modelName);
	const { dataQuyTrinh }: any = model;
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const { record, getChiTietThuByIdentityCodeModel } = useModel('taichinh.chitietthu');
	return (
		<>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Trạng thái xử lý'>
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
				<Descriptions.Item label='Trạng thái thanh toán'>
					{' '}
					<Tag color={EMauTrangThaiThanhToanTable?.[dataQuyTrinh?.trangThaiThanhToan] ?? 'gray'}>
						{dataQuyTrinh?.trangThaiThanhToan
							? ETrangThaiThanhToan[dataQuyTrinh.trangThaiThanhToan]
							: 'Dịch vụ không tính phí'}
					</Tag>{' '}
					{dataQuyTrinh?.identityCode ? (
						<Button
							onClick={() => {
								getChiTietThuByIdentityCodeModel(dataQuyTrinh.identityCode);
								setVisibleModal(true);
							}}
							type='link'
							size='small'
						>
							(Xem chi tiết)
						</Button>
					) : (
						''
					)}
				</Descriptions.Item>
				<Descriptions.Item span={24} label='Ghi chú'>
					{data?.ghiChu}
				</Descriptions.Item>
			</Descriptions>
			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
				destroyOnClose
			>
				{record?._id ? <ThongTinThanhToan setVisible={setVisibleModal} /> : null}
			</Modal>
		</>
	);
};
export default ThongTinTiepNhan;
