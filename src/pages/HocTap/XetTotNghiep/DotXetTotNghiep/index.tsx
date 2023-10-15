import { Alert, Button, Card, Empty, Popconfirm } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalYKien from './ModalYKien';
import { CloseOutlined, FormOutlined } from '@ant-design/icons';

const CardXetTotNghiep = () => {
	const { formSubmiting, record, dangKyXetTotNghiepModel, setVisibleForm } = useModel('sinhvien.xettotnghiep');
	const [type, setType] = useState<'phan-hoi' | 'hoan'>('phan-hoi');

	const handleRegister = () => record?._id && dangKyXetTotNghiepModel(record._id).catch((er) => console.log(er));

	const handleHoan = () => {
		setType('hoan');
		setVisibleForm(true);
	};

	const handlePhanHoi = () => {
		setType('phan-hoi');
		setVisibleForm(true);
	};

	return (
		<Card title='Xét tốt nghiệp'>
			<Empty description='Không có đợt xét tốt nghiệp' style={{ marginBottom: 32, marginTop: 32 }} />

			<Alert
				description={
					<>
						Đợt xét tốt nghiệp <b>Đợt 1 năm 2023</b> đang diễn ra
					</>
				}
			/>
			<div>
				Bạn nằm trong danh sách xét tốt nghiệp đợt này.
				<br />
				Kết quả rà soát sơ bộ: <b>Không đủ điều kiện</b>
				<br />
				Lý do: Điểm trung bình nhỏ hơn mức tối thiểu.
			</div>

			<div className='form-footer'>
				{/* Không trong đợt */}
				<Popconfirm title='Xác nhận đăng ký xét tốt nghiệp đợt này?' onConfirm={handleRegister}>
					<Button loading={formSubmiting} icon={<FormOutlined />}>
						Đăng ký xét tốt nghiệp
					</Button>
				</Popconfirm>

				{/* Trong đợt xét */}
				<Button onClick={handlePhanHoi} icon={<FormOutlined />}>
					Gửi phản hồi
				</Button>
				{/* Đủ điều kiện xét tốt nghiệp */}
				<Button onClick={handleHoan} danger icon={<CloseOutlined />}>
					Yêu cầu hoãn tốt nghiệp
				</Button>
			</div>

			<ModalYKien type={type} />
		</Card>
	);
};

export default CardXetTotNghiep;
