import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { getPublicAssetPath } from '@/utils/path';
import { formatPhoneNumber } from '@/utils/utils';
import { Avatar, Image, Input, List } from 'antd';
import { useMemo, useState } from 'react';
import { useIntl } from 'umi';

type TNhanSu = Pick<LopHocPhan.IRecordNhanSuLopHP, 'tenNhanSu' | 'maNhanSu' | 'nhanSu' | 'nhanSuSsoId'>;

const DanhSachGiangVien = (props: { danhSachNhanSu?: Partial<TNhanSu>[] }) => {
	const intl = useIntl();
	const { danhSachNhanSu } = props;
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [searchText, setSearchText] = useState('');

	const filteredList = useMemo(() => {
		const keyword = searchText.trim().toLowerCase();
		if (!keyword) return danhSachNhanSu ?? [];

		return (danhSachNhanSu ?? []).filter((item) => {
			const hoTen = item.nhanSu?.ten
				? [item.nhanSu?.hoDem, item.nhanSu?.ten].filter(Boolean).join(' ')
				: (item.tenNhanSu ?? '');
			const email = item.nhanSu?.email ?? '';
			const sdt = item.nhanSu?.sdtCaNhan ?? '';
			const ma = item.maNhanSu ?? '';

			return [hoTen, email, sdt, ma].some((field) => field.toLowerCase().includes(keyword));
		});
	}, [danhSachNhanSu, searchText]);

	return (
		<div>
			<Input.Search
				allowClear
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
				placeholder={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.dssv.search.gv' })}
				style={{ marginBottom: 12 }}
			/>
			{filteredList.length ? (
				<List
					itemLayout='horizontal'
					size='small'
					dataSource={filteredList}
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
											(item.nhanSu?.gioiTinh === 'Nữ'
												? getPublicAssetPath('images/teacher-female.svg')
												: getPublicAssetPath('images/teacher-male.svg'))
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
											<i>{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.dssv.empty' })}</i>
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
					<i>{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.dssv.empty2' })}</i>
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
