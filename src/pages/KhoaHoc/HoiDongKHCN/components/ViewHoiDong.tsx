import type { HoiDongKHCN } from '@/services/KhoaHoc/HoiDongKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { Button, Descriptions, Modal, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import TableDeTaiHoiDong from './DeTaiHoiDong';
import TableThanhVien from '../../DeTaiKHCN/components/TableThanhVien';

const ViewHoiDong = (props: { rec: HoiDongKHCN.IRecord; zIndex?: number }) => {
	const { visibleViewDetail, setVisibleViewDetail } = useModel('khoahoc.hoidongkhcn');

	const handleCancel = () => {
		setVisibleViewDetail(false);
	};

	const { rec } = props;

	return (
		<Modal
			zIndex={props?.zIndex}
			width={1100}
			title='Thông tin hội đồng'
			visible={visibleViewDetail}
			onCancel={handleCancel}
			footer={
				<Button type='primary' onClick={handleCancel}>
					OK
				</Button>
			}
		>
			<Descriptions column={{ xs: 3, sm: 3, md: 3, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={6} label='Tên hội đồng'>
					{rec.ten}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Ngày tổ chức'>
					{moment(rec.thoiGianBatDau).format('HH:mm DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Địa điểm'>
					{rec.diaDiem}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Quyết định thành lập hội đồng'>
					{rec.quyetDinhThanhLapHoiDong && (
						<Tag color={primaryColor}>
							<a target='_blank' href={rec.quyetDinhThanhLapHoiDong} rel='noreferrer'>
								Xem tập tin
							</a>
						</Tag>
					)}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Biên bản họp hội đồng'>
					{rec?.bienBanUrl?.map((item) => (
						<Tag key={item} color={primaryColor}>
							<a target='_blank' href={item} rel='noreferrer'>
								Xem tập tin
							</a>
						</Tag>
					))}
				</Descriptions.Item>
			</Descriptions>
			{/* <b>Danh sách thành viên hội đồng</b>
			<TableThanhVien data={rec.danhSachThanhVien} mode='view' type='HoiDong' fieldName='danhSachThanhVien' />
			<br /> */}
			<b>Danh sách thành viên tham gia</b>
			<TableThanhVien
				data={rec.danhSachThanhVienThamGia}
				mode='view'
				type='HoiDong'
				fieldName='danhSachThanhVienThamGia'
			/>
			<br />
			<b>Danh sách đề tài NCKH</b>
			<TableDeTaiHoiDong type={rec.loaiHoiDongKhcn} mode='view' data={rec.danhSachDeTai} />
		</Modal>
	);
};

export default ViewHoiDong;
