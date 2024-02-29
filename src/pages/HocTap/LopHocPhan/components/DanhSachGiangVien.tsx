import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { Avatar, List } from 'antd';

type TNhanSu = Pick<LopHocPhan.IRecordNhanSuLopHP, 'tenNhanSu' | 'maNhanSu' | 'nhanSu' | 'nhanSuSsoId'>;

const DanhSachGiangVien = (props: { danhSachNhanSu?: Partial<TNhanSu>[]; title?: string }) => {
	const { title, danhSachNhanSu } = props;

	return (
		<>
			<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>{title ?? 'Giảng viên'}</h4>
			{danhSachNhanSu?.length ? (
				<List
					grid={{
						xs: 1,
						sm: 2,
						md: 2,
						lg: 3,
						xl: 3,
						xxl: 4,
					}}
					itemLayout='horizontal'
					dataSource={danhSachNhanSu}
					renderItem={(item) => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Avatar
										size='large'
										src={
											item.nhanSu?.urlAnhDaiDien ||
											(item.nhanSu?.gioiTinh === 'Nữ' ? '/images/teacher-female.svg' : '/images/teacher-male.svg')
										}
									/>
								}
								title={
									item.nhanSu?.ten || item.tenNhanSu ? (
										`Họ tên: ${item.nhanSu?.ten ? [item.nhanSu.hoDem, item.nhanSu.ten].join(' ') : item.tenNhanSu}`
									) : (
										<i>Không tìm thấy thông tin</i>
									)
								}
								description={
									<>
										<div>
											Email:{' '}
											{item.nhanSu?.email ? <a href={`mailto:${item.nhanSu.email}`}>{item.nhanSu.email}</a> : <i>--</i>}
										</div>
										<div>
											Số điện thoại:{' '}
											{item.nhanSu?.sdtCaNhan ? (
												<a href={`tel:${item.nhanSu.sdtCaNhan}`}>{formatPhoneNumber(item.nhanSu.sdtCaNhan)}</a>
											) : (
												<i>--</i>
											)}
										</div>
									</>
								}
							/>
						</List.Item>
					)}
				/>
			) : (
				<div style={{ marginBottom: 24 }}>Không có thông tin giảng viên</div>
			)}
		</>
	);
};

export default DanhSachGiangVien;
