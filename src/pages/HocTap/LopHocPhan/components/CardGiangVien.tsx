import PageCard from '@/components/PageCard';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { Avatar, Empty, List } from 'antd';
import classNames from 'classnames';
import { useIntl } from 'umi';

type TNhanSu = Pick<LopHocPhan.IRecordNhanSuLopHP, 'tenNhanSu' | 'maNhanSu' | 'nhanSu' | 'nhanSuSsoId'>;

const CardGiangVienLop = (props: {
	danhSachNhanSu?: TNhanSu[];
	title?: string;
	loading?: boolean;
	isHighlight?: boolean;
}) => {
	const intl = useIntl();
	const {
		title = intl.formatMessage({ id: 'lophanhchinh.thongtinchung.giangvien' }),
		danhSachNhanSu,
		loading,
		isHighlight,
	} = props;

	return (
		<PageCard
			level={4}
			title={title}
			size='small'
			loading={loading}
			hideInnerCard
			className={classNames({ 'card-highlight': isHighlight })}
		>
			{danhSachNhanSu?.length ? (
				<List
					grid={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
					itemLayout='horizontal'
					size='small'
					dataSource={danhSachNhanSu}
					renderItem={(item) => (
						<List.Item style={{ padding: 0 }}>
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
										<i>{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.covanhoctap.empty' })}</i>
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
					<Empty
						description={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.giangvien.empty' })}
						image={Empty.PRESENTED_IMAGE_SIMPLE}
					/>
				</div>
			)}
		</PageCard>
	);
};

export default CardGiangVienLop;
