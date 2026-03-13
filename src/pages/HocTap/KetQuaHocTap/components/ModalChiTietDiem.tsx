import ButtonExtend from '@/components/Table/ButtonExtend';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { colorTrangThaiHocTap, ETrangThaiHocTap, trangThaiHocTap } from '@/services/DaoTao/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, message, Modal, Popover, Space, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalHocPhan from '../../../DaoTao/DeCuongHocPhan/ModalHocPhan';
import ModalQuyDoiDiem from '../../QuyDoiDiem/components/Modal';
import DetailKetQuaHocTap from './DetailKetQuaHocTap';

const ModalChiTietDiem = (
	props: {
		visible: boolean;
		setVisible: (val: boolean) => void;
		listDiem: LopHocPhan.IDiemHpSvHk[];
		/** Đề cương của đề cương học phần học kỳ */
		deCuongId?: string;

		// Chương trình khung
		trangThaiHoc?: ETrangThaiHocTap;
		khoiChuongTrinh?: Partial<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>;
		colorKhoiKienThuc?: string;
		maKhoaNganh?: string;
	} & Partial<Pick<ChuongTrinhDaoTao.TTienTrinhThucTe, 'hocPhan'>>,
) => {
	const intl = useIntl();
	const { ngoaiQuyDoiDiem } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { record } = useModel('lophocphan.lophocphan');

	const { visible, setVisible, hocPhan, listDiem, trangThaiHoc, khoiChuongTrinh, maKhoaNganh } = props;
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [visibleCongNhan, setVisibleCongNhan] = useState<boolean>(false);
	const deCuongId = props.deCuongId ?? hocPhan?.deCuongHienTaiId;

	const handleShowDeCuong = async () => {
		if (deCuongId) setVisibleDeCuong(true);
		else message.error('Không tìm thấy đề cương học phần');
	};

	const renderHocPhanCt = (dsHocPhan?: ChuongTrinhDaoTao.THocPhanTuongQuan[], label?: string) => (
		<Descriptions.Item label={label} span={3}>
			{dsHocPhan?.length ? (
				<ul style={{ marginBottom: 0, paddingLeft: 14 }}>
					{dsHocPhan?.map((item) => (
						<li key={item.ma}>
							{item.ma} - {item.ten}
						</li>
					))}
				</ul>
			) : (
				<i style={{ color: '#aaa' }}>{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.khongcothongtin' })}</i>
			)}
		</Descriptions.Item>
	);

	return (
		<>
			<Modal
				title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.title' })}
				open={visible}
				onCancel={() => setVisible(false)}
				footer={
					<Space wrap>
						{/* <ButtonExtend icon={<StarOutlined />} title='Quan tâm học phần'>
							Quan tâm
						</ButtonExtend> */}
						{trangThaiHoc === ETrangThaiHocTap.CHUA_HOC ? (
							<ButtonExtend
								tooltip={
									ngoaiQuyDoiDiem ? intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.khongcodot' }) : null
								}
								disabled={ngoaiQuyDoiDiem}
								onClick={() => setVisibleCongNhan(true)}
								icon={<PlusCircleOutlined />}
							>
								{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan' })}
							</ButtonExtend>
						) : null}

						<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</Space>
				}
				width={800}
			>
				{hocPhan ? (
					<Descriptions
						title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.thongtin' })}
						column={{ xs: 1, sm: 1, md: 3 }}
					>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hp' })} span={3}>
							{hocPhan?.ten ? (
								<Tooltip title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chitiet' })}>
									<a onClick={handleShowDeCuong}>
										<b>{hocPhan?.ten ?? ''}</b>
									</a>
								</Tooltip>
							) : (
								<i>{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chuacapnhat' })}</i>
							)}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.mahp' })}>
							{hocPhan?.ma}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.stc' })}>
							{hocPhan?.soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tc' })}
						</Descriptions.Item>
						{trangThaiHoc ? (
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.trangthai' })}>
								<Tag color={colorTrangThaiHocTap[trangThaiHoc]}>{trangThaiHocTap[trangThaiHoc]}</Tag>
							</Descriptions.Item>
						) : null}
					</Descriptions>
				) : null}

				{khoiChuongTrinh ? (
					<Descriptions
						title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chuongtrinh' })}
						style={{ marginTop: 12 }}
					>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tt' })}>
							<b>{khoiChuongTrinh.soThuTuKy}</b>
						</Descriptions.Item>
						<Descriptions.Item
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.khoikienthuc' })}
							span={2}
						>
							<span style={{ color: props.colorKhoiKienThuc }}>
								{khoiChuongTrinh.khoiKienThuc?.ten ?? khoiChuongTrinh.maKhoiKienThuc}
							</span>
						</Descriptions.Item>
						{/* Sẽ được truyền vào từ CardKhoiHocPhan.tsx */}
						{khoiChuongTrinh.ten && (
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tuchon' })} span={3}>
								{khoiChuongTrinh.ten}
							</Descriptions.Item>
						)}
						{renderHocPhanCt(
							khoiChuongTrinh.dsHocPhanTienQuyet,
							intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tienquyet' }),
						)}
						{renderHocPhanCt(
							khoiChuongTrinh.dsHocPhanTruoc,
							intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hptruoc' }),
						)}
						{renderHocPhanCt(
							khoiChuongTrinh.dsHocPhanSongHanh,
							intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hpsongnganh' }),
						)}
					</Descriptions>
				) : null}

				{(trangThaiHoc === undefined || trangThaiHoc !== ETrangThaiHocTap.CHUA_HOC) && listDiem.length
					? listDiem
							.sort((a, b) => (b.maHocKy ?? '').localeCompare(a.maHocKy ?? '')) // Sort DESC
							.map((diem, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<div style={{ marginBottom: index === 1 ? undefined : 18 }} key={index}>
									<h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 10, marginTop: 12 }}>
										Chi tiết kết quả học tập
										{listDiem.length > 1
											? ` ${intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hoclan' })} ${listDiem.length - index}`
											: null}{' '}
										<Popover
											content={
												<Descriptions
													column={1}
													title={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hoctap' })}
													style={{ maxWidth: 300 }}
												>
													<Descriptions.Item
														label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.kyhoc' })}
														span={2}
													>
														{diem?.hocKy?.ten ?? diem.maHocKy ?? '--'}
													</Descriptions.Item>
													<Descriptions.Item
														label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tenlop' })}
													>
														{diem?.tenLopHocPhan ?? '--'}
													</Descriptions.Item>
												</Descriptions>
											}
										>
											<InfoCircleOutlined />
										</Popover>
									</h4>

									<DetailKetQuaHocTap key={diem._id} diemHpSvHk={diem} />
								</div>
							))
					: null}
			</Modal>

			<ModalHocPhan
				visible={visibleDeCuong}
				setVisible={setVisibleDeCuong}
				title={`${intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chitiethp' })} ${record?.hocKy?.ten ? `- ${record?.hocKy?.ten ?? ''}` : ''}`}
				deCuongId={deCuongId}
			/>

			{trangThaiHoc === ETrangThaiHocTap.CHUA_HOC ? (
				<ModalQuyDoiDiem
					visible={visibleCongNhan}
					setVisible={setVisibleCongNhan}
					hocPhan={hocPhan}
					maKhoaNganh={maKhoaNganh}
				/>
			) : null}
		</>
	);
};

export default ModalChiTietDiem;
