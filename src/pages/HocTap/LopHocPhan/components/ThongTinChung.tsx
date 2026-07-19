import ButtonExtend from '@/components/Table/ButtonExtend';
import { openSafeUrl } from '@/utils/security';
import { DesktopOutlined, GlobalOutlined } from '@ant-design/icons';
import { Card, message, Space, Spin } from 'antd';
import { useIntl, useModel } from 'umi';
import GioiThieuChungLopHp from './GioiThieuChung';
import './style.less';

const ThongTinChung = (props: { onShowDeCuong: (activeTab: string) => void }) => {
	const intl = useIntl();
	const { loading, record, getMoodleLopHocPhanModel } = useModel('lophocphan.lophocphan');
	// const { danhSach: danhSachNoiDungHocPhan } = useModel('hocphan.noidunghp');
	// const [visibleKyNang, setVisibleKyNang] = useState<boolean>(false);
	// const [activeKyNangTab, setActiveKyNangTab] = useState<string>('content');
	const deCuongId = record?.deCuong?.deCuongId || record?.hocPhan?.deCuongHienTaiId;
	let allThoiKhoaBieu = record?.thoiKhoaBieuList ?? [];
	allThoiKhoaBieu = allThoiKhoaBieu.concat(record?.children?.flatMap((child) => child.thoiKhoaBieuList ?? []) ?? []);

	// Lấy dữ liệu kỹ năng
	// const kyNangDatDuoc = recDeCuong?.kyNangDatDuoc || recDeCuong?.ketQuaDatDuoc || [];

	// Hiển thị 3 kỹ năng đầu tiên trong card
	// const displayKyNang = kyNangDatDuoc.slice(0, 3);

	// Tính toán tổng số giờ học từ nội dung học phần
	// const totalHours =
	// 	danhSachNoiDungHocPhan?.reduce((total, item) => {
	// 		return total + (item.gioLyThuyet || 0) + (item.gioBaiTapTL || 0) + (item.gioThucHanh || 0) + (item.gioTuHoc || 0);
	// 	}, 0) || 0;

	const handleMoodle = () => {
		if (record?.moodleShortname && record?._id)
			getMoodleLopHocPhanModel(record._id).then((data) => {
				if (data?.url && openSafeUrl(data.url)) return;
				if (data?.url) message.error(intl.formatMessage({ id: 'lichsukien.chitiet.duongdan.khonghople' }));
				else message.error(intl.formatMessage({ id: 'lichsukien.chitiet.loi' }));
			});
	};

	// Render kỹ năng item với thiết kế cải tiến
	// const renderKyNangItem = (item: any, index: number, isPreview: boolean = false) => (
	// 	<div key={index} className={`ky-nang-item ${isPreview ? 'preview' : 'detail'}`}>
	// 		<div className='ky-nang-number'>
	// 			<Text>{index + 1}</Text>
	// 		</div>
	// 		<div className='ky-nang-content'>
	// 			<div className='ky-nang-title'>{item.tieuDe || item.ten || item.kyNang || 'Không có tiêu đề'}</div>
	// 			{item.moTa && (
	// 				<div className='ky-nang-description'>
	// 					{isPreview && item.moTa.length > 120 ? `${item.moTa.substring(0, 120)}...` : item.moTa}
	// 				</div>
	// 			)}
	// 			<div className='ky-nang-tags'>
	// 				{item.mucDo && (
	// 					<Tag
	// 						className={`ky-nang-tag ${
	// 							item.mucDo === 'Cao' ? 'muc-do-cao' : item.mucDo === 'Trung bình' ? 'muc-do-trung-binh' : 'muc-do-thap'
	// 						}`}
	// 						color={item.mucDo === 'Cao' ? 'red' : item.mucDo === 'Trung bình' ? 'orange' : 'green'}
	// 					>
	// 						Mức độ: {item.mucDo}
	// 					</Tag>
	// 				)}
	// 				{item.loaiKyNang && (
	// 					<Tag color='blue' className='ky-nang-tag'>
	// 						{item.loaiKyNang}
	// 					</Tag>
	// 				)}
	// 				{item.thoiGianHoc && (
	// 					<Tag color='purple' className='ky-nang-tag'>
	// 						{item.thoiGianHoc}h
	// 					</Tag>
	// 				)}
	// 			</div>
	// 		</div>
	// 	</div>
	// );

	// Render modal với TabPane
	// const renderKyNangModal = () => (
	// 	<Modal
	// 		title={
	// 			<div className='modal-title'>
	// 				<AimOutlined />
	// 				<span>Kỹ năng & Nội dung học phần</span>
	// 			</div>
	// 		}
	// 		open={visibleKyNang}
	// 		onCancel={() => setVisibleKyNang(false)}
	// 		footer={null}
	// 		width={1200}
	// 		className='modal-ky-nang'
	// 	>
	// 		<Tabs activeKey={activeKyNangTab} onChange={setActiveKyNangTab} size='large'>
	// 			<Tabs.TabPane
	// 				tab={
	// 					<span>
	// 						<BookOutlined />
	// 						Nội dung học phần
	// 					</span>
	// 				}
	// 				key='content'
	// 			>
	// 				<NoiDungHocPhanPage />
	// 			</Tabs.TabPane>

	// 			<Tabs.TabPane
	// 				tab={
	// 					<span>
	// 						<AimOutlined />
	// 						Kỹ năng đạt được ({kyNangDatDuoc.length})
	// 					</span>
	// 				}
	// 				key='skills'
	// 			>
	// 				{kyNangDatDuoc.length > 0 ? (
	// 					<div className='ky-nang-items'>
	// 						{kyNangDatDuoc.map((item: any, index: number) => renderKyNangItem(item, index, false))}
	// 					</div>
	// 				) : (
	// 					<div className='empty-ky-nang-modal'>
	// 						<AimOutlined />
	// 						<div>Chưa có thông tin kỹ năng đạt được</div>
	// 					</div>
	// 				)}
	// 			</Tabs.TabPane>

	// 			<Tabs.TabPane
	// 				tab={
	// 					<span>
	// 						<FileTextOutlined />
	// 						Thông tin chung
	// 					</span>
	// 				}
	// 				key='general'
	// 			>
	// 				<ThongTinChungPage />
	// 			</Tabs.TabPane>
	// 		</Tabs>
	// 	</Modal>
	// );

	return (
		<Spin spinning={loading}>
			{record?.lmsUrl || record?.moodleShortname ? (
				<Space wrap className='button-space'>
					{record?.lmsUrl ? (
						<ButtonExtend notHideText icon={<GlobalOutlined />} onClick={() => openSafeUrl(record.lmsUrl)}>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.hoctructuyen' })}
						</ButtonExtend>
					) : null}
					{record?.moodleShortname ? (
						<ButtonExtend notHideText icon={<DesktopOutlined />} onClick={handleMoodle}>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.lms' })}
						</ButtonExtend>
					) : null}
				</Space>
			) : null}

			<Card variant='borderless' className='thong-tin-chung-container'>
				<GioiThieuChungLopHp onShowDeCuong={props.onShowDeCuong} deCuongId={deCuongId} />

				{/* Kỹ năng đạt được  */}
				{/* Tạm thời chưa có api và dữ liệu nên comment lại */}
				{/* <Card
					title={
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none' }}>
							<span>Kỹ năng đạt được</span>
							{kyNangDatDuoc.length > 0 && (
								<Tag color='blue' style={{ marginLeft: 8 }}>
									{kyNangDatDuoc.length} kỹ năng
								</Tag>
							)}
							{totalHours > 0 && (
								<Tag color='green' style={{ marginLeft: 4 }}>
									{totalHours} giờ học
								</Tag>
							)}
						</div>
					}
					size='small'
					className='ky-nang-card'
					extra={
						kyNangDatDuoc.length > 0 && (
							<Button
								type='link'
								onClick={() => {
									setVisibleKyNang(true);
									setActiveKyNangTab('skills');
								}}
								className='btn-extra detail-btn'
								icon={<AimOutlined />}
							>
								Xem chi tiết
							</Button>
						)
					}
				>
					{displayKyNang.length > 0 ? (
						<div className='ky-nang-items'>
							{displayKyNang.map((item: any, index: number) => renderKyNangItem(item, index, true))}
							{kyNangDatDuoc.length > 3 && (
								<div className='more-skills'>
									<Text type='secondary' className='more-skills-text'>
										và {kyNangDatDuoc.length - 3} kỹ năng khác...
									</Text>
									<Button
										type='link'
										size='small'
										onClick={() => {
											setVisibleKyNang(true);
											setActiveKyNangTab('skills');
										}}
										style={{ marginLeft: 8 }}
									>
										Xem tất cả
									</Button>
								</div>
							)}
						</div>
					) : (
						<div className='empty-ky-nang'>
							<AimOutlined />
							<div>Chưa có thông tin kỹ năng đạt được</div>
							<Button
								type='link'
								size='small'
								onClick={() => {
									setVisibleKyNang(true);
									setActiveKyNangTab('content');
								}}
								style={{ marginTop: 8 }}
							>
								Xem nội dung học phần
							</Button>
						</div>
					)}
				</Card> */}
			</Card>
		</Spin>
	);
};

export default ThongTinChung;
