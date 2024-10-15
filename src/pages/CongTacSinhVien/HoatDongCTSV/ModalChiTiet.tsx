import { Descriptions, Modal } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ModalChiTiet = () => {
	const { record, visibleForm, setVisibleForm } = useModel('sukien.sinhvienhoatdongctsv');
	const { danhSach: danhSachHocKy } = useModel('daotao.hocky');

	return (
		<Modal title='Chi tiết hoạt động' visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null}>
			<Descriptions column={1}>
				<Descriptions.Item label='Tên hoạt động'>{record?.hoatDongCtsv?.ten ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Loại'>{record?.hoatDongCtsv?.loai ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Học kỳ'>
					{danhSachHocKy?.find((item) => item?.ma === record?.hoatDongCtsv?.maHocKy)?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Số lượng tham gia'>{record?.hoatDongCtsv?.soLuongThamGia}</Descriptions.Item>
				<Descriptions.Item label='Thời gian bắt đầu'>
					{record?.hoatDongCtsv?.thoiGianBatDau
						? moment(record?.hoatDongCtsv?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian kết thúc'>
					{record?.hoatDongCtsv?.thoiGianKetThuc
						? moment(record?.hoatDongCtsv?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Địa điểm'>{record?.hoatDongCtsv?.diaDiem ?? '--'}</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ModalChiTiet;
