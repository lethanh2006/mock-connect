import { EDoiTuongKeHoachNCKH } from '@/services/KeHoachNCKH/constants';
import type { KeHoachNCKH } from '@/services/KeHoachNCKH/typings';
import { Card, Typography } from 'antd';

const ViewDetailKeHoachNCKH = (props: { record: KeHoachNCKH.IRecord }) => {
	const danhSachNoiDung = [...(props?.record?.danhSachKhoiNoiDung ?? [])];

	const canCu =
		props.record.doiTuong === EDoiTuongKeHoachNCKH.CAN_BO_GV ? danhSachNoiDung.shift() : danhSachNoiDung.pop();

	return (
		<Card title='Chi tiết kế hoạch'>
			<div style={{ textAlign: 'center' }}>
				<Typography.Title level={3}>{props.record.ten}</Typography.Title>
			</div>
			{props.record.doiTuong === EDoiTuongKeHoachNCKH.CAN_BO_GV && canCu && (
				<div key={canCu.tieuDe}>
					<Typography.Title level={4}>
						I. Căn cứ xây dựng Định hướng nghiên cứu khoa học và công nghệ Học viện Phụ nữ Việt Nam
					</Typography.Title>
					{canCu.noiDung && <div dangerouslySetInnerHTML={{ __html: canCu.noiDung }} />}
				</div>
			)}
			<Typography.Title level={4}>
				{canCu
					? 'II. Định hướng nghiên cứu khoa học và công nghệ'
					: 'I. Danh mục vấn đề nghiên cứu khoa học sinh viên trong các ngành, lĩnh vực sau:'.toUpperCase()}
			</Typography.Title>
			{danhSachNoiDung?.map((item, index) => (
				<div key={item.tieuDe}>
					<Typography.Title level={5}>
						{index + 1}. {item.tieuDe}
					</Typography.Title>
					{item.noiDung && <div dangerouslySetInnerHTML={{ __html: item.noiDung }} />}
				</div>
			))}
			{props.record.doiTuong === EDoiTuongKeHoachNCKH.SINH_VIEN && canCu && (
				<div key={canCu.tieuDe}>
					<Typography.Title level={4}>II. THỜI GIAN VÀ MỨC HỖ TRỢ THỰC HIỆN</Typography.Title>
					{canCu.noiDung && <div dangerouslySetInnerHTML={{ __html: canCu.noiDung }} />}
				</div>
			)}
		</Card>
	);
};

export default ViewDetailKeHoachNCKH;
