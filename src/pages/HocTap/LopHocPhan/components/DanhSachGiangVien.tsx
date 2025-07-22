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
					grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 3 }}
					itemLayout='vertical'
					size='small'
					dataSource={danhSachNhanSu}
					renderItem={(item) => (
						<List.Item>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									textAlign: 'center',
								}}
							>
								<div
									style={{
										cursor: item.nhanSu?.urlAnhDaiDien ? 'pointer' : 'default',
										marginBottom: 8,
									}}
									onClick={() => {
										if (item.nhanSu?.urlAnhDaiDien) {
											setPreviewImage(item.nhanSu.urlAnhDaiDien);
											setPreviewOpen(true);
										}
									}}
								>
									<Avatar
										size={64}
										src={
											item.nhanSu?.urlAnhDaiDien ||
											(item.nhanSu?.gioiTinh === 'Nữ' ? '/images/teacher-female.svg' : '/images/teacher-male.svg')
										}
									/>
								</div>

								<div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
									{item.nhanSu?.ten || item.tenNhanSu ? (
										<span>{item.nhanSu?.ten ? [item.nhanSu?.hoDem, item.nhanSu?.ten].join(' ') : item.tenNhanSu}</span>
									) : (
										<i>Không tìm thấy thông tin</i>
									)}
								</div>

								<div
									style={{
										fontSize: 13,
										color: '#555',
										display: 'flex',
										justifyContent: 'flex-start',
										alignItems: 'flex-start',
										flexDirection: 'column',
									}}
								>
									<div
										style={{
											borderBottom: '1px solid #ccc',
										}}
									>
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
