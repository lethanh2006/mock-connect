import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { Avatar, Image, List } from 'antd';
import { useState } from 'react';

type TNhanSu = Pick<LopHocPhan.IRecordNhanSuLopHP, 'tenNhanSu' | 'maNhanSu' | 'nhanSu' | 'nhanSuSsoId'>;

const DanhSachGiangVien = (props: { danhSachNhanSu?: Partial<TNhanSu>[]; title?: string }) => {
	const { title, danhSachNhanSu } = props;
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	return (
		<div>
			<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>{title ?? 'Giảng viên'}</h4>
			{danhSachNhanSu?.length ? (
				<List
					itemLayout='horizontal'
					size='small'
					dataSource={danhSachNhanSu}
					renderItem={(item) => (
						<List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									width: '100%',
									gap: 12,
								}}
							>
								<div
									style={{
										cursor: item.nhanSu?.urlAnhDaiDien ? 'pointer' : 'default',
										flexShrink: 0,
									}}
									onClick={() => {
										if (item.nhanSu?.urlAnhDaiDien) {
											setPreviewImage(item.nhanSu.urlAnhDaiDien);
											setPreviewOpen(true);
										}
									}}
								>
									<Avatar
										size={48}
										src={
											item.nhanSu?.urlAnhDaiDien ||
											(item.nhanSu?.gioiTinh === 'Nữ' ? '/images/teacher-female.svg' : '/images/teacher-male.svg')
										}
									/>
								</div>

								<div style={{ flex: 1, minWidth: 0 }}>
									<div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#333' }}>
										{item.nhanSu?.ten || item.tenNhanSu ? (
											<span>
												{item.nhanSu?.ten ? [item.nhanSu?.hoDem, item.nhanSu?.ten].join(' ') : item.tenNhanSu}
											</span>
										) : (
											<i>Không tìm thấy thông tin</i>
										)}
									</div>

									<div
										style={{
											fontSize: 13,
											color: '#666',
											display: 'flex',
											flexDirection: 'column',
											gap: 2,
										}}
									>
										<div>
											{item.nhanSu?.email ? <a href={`mailto:${item.nhanSu.email}`}>{item.nhanSu.email}</a> : <i>--</i>}
										</div>
										<div>
											{item.nhanSu?.sdtCaNhan ? (
												<a href={`tel:${item.nhanSu.sdtCaNhan}`}>{formatPhoneNumber(item.nhanSu.sdtCaNhan)}</a>
											) : (
												<i>--</i>
											)}
										</div>
									</div>
								</div>
							</div>
						</List.Item>
					)}
				/>
			) : (
				<div>
					<i>Không có thông tin</i>
				</div>
			)}

			<Image
				style={{ display: 'none' }}
				preview={{
					visible: previewOpen,
					src: previewImage,
					onVisibleChange: (val) => setPreviewOpen(val),
				}}
			/>
		</div>
	);
};

export default DanhSachGiangVien;
