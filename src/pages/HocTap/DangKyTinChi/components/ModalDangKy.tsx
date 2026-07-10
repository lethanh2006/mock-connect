import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ColorTrangThaiDangKyTinChi, ETrangThaiDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, message, Modal, Space, Tag } from 'antd';
import pLimit from 'p-limit';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalDangKy = (props: { tongTinChi: number; danhSachDangKy: DangKyTinChi.ILopDangKy[] }) => {
	const intl = useIntl();
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

		const isInvalidData = danhSachDangKy.some((item) => !item.maKhoaNganh);

		if (isInvalidData) {
			message.error('Dữ liệu không chính xác, vui lòng tải lại trang');
			setFormSubmiting(false);
			return;
		}

		const limit = pLimit(1); // Giới hạn 1 truy vấn cùng lúc

		// Với từng lớp mới chọn thì gọi 1 API đăng ký
		const promises = danhSachDangKy.map((item, index) =>
			limit(() => {
				if (item.trangThai !== ETrangThaiDangKyTinChi.DA_DANG_KY)
					postDangKyTinChiModel(
						{
							phieuDktcId: phieuDangKy?._id ?? '',
							dangKy: { lopHocPhanId: item._id, maKhoaNganh: item.maKhoaNganh ?? '' },
						},
						intl.formatMessage({ id: 'dangkytinchi.thongbao.dangky' }),
					)
						.then((res) =>
							// Nếu thành công
							setDanhSachDangKy((p) => {
								const p1 = [...p];
								p1[index].trangThai = !res?.trangThai ? ETrangThaiDangKyTinChi.DA_DANG_KY : res?.trangThai;
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
						);
			}),
		);
		Promise.all(promises)
			.then()
			.finally(() => {
				setTimeout(() => {
					// message.info(intl.formatMessage({ id: 'dangkytinchi.modaldangky.success.hoanthanhdangky' }));
					if (dotDangKyHienTai?._id) {
						getPhieuDangKyModel(dotDangKyHienTai._id); // Get lại thông tin phiếu đăng ký của kỳ hiện tại
						getLopDangKyModel(dotDangKyHienTai.maHocKy);
					}
					setFormSubmiting(false);
				}, 1000);
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
			title: intl.formatMessage({ id: 'dangkytinchi.modaldangky.dangky.title' }),
			content: (
				<>
					{intl.formatMessage({ id: 'dangkytinchi.modaldangky.dangky.alert' })}
					{tongTinChi < (phieuDangKy?.soTinChiToiThieu ?? 0) ? (
						<div style={{ color: 'orange' }}>
							{intl.formatMessage({ id: 'dangkytinchi.modaldangky.dangky.warning' })}
						</div>
					) : null}
				</>
			),
			onOk: async () => {
				await postDangKy();
			},
		});
	};

	const columns: IColumn<DangKyTinChi.ILopDangKy>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modaldangky.dangky.title' }),
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modaldangky.columntable.tenhocphan' }),
			dataIndex: ['hocPhan', 'ten'],
			width: 170,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modaldangky.columntable.loptinchi' }),
			dataIndex: 'ten',
			width: 150,
		},
		// {
		// 	title: 'Mã khóa ngành',
		// 	dataIndex: 'maKhoaNganh',
		// 	align: 'center',
		// 	width: 120,
		// },
		// {
		// 	title: 'Loại ĐK',
		// 	dataIndex: 'loai',
		// 	width: 120,
		// 	render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
		// },
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modaldangky.columntable.trangthai' }),
			dataIndex: 'trangThai',
			width: 170,
			align: 'center',
			render: (val, rec) =>
				formSubmiting && val === ETrangThaiDangKyTinChi.CHUA_DANG_KY ? (
					<SyncOutlined spin className='text-info' />
				) : (
					<>
						<Space wrap>
							<Tag color={ColorTrangThaiDangKyTinChi[val as ETrangThaiDangKyTinChi]}>{val}</Tag>
							{rec?.isWaitlist && (
								<Tag color={'orange'}>{intl.formatMessage({ id: 'dangkytinchi.modaldangky.columntable.hangcho' })}</Tag>
							)}
						</Space>
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
			open={visibleRegister}
			closable={false}
			footer={null}
			width={1000}
			styles={{ body: { padding: 0 } }}
			maskClosable={false}
		>
			<Card title={intl.formatMessage({ id: 'dangkytinchi.modaldangky.title' })}>
				<TableStaticData
					columns={columns}
					data={danhSachDangKy}
					addStt
					loading={loading}
					otherProps={{ pagination: false, scroll: { y: 600 } }}
					otherButtons={[<i className='text-info'>{intl.formatMessage({ id: 'dangkytinchi.modaldangky.info' })}</i>]}
				/>

				<div className='form-footer'>
					<Button onClick={onRegister} type='primary' loading={formSubmiting} disabled={!canRegister}>
						{intl.formatMessage({ id: 'dangkytinchi.action.xacnhan' })}
					</Button>
					<Button onClick={() => setVisibleRegister(false)} disabled={formSubmiting}>
						{intl.formatMessage({ id: 'dangkytinchi.action.dong' })}
					</Button>
				</div>
			</Card>
		</Modal>
	);
};

export default ModalDangKy;
