import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
	ColorTrangThaiDangKyTinChi,
	ETrangThaiDangKyTinChi
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Tag, message } from 'antd';
import pLimit from 'p-limit';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
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
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const captchaRef = useRef<ReCAPTCHA>(null);
	const canRegister = danhSachDangKy.filter((item) => item.trangThai !== ETrangThaiDangKyTinChi.DA_DANG_KY).length > 0;

	const handleCaptchaChange = (token: string | null) => {
    if (token) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

	const postDangKy = async () => {
		setFormSubmiting(true);
		const limit = pLimit(1); // Giới hạn 1 truy vấn cùng lúc

		// Với từng lớp mới chọn thì gọi 1 API đăng ký
		const promises = danhSachDangKy.map((item, index) =>
			limit(() => {
				if (item.trangThai !== ETrangThaiDangKyTinChi.DA_DANG_KY)
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
						);
			}),
		);
		if (isVerified) {
		Promise.all(promises)
			.then()
			.finally(() => {
				setTimeout(() => {
					message.info('Đã hoàn thành đăng ký');
					if (dotDangKyHienTai?._id) {
						getPhieuDangKyModel(dotDangKyHienTai._id); // Get lại thông tin phiếu đăng ký của kỳ hiện tại
						getLopDangKyModel(dotDangKyHienTai.maHocKy);
					}
					setFormSubmiting(false);
				}, 1000);
			});
		}
	};

	useEffect(() => {
		if (visibleRegister) {
			debugger
			setIsVerified(false);
			captchaRef.current?.reset();
		}
	}, [visibleRegister]);

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
			onOk: async () => {
				await postDangKy();
				setIsVerified(false);
				captchaRef.current?.reset();
			},
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
					otherProps={{ pagination: false, scroll: { y: 600 } }}
				/>

				<ReCAPTCHA 
					ref={captchaRef}
					style={{
						margin: '12px auto',
						display: 'flex',
						justifyContent: 'center',
					}} 
					sitekey='6LelHsEeAAAAAJmsVdeC2EPNCAVEtfRBUGSKireh' 
					onChange={handleCaptchaChange}
				/>

				<div className='form-footer'>
					<Button onClick={onRegister} type='primary' loading={formSubmiting} disabled={!canRegister || !isVerified}>
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
