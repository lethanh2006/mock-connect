import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportLyLich } from '@/services/DaoTao/SinhVien';
import dayjs from '@/utils/dayjs';
import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalCapNhatAnhNhanDien from './CapNhatKhuonMat/Modal';
import FormSinhVien from './components/Form';
import PreviewHoSo from './components/PreviewHoSo';
import './components/style.less';
import ModalHocBaSinhVien from './HocBa/components/Modal';

const ThongTinSinhVienPage = () => {
	const { record, loading, setLoading } = useModel('sinhvien.sinhvien');
	const { record: recordDot, getAllModel: getDotCapNhat } = useModel('daotao.dotcapnhathoso');
	const [isCapNhat, setIsCapNhat] = useState<boolean>(false);
	const [visibleCapNhat, setVisibleCapNhat] = useState<boolean>(false);
	const [visibleHocBa, setVisibleHocBa] = useState<boolean>(false);
	const choPhepSua =
		record?.choPhepSua ||
		(recordDot?.thoiGianBatDau &&
			recordDot.thoiGianKetThuc &&
			dayjs().isSameOrBefore(dayjs(recordDot?.thoiGianKetThuc), 'day') &&
			dayjs().isSameOrAfter(dayjs(recordDot?.thoiGianBatDau), 'day'));

	useEffect(() => {
		if (!recordDot?._id) getDotCapNhat(true, undefined, { kichHoat: true });
	}, []);

	const onExport = () => {
		if (record?.ssoId) {
			setLoading(true);
			exportLyLich(record?.ssoId)
				.then((res) => fileDownload(res.data, `Hồ sơ ${record.ten}.pdf`))
				.catch((er) => console.log(er))
				.finally(() => setLoading(false));
		}
	};

	return (
		<Card title='Thông tin cá nhân' variant='borderless' className='card-borderless card-big-title'>
			<Card variant='borderless'>
				{recordDot?._id && choPhepSua ? (
					<Alert
						message={
							<>
								Đợt cập nhật hồ sơ "<b>{recordDot.tenDot}</b>" từ ngày{' '}
								<b>{dayjs(recordDot.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến ngày{' '}
								<b>{dayjs(recordDot.thoiGianKetThuc).format('DD/MM/YYYY')}</b>
							</>
						}
						style={{ marginBottom: 12 }}
					/>
				) : null}

				{isCapNhat ? (
					<>
						<Space style={{ marginBottom: 12 }} wrap>
							<Button icon={<LeftOutlined />} onClick={() => setIsCapNhat(false)}>
								Quay lại
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
									icon={<EditOutlined />}
									onClick={() => setIsCapNhat(true)}
									tooltip={!choPhepSua ? 'Ngoài thời gian cập nhật hồ sơ' : 'Cập nhật hồ sơ'}
									notHideText
								>
									Cập nhật hồ sơ
								</ButtonExtend>

								{/* <ButtonExtend icon={<OrderedListOutlined />} onClick={() => setVisibleHocBa(true)}>
								Học bạ số
							</ButtonExtend> */}

								{/* <ButtonExtend icon={<SmileOutlined />} onClick={() => setVisibleCapNhat(true)}>
								Cập nhật ảnh nhận diện
							</ButtonExtend> */}

								{/* <Button icon={<PrinterOutlined />} onClick={onExport} loading={loading}>
									In hồ sơ
								</Button> */}
							</Space>
						) : null}

						<PreviewHoSo />
					</>
				)}
			</Card>

			{/* <Tabs
        activeKey={currentStep}
        tabPosition={isTabletOrMobile ? 'top' : 'left'}
        onChange={record?.ssoId ? onChangeStep : undefined}
      >
        <Tabs.TabPane tab="Thông tin cá nhân" key={'0'}>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quá trình học tập" key={'1'} disabled={!record?.ssoId}>
          <FormQuaTrinhHocTap />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Khen thưởng - Kỷ luật" key={'2'} disabled={!record?.ssoId}>
          <FormKhenThuongKyLuat />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Công nợ" key={'7'} disabled={!record?.ssoId}>
          <FormCongNoSinhVien />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Cố vấn học tập" key={'3'} disabled={!record?.ssoId}>
          <FormCoVanHocTap />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thông tin nội/ngoại trú" key={'4'} disabled={!record?.ssoId}>
          <NoiNgoaiTruSinhVienPage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tốt nghiệp & Văn bằng" key={'5'} disabled={!record?.ssoId}>
          <FormTotNghiepVanBang />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Việc làm" key={'6'} disabled={!record?.ssoId}>
          <ViecLamSinhVienPage />
        </Tabs.TabPane>
      </Tabs> */}

			{/* <div className="form-footer">
        <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
      </div> */}

			<ModalCapNhatAnhNhanDien visible={visibleCapNhat} setVisible={setVisibleCapNhat} />

			<ModalHocBaSinhVien visible={visibleHocBa} setVisible={setVisibleHocBa} />
		</Card>
	);
};

export default ThongTinSinhVienPage;
