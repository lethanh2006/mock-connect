import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { Avatar, Card, Empty, List } from 'antd';

type TNhanSu = Pick<LopHocPhan.IRecordNhanSuLopHP, 'tenNhanSu' | 'maNhanSu' | 'nhanSu' | 'nhanSuSsoId'>;

const CardGiangVienLop = (props: { danhSachNhanSu?: TNhanSu[]; title?: string; loading?: boolean }) => {
	const { title = 'Giảng viên', danhSachNhanSu, loading } = props;

	return (
		<Card title={title} size='small' loading={loading}>
			{danhSachNhanSu?.length ? (
				<List
					grid={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
					itemLayout='horizontal'
					size='small'
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
					<Empty description='Không có thông tin giảng viên' image={Empty.PRESENTED_IMAGE_SIMPLE} />
				</div>
			)}
		</Card>
	);
};

export default CardGiangVienLop;
