import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { getNameFile } from '@/utils/utils';
import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Empty, Row, Spin, Tag } from 'antd';
import { IconDownload } from '@/components/Icons';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
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
	const [visiblePreview, setVisiblePreview] = useState(false);
	const [previewFile, setPreviewFile] = useState<string>('');
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
			<div>
				<Divider size='small' orientation='left' className='divider-big-title' dashed>
					{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieuchung' })}
				</Divider>

				{record?.gioiThieuChung ? (
					<>
						<div
							className='gioi-thieu-chung-content'
							style={{ display: expand ? 'block' : '-webkit-box' }}
							dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(record.gioiThieuChung) }}
						/>
						<a onClick={() => setExpand((v) => !v)} style={{ marginTop: 8 }}>
							{expand
								? intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.thugon' })
								: intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.xemthem' })}
						</a>
					</>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.empty' })}
					/>
				)}

				{/* {record?.lmsUrl ? (
					<>
						<span className='fw500' style={{ marginTop: 12 }}>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.hoctructuyen' })}:{' '}
						</span>
						<a href={record.lmsUrl} target='_blank' rel='noreferrer'>
							{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.duongdan' })}
						</a>
					</>
				) : null} */}
			</div>

			<div>
				<div className='thong-tin-header'>
					<Divider
						size='small'
						orientation='left'
						className='divider-big-title'
						dashed
						style={{ margin: 0, flex: 1, minWidth: 0 }}
					>
						{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.muctieu' })}
					</Divider>
					<a onClick={() => onShowDeCuong('0')}>
						{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.chitiet' })}
					</a>
				</div>

				{recDeCuong?.mucTieuHocPhan ? (
					<div
						className='gioi-thieu-chung-content'
						style={{ display: '-webkit-box' }}
						dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(recDeCuong.mucTieuHocPhan) }}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.empty' })}
					/>
				)}
			</div>

			<div>
				<Row gutter={[16, 16]}>
					<Col span={24} md={24}>
						<div className='thong-tin-header'>
							<Divider
								size='small'
								orientation='left'
								className='divider-big-title'
								dashed
								style={{ margin: 0, flex: 1, minWidth: 0 }}
							>
								{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.tailieu' })}
							</Divider>
						</div>
						<Spin spinning={loadingHocLieu}>
							{displayTaiLieu.length > 0 ? (
								<div className='tai-lieu-list'>
									{displayTaiLieu.map((item, index) => (
										<div key={`${item}-${index}`} className='tai-lieu-item'>
											<span className='tai-lieu-label'>{intl.formatMessage({ id: 'diendan.tepdinhkem' })}</span>
											<span className='tai-lieu-file'>
												<PaperClipOutlined />
												<a
													onClick={() => {
														setPreviewFile(item);
														setVisiblePreview(true);
													}}
												>
													{getNameFile(item) || item}
												</a>
											</span>
										</div>
									))}
								</div>
							) : (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description={intl.formatMessage({ id: 'lophocphan.chua-co-tai-lieu' })}
								/>
							)}
						</Spin>
					</Col>

					<Col span={24} md={24}>
						<div className='thong-tin-header'>
							<Divider
								orientation='left'
								className='divider-big-title'
								dashed
								style={{ margin: 0, flex: 1, minWidth: 0 }}
							>
								{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.hoclieu' })}
							</Divider>
							<a onClick={() => onShowDeCuong('0')}>
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
													icon={<IconDownload />}
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

			<ModalExpandable
				title={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.gioithieu.tailieu' })}
				width={1000}
				open={visiblePreview}
				footer={
					<div className='form-footer'>
						<Button
							onClick={() => {
								setVisiblePreview(false);
								setPreviewFile('');
							}}
						>
							{intl.formatMessage({ id: 'global.button.dong' })}
						</Button>
					</div>
				}
				onCancel={() => {
					setVisiblePreview(false);
					setPreviewFile('');
				}}
			>
				{previewFile ? <PreviewFile file={previewFile} /> : null}
			</ModalExpandable>
		</>
	);
};

export default GioiThieuChungLopHp;
