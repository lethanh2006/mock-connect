import ButtonExtend from '@/components/Table/ButtonExtend';
// import { exportLyLich } from '@/services/DaoTao/SinhVien';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { IconPencil01, Icon2ChervolLeftLine } from '@/components/Icons';
import { Alert, Button, Card, Space, Spin } from 'antd';
// import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalCapNhatAnhNhanDien from './CapNhatKhuonMat/Modal';
import FormSinhVien from './components/Form';
import PreviewHoSo from './components/PreviewHoSo';
import './components/style.less';
import ModalHocBaSinhVien from './HocBa/components/Modal';

const ThongTinSinhVienPage = () => {
	const intl = useIntl();
	const { record, loading /* , setLoading */ /* , getThongTinCuaToiModel */ } = useModel('sinhvien.sinhvien');
	const { record: recordDot /* , getAllModel: getDotCapNhat */ } = useModel('daotao.dotcapnhathoso');
	const [isCapNhat, setIsCapNhat] = useState<boolean>(false);
	const [visibleCapNhat, setVisibleCapNhat] = useState<boolean>(false);
	const [visibleHocBa, setVisibleHocBa] = useState<boolean>(false);
	const choPhepSua =
		record?.choPhepSua ||
		(recordDot?.thoiGianBatDau &&
			recordDot.thoiGianKetThuc &&
			dayjs().isSameOrBefore(dayjs(recordDot?.thoiGianKetThuc), 'day') &&
			dayjs().isSameOrAfter(dayjs(recordDot?.thoiGianBatDau), 'day'));

	// useEffect(() => {
	// 	if (!recordDot?._id) getDotCapNhat(true, undefined, { kichHoat: true });
	// }, []);

	// const onExport = () => {
	// 	if (record?.ssoId) {
	// 		setLoading(true);
	// 		exportLyLich(record?.ssoId)
	// 			.then((res) => fileDownload(res.data, `Hồ sơ ${record.ten}.pdf`))
	// 			.catch((er) => console.log(er))
	// 			.finally(() => setLoading(false));
	// 	}
	// };

	const previewHeader = (
		<>
			{recordDot?._id ? (
				<Alert
					type='info'
					showIcon
					message={intl.formatMessage(
						{ id: 'thongtincanhan.dotcapnhat' },
						{
							tenDot: recordDot?.tenDot,
							start: formatDate(recordDot?.thoiGianBatDau),
							end: formatDate(recordDot?.thoiGianKetThuc),
							b: (chunks) => <b>{chunks}</b>,
						},
					)}
					style={{ marginBottom: 12 }}
				/>
			) : null}

			{record?.ssoId ? (
				<Space style={{ marginBottom: 12 }} wrap>
					<ButtonExtend
						disabled={!choPhepSua}
						type='primary'
						icon={<IconPencil01 />}
						onClick={() => setIsCapNhat(true)}
						tooltip={
							!choPhepSua
								? intl.formatMessage({ id: 'thongtincanhan.ngoaithoigian' })
								: intl.formatMessage({ id: 'thongtincanhan.capnhathoso' })
						}
						notHideText
					>
						{intl.formatMessage({ id: 'thongtincanhan.capnhathoso' })}
					</ButtonExtend>

					{/* <ButtonExtend icon={<OrderedListOutlined />} onClick={() => setVisibleHocBa(true)}>
						{intl.formatMessage({ id: 'thongtincanhan.hocbaso' })}
					</ButtonExtend> */}

					{/* <ButtonExtend icon={<SmileOutlined />} onClick={() => setVisibleCapNhat(true)}>
						{intl.formatMessage({ id: 'thongtincanhan.anhdaidien' })}
					</ButtonExtend> */}

					{/* <Button icon={<PrinterOutlined />} onClick={onExport} loading={loading}>
						{intl.formatMessage({ id: 'thongtincanhan.inhoso' })}
					</Button> */}
				</Space>
			) : null}
		</>
	);

	return (
		<Card
			title={intl.formatMessage({ id: 'menu.MyProfile' })}
			variant='borderless'
			className='card-borderless card-big-title has-indicator'
		>
			{/* <Card variant='borderless'>
				{recordDot?._id && choPhepSua ? (
					<Alert
						message={intl.formatMessage(
							{ id: 'thongtincanhan.dotcapnhat' },
							{
								tenDot: recordDot.tenDot,
								start: formatDate(recordDot.thoiGianBatDau),
								end: formatDate(recordDot.thoiGianKetThuc),
								b: (chunks) => <b>{chunks}</b>,
							},
						)}
						style={{ marginBottom: 12 }}
					/>
				) : null}

			{isCapNhat ? (
				<>
					<Space style={{ marginBottom: 12 }} wrap>
						<Button icon={<Icon2ChervolLeftLine />} onClick={() => setIsCapNhat(false)}>
							{intl.formatMessage({ id: 'thongtincanhan.quaylai' })}
						</Button>
					</Space>

					<Spin spinning={loading}>
						<FormSinhVien onCancel={() => setIsCapNhat(false)} />
					</Spin>
				</>
			) : (
				<>
					{record?.ssoId ? (
						<Space style={{ marginBottom: 12 }} wrap>
							<ButtonExtend
								disabled={!choPhepSua}
								type='primary'
								icon={<IconPencil01 />}
								onClick={() => setIsCapNhat(true)}
								tooltip={
									!choPhepSua
										? intl.formatMessage({ id: 'thongtincanhan.ngoaithoigian' })
										: intl.formatMessage({ id: 'thongtincanhan.capnhathoso' })
								}
								notHideText
							>
								{intl.formatMessage({ id: 'thongtincanhan.capnhathoso' })}
							</ButtonExtend>

						<Spin spinning={loading}>
							<FormSinhVien onCancel={() => setIsCapNhat(false)} />
						</Spin>
					</>
				) : (
					<>
						{record?.ssoId ? (
							<Space style={{ marginBottom: 12 }} wrap>
								<ButtonExtend
									disabled={!choPhepSua}
									type='primary'
									icon={<IconPencil01 />}
									onClick={() => setIsCapNhat(true)}
									tooltip={
										!choPhepSua
											? intl.formatMessage({ id: 'thongtincanhan.ngoaithoigian' })
											: intl.formatMessage({ id: 'thongtincanhan.capnhathoso' })
									}
									notHideText
								>
									{intl.formatMessage({ id: 'thongtincanhan.capnhathoso' })}
								</ButtonExtend>
							</Space>
						) : null}

						<PreviewHoSo />
					</>
				)}
			</Card> */}

			{isCapNhat ? (
				<>
					<Space style={{ marginBottom: 12 }} wrap>
						<Button icon={<Icon2ChervolLeftLine />} onClick={() => setIsCapNhat(false)}>
							{intl.formatMessage({ id: 'thongtincanhan.quaylai' })}
						</Button>
					</Space>

					<Card variant='borderless'>
						<Spin spinning={loading}>
							<FormSinhVien onCancel={() => setIsCapNhat(false)} />
						</Spin>
					</Card>
				</>
			) : (
				<PreviewHoSo header={previewHeader} />
			)}

			{/* <Tabs
				activeKey={currentStep}
				tabPosition={isTabletOrMobile ? 'top' : 'left'}
				onChange={record?.ssoId ? onChangeStep : undefined}
			>
				<Tabs.TabPane tab='Thông tin cá nhân' key={'0'}></Tabs.TabPane>
				<Tabs.TabPane tab='Quá trình học tập' key={'1'} disabled={!record?.ssoId}>
					<FormQuaTrinhHocTap />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Khen thưởng - Kỷ luật' key={'2'} disabled={!record?.ssoId}>
					<FormKhenThuongKyLuat />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Công nợ' key={'7'} disabled={!record?.ssoId}>
					<FormCongNoSinhVien />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Cố vấn học tập' key={'3'} disabled={!record?.ssoId}>
					<FormCoVanHocTap />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Thông tin nội/ngoại trú' key={'4'} disabled={!record?.ssoId}>
					<NoiNgoaiTruSinhVienPage />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Tốt nghiệp & Văn bằng' key={'5'} disabled={!record?.ssoId}>
					<FormTotNghiepVanBang />
				</Tabs.TabPane>
				<Tabs.TabPane tab='Việc làm' key={'6'} disabled={!record?.ssoId}>
					<ViecLamSinhVienPage />
				</Tabs.TabPane>
			</Tabs> */}

			{/* <div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div> */}

			<ModalCapNhatAnhNhanDien visible={visibleCapNhat} setVisible={setVisibleCapNhat} />
			<ModalHocBaSinhVien visible={visibleHocBa} setVisible={setVisibleHocBa} />
		</Card>
	);
};

export default ThongTinSinhVienPage;
