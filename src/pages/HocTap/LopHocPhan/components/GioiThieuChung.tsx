import { DownloadOutlined } from '@ant-design/icons';
import { Button, Empty, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import './style.less';

const GioiThieuChungLopHp = (props: { onShowDeCuong: (activeTab: string) => void; deCuongId?: string }) => {
	const { record } = useModel('lophocphan.lophocphan');
	const { record: recDeCuong, getByIdModel: getDeCuong, setRecord: setDeCuong } = useModel('hocphan.decuonghocphan');
	const {
		danhSach: danhSachHocLieu,
		loading: loadingHocLieu,
		getModel: getHocLieuDeCuong,
		setDanhSach: setHocLieu,
	} = useModel('hocphan.hoclieudecuong');
	const [expand, setExpand] = useState(false);
	const { onShowDeCuong, deCuongId } = props;
	// Lấy dữ liệu học liệu thực tế (giới hạn 3 item đầu tiên để hiển thị)
	const displayHocLieu = (danhSachHocLieu || []).slice(0, 3);

	useEffect(() => {
		if (deCuongId) {
			getDeCuong(deCuongId);
			getHocLieuDeCuong({ deCuongId: deCuongId });
		} else {
			setDeCuong(undefined);
			setHocLieu([]);
		}
	}, [deCuongId]);

	return (
		<>
			<div className='gioi-thieu-section'>
				<div className='thong-tin-header'>Giới thiệu lớp học phần</div>

				<div
					className='gioi-thieu-chung-content'
					style={{ display: expand ? 'block' : '-webkit-box' }}
					dangerouslySetInnerHTML={{ __html: record?.gioiThieuChung ?? '' }}
				/>
				{record?.gioiThieuChung ? (
					<a onClick={() => setExpand((v) => !v)} style={{ marginTop: 8 }}>
						{expand ? 'Thu gọn' : 'Xem thêm'}
					</a>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Chưa có thông tin' />
				)}
			</div>

			{recDeCuong?.mucTieuHocPhan && (
				<div className='gioi-thieu-section'>
					<div className='thong-tin-header'>
						Mục tiêu học phần
						<a onClick={() => onShowDeCuong('0')}>Xem chi tiết</a>
					</div>

					<div
						className='gioi-thieu-chung-content'
						style={{ display: '-webkit-box' }}
						dangerouslySetInnerHTML={{ __html: recDeCuong?.mucTieuHocPhan ?? '' }}
					/>
				</div>
			)}

			<div className='gioi-thieu-section'>
				<div className='thong-tin-header'>
					Học liệu học phần
					<a onClick={() => onShowDeCuong('3')}>Xem chi tiết</a>
				</div>
				<Spin spinning={loadingHocLieu}>
					{displayHocLieu.length > 0 ? (
						<div>
							{displayHocLieu.map((item, index) => (
								<div key={index} className='hoc-lieu-item'>
									<div className='hoc-lieu-content'>
										<div className='hoc-lieu-title'>
											{item.tieuDe || 'Không có tiêu đề'} {item.batBuoc && <Tag color='red'>Bắt buộc</Tag>}
										</div>
										<div className='hoc-lieu-author'>Tác giả: {item.tacGia || 'Chưa cập nhật'}</div>
										<div className='hoc-lieu-publisher'>
											NXB: {item.tenNhaXuatBan || 'Chưa cập nhật'}
											{item.namXuatBan && ` (${item.namXuatBan})`}
										</div>
										{item.moTa && (
											<div className='hoc-lieu-description'>
												{item.moTa.length > 50 ? `${item.moTa.substring(0, 50)}...` : item.moTa}
											</div>
										)}
									</div>

									{item.url && APP_CONFIG_URL_THU_VIEN && (
										<Button
											type='text'
											size='small'
											icon={<DownloadOutlined />}
											onClick={() => window.open(APP_CONFIG_URL_THU_VIEN + item.url, '_blank')}
											title='Xem chi tiết'
										/>
									)}
								</div>
							))}
						</div>
					) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Chưa có tài liệu' />
					)}
				</Spin>
			</div>
		</>
	);
};

export default GioiThieuChungLopHp;
