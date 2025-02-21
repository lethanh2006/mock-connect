import ButtonExtend from '@/components/Table/ButtonExtend';
import { CarryOutOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Col, Descriptions, Divider, Row, Space, Typography } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ChiTietMarc from './components/ChiTietMarc';
import ConfirmMuonSach from './components/ComfirmMuon';
import { getDKCBKhaDung } from '@/services/QuanLyThuVien/AnPham';
import moment from 'moment';
const { Paragraph } = Typography;

const DetailThongTinSach = ({
	match: {
		params: { id },
	},
}: {
	match: { params: { id: string } };
}) => {
	const { record, getByIdModel, loading, setCondition } = useModel('thuvien.anpham');
	const { getSettingModel, settingMuonTra, setVisibleMuon } = useModel('thuvien.muonsach');
	const { thongKeMuonTraSachModel, dataThongKe } = useModel('thuvien.muonsach');
	const [randomImage, setrandomImage] = useState<number>();
	const [visible, setVisible] = useState<boolean>(false);
	const [recXepGia, setRecXepGia] = useState<AnPham.IThongKeXepGia>();

	const danhSach = record?.danhSachThongTin ?? [];

	const conMuonDuoc = Math.max(0, (settingMuonTra?.soLuongMuonToiDa ?? 0) - (dataThongKe?.dangThueMuon ?? 0));

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
		if (!dataThongKe) thongKeMuonTraSachModel();
	}, []);

	useEffect(() => {
		if (id) {
			if (!record?._id) {
				getByIdModel(id, true)
					.then()
					.catch((er) => history.push('/thu-vien/muon-tra-sach'));
			}
			getDKCBKhaDung(`${id}`, {
				thoiGianBatDau: moment().toISOString(),
				thoiGianKetThuc: moment()
					.add(settingMuonTra?.thoiHanMuonTraSach ?? 150, 'd')
					.toISOString(),
			})
				.then((res) => setRecXepGia(res?.data?.data as any))
				.catch((er) => history.push('/thu-vien/muon-tra-sach'));
		}
		setCondition(undefined);
	}, [id]);

	useEffect(() => {
		if (id && !record?._id) setrandomImage(Math.floor(Math.random() * 8) + 2);
	}, [id, record?._id]);

	return (
		<Card
			bodyStyle={{ paddingTop: 4 }}
			title={
				<Breadcrumb style={{ cursor: 'pointer' }}>
					<Breadcrumb.Item onClick={() => history.push('/thu-vien/muon-tra-sach')}>
						<CarryOutOutlined /> Tài nguyên số
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						{danhSach
							?.find((item) => item?.tagCode === '245')
							?.thuocTinhAnPham?.find((i) => i.code === '$a')
							?.value?.replace(/\u00A0/g, ' ') ?? ''}
					</Breadcrumb.Item>
				</Breadcrumb>
			}
			loading={loading}
		>
			<div style={{ maxWidth: 900, margin: 'auto', marginTop: 12 }}>
				<Row gutter={[12, 0]}>
					<Col span={24} md={8}>
						<div
							style={{
								width: '220px',
								height: '300px',
								color: 'white',
								backgroundImage: `url(/thuvien/sach2-${record?.randomImageIndex ?? randomImage}.png)`,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								padding: '10px',
							}}
						>
							<strong>
								<Paragraph style={{ color: 'white' }} ellipsis={{ rows: 2, expandable: false }}>
									{danhSach
										?.find((item) => item?.tagCode === '245')
										?.thuocTinhAnPham?.find((i) => i.code === '$a')
										?.value?.replace(/\u00A0/g, ' ') ?? ''}
								</Paragraph>
							</strong>

							<strong>
								<p>
									{danhSach
										?.find((item) => item?.tagCode === '100')
										?.thuocTinhAnPham?.find((i) => i.code === '$a')
										?.value?.replace(/\u00A0/g, ' ') ?? '--'}
								</p>
							</strong>

							<strong>
								<div>
									<p style={{ textAlign: 'right' }}>
										<p style={{ textAlign: 'right' }}>
											{danhSach?.find((val) => val?.tagCode === '260')?.thuocTinhAnPham?.find((i) => i.code === '$c')
												?.value ?? ''}
										</p>
									</p>
								</div>
							</strong>
						</div>
					</Col>

					<Col span={24} md={16}>
						<Row gutter={[6, 0]}>
							<Col span={24} style={{ marginBottom: 12 }}>
								<Paragraph ellipsis={{ rows: 3, expandable: false }}>
									<strong style={{ fontSize: 22 }}>
										{danhSach
											?.find((item) => item?.tagCode === '245')
											?.thuocTinhAnPham?.find((i) => i.code === '$a')
											?.value?.replace(/\u00A0/g, ' ') ?? ''}
									</strong>
								</Paragraph>
							</Col>

							<Col span={24}>
								<Descriptions column={1}>
									<Descriptions.Item label='Tác giả'>
										{danhSach?.find((item) => item?.tagCode === '100')?.thuocTinhAnPham?.find((i) => i.code === '$a')
											?.value ?? '--'}
									</Descriptions.Item>
									<Descriptions.Item label='Loại tài liệu'>
										{danhSach?.find((item) => item?.tagCode === '927')?.thuocTinhAnPham?.[0]?.value ?? '--'}
									</Descriptions.Item>
									<Descriptions.Item label='Nội dung tóm tắt'>
										{danhSach
											?.find((item) => item?.tagCode === '520')
											?.thuocTinhAnPham?.find((i) => i.code === '$a')
											?.value?.replace(/\u00A0/g, ' ') ?? '--'}
									</Descriptions.Item>
								</Descriptions>
							</Col>
							<Col span={24}>
								<Space>
									{/* <ButtonExtend
										tooltip={conMuonDuoc === 0 ? 'Quá hạn ngạch' : 'Đăng ký mượn'}
										disabled={recXepGia?.thongTinAnPhamKhaDung?.length === 0 || conMuonDuoc === 0}
										type='primary'
										onClick={() => setVisibleMuon(true)}
									>
										Đăng ký mượn
									</ButtonExtend> */}
									{record?.online && (
										<ButtonExtend tooltip='Đường dẫn ấn phẩm số' type='primary'>
											Ấn phẩm số
										</ButtonExtend>
									)}
								</Space>
							</Col>
						</Row>
					</Col>
				</Row>

				<Col span={24}>
					<Divider />
				</Col>

				<Col span={24}>
					<div style={{ marginBottom: 12 }}>
						<strong style={{ fontSize: 22 }}>Thông tin chi tiết</strong>
					</div>
					<Descriptions column={1}>
						<Descriptions.Item label='Chỉ số ISBN'>
							{danhSach?.find((item) => item?.tagCode === '020')?.thuocTinhAnPham?.find((i) => i.code === '$a')
								?.value ?? '--'}
						</Descriptions.Item>
						{/* <Descriptions.Item label='Giá tiền'>
							{danhSach?.find((item) => item?.tagCode === '350')?.thuocTinhAnPham?.find((i) => i.code === '$a')
								?.value ?? '--'}
						</Descriptions.Item> */}
						<Descriptions.Item label='Ngôn ngữ'>
							{danhSach?.find((item) => item?.tagCode === '041')?.thuocTinhAnPham?.[0]?.value ?? ''}
						</Descriptions.Item>
						<Descriptions.Item label='Ký hiệu phân loại'>
							{danhSach
								?.find((item) => item?.tagCode === '020')
								?.thuocTinhAnPham?.map((item) => item?.value)
								.join(', ') ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Thông tin trách nhiệm'>
							{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$c')
								?.value ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Nhan đề chính'>
							{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$a')
								?.value ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Phụ đề'>
							{danhSach?.find((item) => item?.tagCode === '245')?.thuocTinhAnPham?.find((i) => i.code === '$b')
								?.value ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Xuất bản'>
							{danhSach?.find((item) => item?.tagCode === '250')?.thuocTinhAnPham?.find((i) => i.code === '$a')
								?.value ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Phát hành'>
							{danhSach?.find((item) => item?.tagCode === '260')?.thuocTinhAnPham?.find((i) => i.code === '$b')
								?.value ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Mô tả vật lý'>
							{danhSach
								?.find((item) => item?.tagCode === '300')
								?.thuocTinhAnPham?.map((i) => i.value)
								.join(', ') ?? '--'}
						</Descriptions.Item>
					</Descriptions>

					<div>
						<ButtonExtend onClick={() => setVisible(true)}>Xem biểu ghi Marc</ButtonExtend>
					</div>
				</Col>

				<Col span={24}>
					<Divider />
				</Col>

				<Col span={24}>
					<div style={{ marginBottom: 12 }}>
						<strong style={{ fontSize: 22 }}>Thông tin xếp giá</strong>
					</div>
					<Descriptions column={1}>
						<Descriptions.Item label='ĐKCB'>
							{_.sortBy(
								_.concat(
									recXepGia?.thongTinAnPhamKhaDung?.map((item) => `${item.soDangKyCaBiet}`) || [],
									recXepGia?.thongTinAnPhamDangMuon?.map((item) => `${item}`) || [],
								),
								(item) => item,
							).join(', ')}
						</Descriptions.Item>

						<Descriptions.Item label='Tổng số bản'>
							{(recXepGia?.thongTinAnPhamKhaDung?.length ?? 0) + (recXepGia?.thongTinAnPhamDangMuon?.length ?? 0)}
						</Descriptions.Item>
						<Descriptions.Item label='Tổng số bản rảnh'>
							{recXepGia?.thongTinAnPhamKhaDung?.length ?? 0}
						</Descriptions.Item>
						<Descriptions.Item label='Tổng số đang đặt chỗ'>
							{recXepGia?.thongTinAnPhamDangMuon?.length ?? 0}
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</div>

			<ConfirmMuonSach id={id} />

			<ChiTietMarc visible={visible} setVisible={setVisible} danhSach={danhSach} />
		</Card>
	);
};

export default DetailThongTinSach;
