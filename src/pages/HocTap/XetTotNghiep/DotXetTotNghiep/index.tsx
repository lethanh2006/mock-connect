import { ETrangThaiHocSv } from '@/services/DaoTao/constant';
import {
	EKetQuaXetTotNghiep,
	ELoaiDoiTuongXetTotNghiep,
	colorKetQuaXetTotNghiep,
	colorTrangThaiXetTotNghiep,
} from '@/services/HocTap/XetTotNghiep/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { CloseOutlined, FormOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Descriptions, Empty, Popconfirm, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalYKien from './ModalYKien';

const CardXetTotNghiep = () => {
	const intl = useIntl();
	const { formSubmiting, record, dangKyXetTotNghiepModel, setVisibleForm, getDotHienHanhModel, loading } =
		useModel('sinhvien.xettotnghiep');
	const { dieuKienTotNghiep } = useModel('sinhvien.tientrinhtotnghiep');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [type, setType] = useState<'phan-hoi' | 'hoan'>('phan-hoi');
	const isQuaNgayChotSanhSach = !!record?.ngayChotDanhSach && dayjs().isAfter(dayjs(record?.ngayChotDanhSach), 'day');

	useEffect(() => {
		if (!record?._id) getDotHienHanhModel();
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
		<Card title={intl.formatMessage({ id: 'xettotnghiep.title' })} loading={loading}>
			{!record?._id ? (
				<Empty
					description={intl.formatMessage({ id: 'xettotnghiep.empty.khongcodotxet' })}
					style={{ marginBottom: 32, marginTop: 32 }}
				/>
			) : (
				<>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Alert
								type='info'
								message={
									<>
										{intl.formatMessage(
											{ id: 'xettotnghiep.alert.dotxettotnghiep' },
											{
												ten: record?.ten,
												b: (chunks) => <b>{chunks}</b>,
											},
										)}
										{record?.ngayChotDanhSach ? (
											<>
												,
												{intl.formatMessage(
													{ id: 'xettotnghiep.alert.ngaychotdanhsach' },
													{
														ngay: formatDate(record?.ngayChotDanhSach),
														b: (chunks) => <b>{chunks}</b>,
													},
												)}{' '}
											</>
										) : null}
									</>
								}
							/>
						</Col>

						{record?.ketQuaXetTotNghiep?._id ? (
							<>
								<Col span={24}>{intl.formatMessage({ id: 'xettotnghiep.description.danhsachxettotnghiep' })}</Col>
								<Descriptions column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}>
									{record.ketQuaXetTotNghiep?.ketQua ? (
										<Descriptions.Item label={intl.formatMessage({ id: 'xettotnghiep.description.ketquasobo' })}>
											<Tag color={colorKetQuaXetTotNghiep[record.ketQuaXetTotNghiep?.ketQua]}>
												{record?.ketQuaXetTotNghiep?.ketQua}
											</Tag>
										</Descriptions.Item>
									) : null}

									{record?.ketQuaXetTotNghiep?.ketQua === EKetQuaXetTotNghiep.KHONG_DU_DK ? (
										<Descriptions.Item label={intl.formatMessage({ id: 'xettotnghiep.description.lydo' })}>
											{record?.ketQuaXetTotNghiep?.lyDo}
										</Descriptions.Item>
									) : null}

									{record?.ketQuaXetTotNghiep?.yKienSinhVien ? (
										<Descriptions.Item label={intl.formatMessage({ id: 'xettotnghiep.description.ykienphanhoi' })}>
											{record?.ketQuaXetTotNghiep?.yKienSinhVien}
										</Descriptions.Item>
									) : null}

									{record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.HOAN ||
									record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.NHU_CAU ? (
										<>
											<Descriptions.Item>
												{record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.HOAN
													? intl.formatMessage({ id: 'xettotnghiep.description.alert.hoanxettotnghiep' })
													: intl.formatMessage({ id: 'xettotnghiep.description.alert.dadangkyxettotnghiep' })}
											</Descriptions.Item>

											{record.ketQuaXetTotNghiep?.trangThaiDuyet ? (
												<Descriptions.Item label={intl.formatMessage({ id: 'xettotnghiep.description.trangthai' })}>
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
							<Col span={24}>{intl.formatMessage({ id: 'xettotnghiep.description.alert.khongcotrongdotxettn' })}</Col>
						)}
					</Row>

					{recSinhVien?.trangThaiHoc === ETrangThaiHocSv.DANG_HOC &&
					dieuKienTotNghiep?.isDuKieuKien &&
					!isQuaNgayChotSanhSach ? (
						<div className='form-footer'>
							{!record?.ketQuaXetTotNghiep?._id ? (
								<>
									<Popconfirm
										title={intl.formatMessage({ id: 'xettotnghiep.confirm.xacnhandangky' })}
										onConfirm={handleRegister}
									>
										<Button loading={formSubmiting} icon={<FormOutlined />}>
											{intl.formatMessage({ id: 'xettotnghiep.btn.dangkyxettn' })}
										</Button>
									</Popconfirm>
								</>
							) : record?.ketQuaXetTotNghiep?.loaiDoiTuong === ELoaiDoiTuongXetTotNghiep.DUNG_TIEN_DO ? (
								<>
									{/* Trong đợt xét */}
									<Button onClick={handlePhanHoi} icon={<FormOutlined />}>
										{intl.formatMessage({ id: 'xettotnghiep.btn.guiphanhoi' })}
									</Button>
									{/* Đủ điều kiện xét tốt nghiệp */}
									{record?.ketQuaXetTotNghiep?.ketQua === EKetQuaXetTotNghiep.DU_DK ? (
										<Button onClick={handleHoan} danger icon={<CloseOutlined />}>
											{intl.formatMessage({ id: 'xettotnghiep.btn.yeucauhoantn' })}
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
