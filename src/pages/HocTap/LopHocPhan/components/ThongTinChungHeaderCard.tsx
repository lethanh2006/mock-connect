import ButtonExtend from '@/components/Table/ButtonExtend';
import FilterLopHocPhan from '@/pages/DaoTao/LopHocPhan/FilterLopHocPhan';
import { primaryColor } from '@/services/base/constant';
import { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import dayjs from '@/utils/dayjs';
import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useIntl, useModel, useNavigate } from 'umi';
import ModalThongTinGiangVien from './ModalGiangVien';
import './style.less';
const { Text } = Typography;

const ThongTinChungHeaderCard = (props: { onShowDeCuong: () => void }) => {
	const intl = useIntl();
	const { loading, record } = useModel('lophocphan.lophocphan');
	const [selectedGiangVien, setSelectedGiangVien] = useState<ToChucNhanSu.INhanSu>();
	const [visibleGvDetailModal, setVisibleGvDetailModal] = useState(false);
	const backgroundRef = useRef(Math.floor(Math.random() * 6));
	const randomBackground = `/images/isolation-mode-${backgroundRef.current}.svg`;
	const navigate = useNavigate();
	const visibleFilter = useMediaQuery({ query: '(max-width: 1200px)' });

	let allThoiKhoaBieu = record?.thoiKhoaBieuList ?? [];
	allThoiKhoaBieu = allThoiKhoaBieu.concat(record?.children?.flatMap((child) => child.thoiKhoaBieuList ?? []) ?? []);
	const past = allThoiKhoaBieu.filter((i) => dayjs().isAfter(dayjs(i?.ngay))).length;
	const progress = Math.round((past / allThoiKhoaBieu.length) * 100) || 0;

	const isCompleted = progress === 100 || record?.diem?.diemHpSvHk?.diemKthp;

	return (
		<Spin spinning={loading}>
			<Card
				className='thong-tin-chung-header-card'
				variant='borderless'
				style={{ backgroundImage: `url(${randomBackground})` }}
				title={
					<Space align='center' size={8} wrap>
						<ButtonExtend
							type='text'
							icon={<ArrowLeftOutlined style={{ color: '#333' }} />}
							onClick={() => navigate('/hoc-tap/lop-tin-chi')}
							tooltip={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.quaylai' })}
						/>
						{record?.hocPhan?.ten ? (
							<Tooltip title={intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.chitiet' })}>
								<a onClick={() => props.onShowDeCuong?.()} style={{ color: '#333' }}>
									{record?.hocPhan?.ten ?? ''}
									<InfoCircleOutlined style={{ color: primaryColor }} />
								</a>
							</Tooltip>
						) : (
							<i>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.chuacapnhat' })}</i>
						)}
						<Tag color='red'>
							{record?.hocPhan?.soTinChi ?? '--'} {intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.tinchi' })}
						</Tag>
						{isCompleted ? (
							<Tag color='red'>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.dakt' })}</Tag>
						) : (
							<Tag color='green'>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.danghoc' })}</Tag>
						)}
					</Space>
				}
				extra={
					!visibleFilter ? (
						<FilterLopHocPhan
							miniHocKy
							width={200}
							label='ten'
							onChange={(id) => {
								if (id) navigate(`/hoc-tap/lop-tin-chi/${id}${window.location.hash}`);
							}}
						/>
					) : null}
			>
				{/* Info Row */}
				<Row gutter={[24, 0]} style={{ marginBottom: '36px' }}>
					<Col>
						<Text>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.mahp' })}</Text>
						<Text strong style={{ marginLeft: '8px' }}>
							{record?.hocPhan?.ma ?? ''}
						</Text>
					</Col>
					<Col>
						<Text>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.nhomlop' })}</Text>
						<Text
							strong
							style={{ marginLeft: '8px' }}
							copyable={{
								text: record?.ten,
								tooltips: [
									intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.saochep1' }),
									intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.saochep2' }),
								],
							}}
						>
							{record?.soThuTuLop ?? ''}
						</Text>
					</Col>
					<Col>
						<Text>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.kyhoc' })}</Text>
						<Text strong style={{ marginLeft: '8px' }}>
							{record?.hocKy?.ten ?? ''}
						</Text>
					</Col>
					<Col>
						<Text>{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.gv' })}</Text>
						{(record?.nhanSuList ?? []).length > 0 ? (
							<Text strong style={{ marginLeft: 8 }}>
								{(record?.nhanSuList ?? []).map((item, index) => (
									<span key={index}>
										<Link
											to='#!'
											onClick={(e) => {
												e.preventDefault();
												setSelectedGiangVien(item?.nhanSu);
												setVisibleGvDetailModal(true);
											}}
										>
											{item?.nhanSu?.hoTen}
										</Link>
										{index < (record?.nhanSuList?.length ?? 0) - 1 && <span>, </span>}
									</span>
								))}
							</Text>
						) : (
							<Text style={{ marginLeft: 8, color: '#999' }}>
								{intl.formatMessage({ id: 'lophocphan.id.thongtinchungheader.khongco' })}
							</Text>
						)}
					</Col>
				</Row>

				<ModalThongTinGiangVien
					visible={visibleGvDetailModal}
					onCancel={() => setVisibleGvDetailModal(false)}
					giangVien={selectedGiangVien}
				/>
			</Card>
		</Spin>
	);
};

export default ThongTinChungHeaderCard;
