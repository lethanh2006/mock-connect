import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Row, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import BoxFile from '../DienDan/components/BoxFile';
import './style.less';

const GioiThieuChungLopHp = (props: { onShowDeCuong: (activeTab: string) => void; deCuongId?: string }) => {
	const intl = useIntl();
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
	const displayTaiLieu = record?.listTaiLieu || [];
	// .slice(0, 6);

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
				<div className='thong-tin-header' style={{ fontSize: 16 }}>
					{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu' })}
				</div>

				<span className='fw500'>{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieuchung' })}</span>
				<div
					className='gioi-thieu-chung-content'
					style={{ display: expand ? 'block' : '-webkit-box' }}
					dangerouslySetInnerHTML={{ __html: record?.gioiThieuChung ?? '' }}
				/>
				{record?.gioiThieuChung ? (
					<a onClick={() => setExpand((v) => !v)} style={{ marginTop: 8 }}>
						{expand
							? intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.thugon' })
							: intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.xemthem' })}
					</a>
				) : null}

				{record?.lmsUrl ? (
					<>
						<span className='fw500' style={{ marginTop: 12 }}>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.hoctructuyen' })}:{' '}
						</span>
						<a href={record.lmsUrl} target='_blank' rel='noreferrer'>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.duongdan' })}
						</a>
					</>
				) : null}
			</div>

			{recDeCuong?.mucTieuHocPhan && (
				<div className='gioi-thieu-section'>
					<div className='thong-tin-header'>
						{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.muctieu' })}
						<a onClick={() => onShowDeCuong('0')}>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.chitiet' })}
						</a>
					</div>

					<div
						className='gioi-thieu-chung-content'
						style={{ display: '-webkit-box' }}
						dangerouslySetInnerHTML={{ __html: recDeCuong?.mucTieuHocPhan ?? '' }}
					/>
				</div>
			)}

			<div className='gioi-thieu-section'>
				<Row gutter={[16, 16]}>
					<Col span={24} md={12}>
						<div className='thong-tin-header'>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.tailieu' })}
						</div>
						<Spin spinning={loadingHocLieu}>
							{displayTaiLieu.length > 0 ? (
								<div>
									{displayTaiLieu.map((item, index) => (
										<div key={index} className='tai-lieu-item'>
											<BoxFile url={item} />
										</div>
									))}
								</div>
							) : (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.empty' })}
								/>
							)}
						</Spin>
					</Col>

					<Col span={24} md={12}>
						<div className='thong-tin-header'>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.hoclieu' })}
							<a onClick={() => onShowDeCuong('3')}>
								{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.chitiet' })}
							</a>
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
													title={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.chitiet' })}
												/>
											)}
										</div>
									))}
								</div>
							) : (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.empty' })}
								/>
							)}
						</Spin>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default GioiThieuChungLopHp;
