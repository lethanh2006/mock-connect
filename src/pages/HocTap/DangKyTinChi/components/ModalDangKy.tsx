import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
	ColorTrangThaiDangKyTinChi,
	ETrangThaiDangKyTinChi,
	LoaiHocPhanDangKyTinChi,
	type ELoaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ModalDangKy = (props: { tongTinChi: number; danhSachDangKy: DangKyTinChi.ILopDangKy[] }) => {
	const { tongTinChi } = props;
	const {
		visibleRegister,
		setVisibleRegister,
		postDangKyTinChiModel,
		getPhieuDangKyModel,
		getLopDangKyModel,
		phieuDangKy,
		loading,
		dotDangKyHienTai,
	} = useModel('daotao.dotdangkytinchi');
	const [danhSachDangKy, setDanhSachDangKy] = useState<DangKyTinChi.ILopDangKy[]>([]); // Danh sách lớp mới thêm
	const [formSubmiting, setFormSubmiting] = useState<boolean>();
	const canRegister = danhSachDangKy.filter((item) => item.trangThai !== ETrangThaiDangKyTinChi.DA_DANG_KY).length > 0;

	const postDangKy = async () => {
		setFormSubmiting(true);

		// Với từng lớp mới chọn thì gọi 1 API đăng ký
		const promises = danhSachDangKy
			.filter((item) => item.trangThai !== ETrangThaiDangKyTinChi.DA_DANG_KY)
			.map((item, index) =>
				postDangKyTinChiModel({
					phieuDktcId: phieuDangKy?._id ?? '',
					dangKy: { lopHocPhanId: item._id, maKhoaNganh: item.maKhoaNganh ?? '' },
				})
					.then(() =>
						// Nếu thành công
						setDanhSachDangKy((p) => {
							const p1 = [...p];
							p1[index].trangThai = ETrangThaiDangKyTinChi.DA_DANG_KY;
							return p1;
						}),
					)
					.catch((e) =>
						setDanhSachDangKy((p) => {
							const p1 = [...p];
							p1[index].trangThai = ETrangThaiDangKyTinChi.LOI;
							p1[index].error = e.response?.data?.message;
							return p1;
						}),
					),
			);
		Promise.all(promises)
			.then()
			.finally(() => {
				message.info('Đã hoàn thành đăng ký');
				if (dotDangKyHienTai?._id) {
					getPhieuDangKyModel(dotDangKyHienTai._id); // Get lại thông tin phiếu đăng ký của kỳ hiện tại
					getLopDangKyModel(dotDangKyHienTai.maHocKy);
				}
				setFormSubmiting(false);
			});
	};

	useEffect(() => {
		// Lấy lại danh sách các lớp tín chỉ mới chọn
		if (visibleRegister)
			setDanhSachDangKy(props.danhSachDangKy.filter((item) => item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY));
	}, [visibleRegister]);

	const onRegister = () => {
		// Set trạng thái về chưa đăng ký
		setDanhSachDangKy(
			[...danhSachDangKy].map((item) => ({
				...item,
				trangThai: item.trangThai === ETrangThaiDangKyTinChi.LOI ? ETrangThaiDangKyTinChi.CHUA_DANG_KY : item.trangThai,
			})),
		);
		Modal.confirm({
			title: 'Xác nhận đăng ký',
			content: (
				<>
					Xác nhận đăng ký các lớp tín chỉ đã chọn?
					{tongTinChi < (phieuDangKy?.soTinChiToiThieu ?? 0) ? (
						<div style={{ color: 'orange' }}>
							Lưu ý: Tổng số tín chỉ đăng ký hiện tại đang thấp hơn quy định số tín chỉ tối thiểu đăng ký trong học kỳ!
						</div>
					) : null}
				</>
			),
			onOk: postDangKy,
		});
	};

	const columns: IColumn<DangKyTinChi.ILopDangKy>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 170,
		},
		{
			title: 'Lớp tín chỉ',
			dataIndex: 'ten',
			width: 150,
		},
		{
			title: 'Mã khóa ngành',
			dataIndex: 'maKhoaNganh',
			align: 'center',
			width: 100,
		},
		{
			title: 'Loại ĐK',
			dataIndex: 'loai',
			width: 120,
			render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 170,
			align: 'center',
			render: (val: ETrangThaiDangKyTinChi, rec) =>
				formSubmiting && val === ETrangThaiDangKyTinChi.CHUA_DANG_KY ? (
					<SyncOutlined spin className='text-info' />
				) : (
					<>
						<Tag color={ColorTrangThaiDangKyTinChi[val]}>{val}</Tag>
						{rec.error ? (
							<div>
								<i>{rec.error}</i>
							</div>
						) : null}
					</>
				),
		},
	];

	return (
		<Modal
			visible={visibleRegister}
			closable={false}
			footer={null}
			width={1000}
			bodyStyle={{ padding: 0 }}
			maskClosable={false}
		>
			<Card title='Danh sách đăng ký mới'>
				<TableStaticData
					columns={columns}
					data={danhSachDangKy}
					addStt
					loading={loading}
					otherProps={{ pagination: false, scoll: { y: 600 } }}
				/>

				<div className='form-footer'>
					<Button onClick={onRegister} type='primary' loading={formSubmiting} disabled={!canRegister}>
						Xác nhận
					</Button>
					<Button onClick={() => setVisibleRegister(false)} disabled={formSubmiting}>
						Đóng
					</Button>
				</div>
			</Card>
		</Modal>
	);
};

export default ModalDangKy;
