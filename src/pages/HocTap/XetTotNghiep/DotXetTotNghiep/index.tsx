import {
	EKetQuaXetTotNghiep,
	ELoaiDoiTuongXetTotNghiep,
	colorKetQuaXetTotNghiep,
	colorTrangThaiXetTotNghiep,
} from '@/services/HocTap/XetTotNghiep/constant';
import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Descriptions, Empty, Popconfirm, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalYKien from './ModalYKien';
import moment from 'moment';

const CardXetTotNghiep = () => {
	const { formSubmiting, record, dangKyXetTotNghiepModel, setVisibleForm, getDotHienHanhModel } =
		useModel('sinhvien.xettotnghiep');
	const { dieuKienTotNghiep } = useModel('sinhvien.tientrinhtotnghiep');
	const [type, setType] = useState<'phan-hoi' | 'hoan'>('phan-hoi');
	const isQuaNgayChotSanhSach = record?.ngayChotDanhSach && moment().isAfter(record?.ngayChotDanhSach);

	useEffect(() => {
		getDotHienHanhModel();
	}, []);

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
			{!record?._id ? (
				<Empty
					description='Không có đợt xét tốt nghiệp trong thời điểm hiện tại !'
					style={{ marginBottom: 32, marginTop: 32 }}
				/>
			) : (
				<>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Alert
								description={
									<>
										Đợt xét tốt nghiệp <b>{record?.ten}</b> đang diễn ra{' '}
										{record?.ngayChotDanhSach ? (
											<>
												, ngày chốt danh sách sinh viên <b>{moment(record?.ngayChotDanhSach).format('DD/MM/YYYY')}</b>
											</>
										) : null}
									</>
								}
							/>
						</Col>

						{record?.ketQuaXetTotNghiep?._id ? (
							<>
								<Col span={24}>Bạn có trong danh sách xét tốt nghiệp đợt này.</Col>
								<Descriptions column={{ xs: 1, sm: 1, md: 1 }}>
									{record.ketQuaXetTotNghiep?.ketQua ? (
										<Descriptions.Item label='Kết quả rà soát sơ bộ'>
											<Tag color={colorKetQuaXetTotNghiep[record.ketQuaXetTotNghiep?.ketQua]}>
												{record?.ketQuaXetTotNghiep?.ketQua}
											</Tag>
										</Descriptions.Item>
									) : null}

									{record?.ketQuaXetTotNghiep?.ketQua === EKetQuaXetTotNghiep.KHONG_DU_DK ? (
										<Descriptions.Item label='Lý do'>{record?.ketQuaXetTotNghiep?.lyDo}</Descriptions.Item>
									) : null}

									{record?.ketQuaXetTotNghiep?.yKienSinhVien ? (
										<Descriptions.Item label='Ý kiến phản hồi'>
											{record?.ketQuaXetTotNghiep?.yKienSinhVien}
										</Descriptions.Item>
									) : null}

									{record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.HOAN ||
									record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.NHU_CAU ? (
										<>
											<Descriptions.Item>
												{record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.HOAN
													? 'Bạn đã đăng ký hoãn xét tốt nghiệp đợt này'
													: 'Bạn đã đăng ký xét tốt nghiệp đợt này theo nhu cầu'}
											</Descriptions.Item>

											{record.ketQuaXetTotNghiep?.trangThaiDuyet ? (
												<Descriptions.Item label='Trạng thái'>
													<Tag color={colorTrangThaiXetTotNghiep[record.ketQuaXetTotNghiep?.trangThaiDuyet]}>
														{record?.ketQuaXetTotNghiep?.trangThaiDuyet}
													</Tag>
												</Descriptions.Item>
											) : null}
										</>
									) : null}
								</Descriptions>
							</>
						) : (
							<Col span={24}>Bạn không có trong đợt xét tốt nghiệp này</Col>
						)}
					</Row>

					{dieuKienTotNghiep?.isDuKieuKien || isQuaNgayChotSanhSach ? (
						<div className='form-footer'>
							{!record?.ketQuaXetTotNghiep?._id ? (
								<>
									<Popconfirm title='Xác nhận đăng ký xét tốt nghiệp đợt này?' onConfirm={handleRegister}>
										<Button loading={formSubmiting} icon={<FormOutlined />}>
											Đăng ký xét tốt nghiệp
										</Button>
									</Popconfirm>
								</>
							) : record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.DUNG_TIEN_DO ? (
								<>
									Trong đợt xét
									<Button onClick={handlePhanHoi} icon={<FormOutlined />}>
										Gửi phản hồi
									</Button>
									Đủ điều kiện xét tốt nghiệp
									{record?.ketQuaXetTotNghiep?.ketQua === EKetQuaXetTotNghiep.DU_DK ? (
										<Button onClick={handleHoan} danger icon={<CloseOutlined />}>
											Yêu cầu hoãn tốt nghiệp
										</Button>
									) : null}
								</>
							) : null}
						</div>
					) : null}
				</>
			)}

			<ModalYKien type={type} />
		</Card>
	);
};

export default CardXetTotNghiep;
