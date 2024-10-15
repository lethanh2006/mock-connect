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
					grid={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 3 }}
					itemLayout='horizontal'
					size='small'
					dataSource={danhSachNhanSu}
					renderItem={(item) => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<div
										style={{ cursor: item.nhanSu?.urlAnhDaiDien ? 'pointer' : undefined }}
										onClick={() => {
											if (item.nhanSu?.urlAnhDaiDien) {
												setPreviewImage(item.nhanSu.urlAnhDaiDien);
												setPreviewOpen(true);
											}
										}}
									>
										<Avatar
											size='large'
											src={
												item.nhanSu?.urlAnhDaiDien ||
												(item.nhanSu?.gioiTinh === 'Nữ' ? '/images/teacher-female.svg' : '/images/teacher-male.svg')
											}
										/>
									</div>
								}
								title={
									item.nhanSu?.ten || item.tenNhanSu ? (
										`${item.nhanSu?.ten ? [item.nhanSu.hoDem, item.nhanSu.ten].join(' ') : item.tenNhanSu}`
									) : (
										<i>Không tìm thấy thông tin</i>
									)
								}
								description={
									<>
										{item.nhanSu?.email ? <a href={`mailto:${item.nhanSu.email}`}>{item.nhanSu.email}</a> : <i>--</i>} |{' '}
										{item.nhanSu?.sdtCaNhan ? (
											<a href={`tel:${item.nhanSu.sdtCaNhan}`}>{formatPhoneNumber(item.nhanSu.sdtCaNhan)}</a>
										) : (
											<i>--</i>
										)}
									</>
								}
							/>
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
