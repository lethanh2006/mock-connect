import ButtonExtend from '@/components/Table/ButtonExtend';
import { inputFormat } from '@/utils/utils';
import { CustomerServiceOutlined, FieldTimeOutlined, ReloadOutlined } from '@ant-design/icons';
import {
	Card,
	Col,
	Empty,
	Input,
	Pagination,
	Row,
	Segmented,
	Select,
	Space,
	Spin,
	Tabs,
	Tooltip,
	Typography,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import DangTaiLieuPage from '../DangTaiLieu';
import ThoiGianVaoRaThuVien from '../VaoRaThuVien/components/ThoiGian';
import ConfirmMuonSach from './components/ComfirmMuon';
import './style.less';
import TimKiemNangCao from './TimKiem/TimKiemNangCao';
const { Paragraph } = Typography;

const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

const MuonTraSachPage = () => {
	const { getSettingModel, settingMuonTra, setVisibleMuon } = useModel('thuvien.muonsach');
	const {
		getModel,
		page,
		limit,
		setPage,
		setLimit,
		danhSach,
		total,
		loading,
		setDanhSach,
		setRecord,
		setCondition,
		condition,
	} = useModel('thuvien.anpham');
	const { thongKeMuonTraSachModel, dataThongKe } = useModel('thuvien.muonsach');
	const { record: recDangTaiLieu } = useModel('thuvien.dangtailieu');
	const [segment, setSegment] = useState<string>('2');
	const [searchField, setSearchField] = useState('nhanDe');
	const [placeholder, setPlaceholder] = useState('Tìm kiếm sách theo nhan đề');
	const [visibleSetting, setVisibleSetting] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');

	const conMuonDuoc = Math.max(0, (settingMuonTra?.soLuongMuonToiDa ?? 0) - (dataThongKe?.dangThueMuon ?? 0));

	useEffect(() => {
		if (!settingMuonTra) getSettingModel();
		if (!dataThongKe) thongKeMuonTraSachModel();
	}, []);

	const getData = () => {
		if (recDangTaiLieu?.ma)
			getModel(
				{ maDangTaiLieu: recDangTaiLieu?.ma },
				undefined,
				undefined,
				undefined,
				8,
				`search/${segment === '1' ? 'all' : 'kha-dung'}`,
				{
					thoiGianBatDau: moment().toISOString(),
					thoiGianKetThuc: moment()
						.add(typeof settingMuonTra === 'number' ? settingMuonTra : 150, 'day')
						.toISOString(),
				},
				false,
			).then((data) => {
				const updatedData = data.map((item) => ({
					...item,
					randomImageIndex: Math.floor(Math.random() * 8) + 2,
				}));
				setDanhSach(updatedData);
			});
	};

	useEffect(() => {
		getData();
	}, [page, limit, segment, condition, recDangTaiLieu?._id]);

	const onChangePaging = (p: number, size: number) => {
		setPage(p);
		setLimit(size);
	};

	const handleFieldChange = (value: string) => {
		setSearchField(value);

		const placeholderMapping: Record<string, string> = {
			nhanDe: 'Tìm kiếm theo nhan đề',
			tacGia: 'Tìm kiếm theo tác giả',
			namXuatBan: 'Tìm kiếm theo năm xuất bản',
			nhaXuatBan: 'Tìm kiếm theo nhà xuất bản',
			tuKhoa: 'Tìm kiếm theo từ khóa',
			kyKieuPhanLoai: 'Tìm kiếm theo ký hiệu phân loại',
		};
		setPlaceholder(placeholderMapping[value]);
	};

	const onSearch = (value: string) => {
		if (value) {
			const fieldMap: Record<string, { tag: string; code: string }> = {
				nhanDe: { tag: '245', code: '$a' },
				tacGia: { tag: '100', code: '$a' },
				namXuatBan: { tag: '260', code: '$c' },
				nhaXuatBan: { tag: '260', code: '$f' },
				tuKhoa: { tag: '222', code: '$a' },
				kyKieuPhanLoai: { tag: '084', code: '$a' },
			};

			const field = fieldMap[searchField];
			if (field) {
				setCondition({
					danhSachFilter: [
						{
							tag: field.tag,
							code: field.code,
							value: value,
						},
					],
				});
			}
		} else {
			setCondition(undefined);
		}
	};

	return (
		<Card title='Tìm kiếm tài nguyên thư viện'>
			<Row gutter={[12, 12]}>
				<Col xs={24}>
					<Space wrap>
						<ButtonExtend size='small' icon={<FieldTimeOutlined />} onClick={() => setVisibleSetting(true)}>
							Thời gian ra vào thư viện
						</ButtonExtend>
						<ButtonExtend
							size='small'
							icon={<CustomerServiceOutlined />}
							onClick={() => window.open('https://slink-chatbot.ript.vn/admin/chatbot', '_blank')}
						>
							Tìm kiếm tài liệu thông minh
						</ButtonExtend>
					</Space>
				</Col>

				{/* <Col xs={24}>
					<Row gutter={[12, 12]}>
						<Col span={24} md={6}>
							<Card className='card-stat-small'>
								<span className='num' style={{ color: 'blue' }}>
									{settingMuonTra?.soLuongMuonToiDa ?? 0}
								</span>
								<span>Hạn ngạch mượn</span>
							</Card>
						</Col>
						<Col span={24} md={6}>
							<Card className='card-stat-small'>
								<span className='num' style={{ color: 'orange' }}>
									{dataThongKe?.dangThueMuon ?? 0}
								</span>
								<span>Đang mượn</span>
							</Card>
						</Col>
						<Col span={24} md={6}>
							<Card className='card-stat-small'>
								<span className='num' style={{ color: 'rec' }}>
									{dataThongKe?.quaHan ?? 0}
								</span>
								<span>Quá hạn mượn</span>
							</Card>
						</Col>
						<Col span={24} md={6}>
							<Card className='card-stat-small'>
								<span className='num' style={{ color: 'green' }}>
									{Math.max(0, (settingMuonTra?.soLuongMuonToiDa ?? 0) - (dataThongKe?.dangThueMuon ?? 0))}
								</span>
								<span>Còn mượn được</span>
							</Card>
						</Col>
					</Row>
				</Col> */}
				<Col xs={24}>
					<div style={{ maxWidth: '70%', margin: 'auto', marginBottom: 12 }}>
						<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
							<Tabs.TabPane key='1' tab='Tìm nhanh' />
							{/* <Tabs.TabPane key='2' tab='Cơ bản' /> */}
							<Tabs.TabPane key='3' tab='Nâng cao' />
						</Tabs>
						{activeKey === '1' ? (
							<Search
								placeholder={placeholder}
								onSearch={onSearch}
								enterButton
								allowClear
								size='large'
								addonBefore={
									<Select defaultValue='nhanDe' onChange={handleFieldChange}>
										<Option value='nhanDe'>Nhan đề</Option>
										<Option value='tacGia'>Tác giả</Option>
										<Option value='namXuatBan'>Năm xuất bản</Option>
										<Option value='nhaXuatBan'>Nhà xuất bản</Option>
										<Option value='tuKhoa'>Từ khóa</Option>
										<Option value='kyKieuPhanLoai'>Ký hiệu phân loại</Option>
									</Select>
								}
							/>
						) : (
							// : activeKey === '2' ? (
							// 	<TimKiemCoBan />
							// )
							<TimKiemNangCao />
						)}
					</div>
				</Col>

				<Col xs={24} style={{ marginTop: -10 }}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={6}>
							<Card
								title='Dạng tài liệu'
								bordered={false}
								bodyStyle={{ padding: '8px 0 0' }}
								headStyle={{ padding: 0 }}
							>
								<DangTaiLieuPage />
							</Card>
						</Col>
						<Col span={24} md={18}>
							<Card
								title={`Danh sách ${recDangTaiLieu?.ten}`}
								bordered={false}
								bodyStyle={{ padding: '8px 0 0' }}
								headStyle={{ padding: 0 }}
							>
								<div
									style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
								>
									<Segmented
										value={segment}
										onChange={(val) => setSegment(val.toString())}
										options={[
											{ value: '2', label: 'Khả dụng' },
											{ value: '1', label: 'Tất cả' },
										]}
									/>

									<Space wrap>
										<ButtonExtend icon={<ReloadOutlined />} onClick={() => getData()}>
											Tải lại
										</ButtonExtend>
										<Tooltip title='Tổng số dữ liệu'>
											<div className='total'>
												Tổng số:
												<span>{inputFormat(total || 0)}</span>
											</div>
										</Tooltip>
									</Space>
								</div>
								<Spin spinning={loading}>
									{danhSach?.length ? (
										<>
											<Row gutter={[12, 12]}>
												{danhSach?.map((item) => {
													return (
														<Col xs={24} sm={12} md={12} lg={8} xxl={6} key={item?._id}>
															<Card
																onClick={() => {
																	setRecord(item);
																	history.push(`/thu-vien/muon-tra-sach/${item?._id}`);
																}}
																hoverable
																style={{ margin: 'auto', width: 220 }}
																cover={
																	<div
																		style={{
																			width: '220px',
																			height: '250px',
																			color: 'white',
																			backgroundImage: `url(/thuvien/sach2-${item?.randomImageIndex}.png)`,
																			display: 'flex',
																			flexDirection: 'column',
																			justifyContent: 'space-between',
																			padding: '10px',
																		}}
																	>
																		<strong>
																			<Paragraph style={{ color: 'white' }} ellipsis={{ rows: 2, expandable: false }}>
																				{item?.nhanDeConverse}
																			</Paragraph>
																		</strong>

																		<strong>
																			<p>{item?.tacGiaConverse}</p>
																		</strong>

																		<strong>
																			<div>
																				<p style={{ textAlign: 'right' }}>
																					{item?.danhSachThongTin
																						?.find((val) => val?.tagCode === '260')
																						?.thuocTinhAnPham?.find((i) => i.code === '$c')?.value ?? ''}
																				</p>
																			</div>
																		</strong>
																	</div>
																}
																// actions={[
																// 	<ButtonExtend
																// 		disabled={item?.soLuong === 0 || conMuonDuoc === 0}
																// 		type='link'
																// 		tooltip={conMuonDuoc === 0 ? 'Quá hạn ngạch mượn' : 'Đăng ký mượn sách'}
																// 		icon={<PlusOutlined />}
																// 		key='add'
																// 		onClick={(event) => {
																// 			event.stopPropagation();
																// 			setRecord(item);
																// 			setVisibleMuon(true);
																// 		}}
																// 	/>,
																// ]}
															>
																<Meta
																	title={item?.nhanDeConverse}
																	description={
																		<div>
																			<div>
																				<span>{item?.tacGiaConverse}</span>
																			</div>
																			<div>
																				<span>
																					Khả dụng: <b>{item?.soLuong}</b>
																				</span>
																			</div>
																		</div>
																	}
																/>
															</Card>
														</Col>
													);
												})}
											</Row>
											<Pagination
												size='default'
												onChange={onChangePaging}
												current={page}
												pageSize={limit}
												total={total}
												style={{ marginTop: 12, textAlign: 'right' }}
											/>
										</>
									) : (
										<Empty description='Không có thông tin sách' style={{ marginTop: 32, marginBottom: 32 }} />
									)}
								</Spin>
							</Card>
						</Col>
					</Row>
				</Col>
			</Row>

			<ConfirmMuonSach />
			<ThoiGianVaoRaThuVien visible={visibleSetting} setVisible={setVisibleSetting} />
		</Card>
	);
};

export default MuonTraSachPage;
