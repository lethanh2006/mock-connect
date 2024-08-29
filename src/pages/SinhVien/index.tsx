import FormSinhVien from '@/pages/SinhVien/components/Form';
import { exportLyLich } from '@/services/DaoTao/SinhVien';
import { EditOutlined, LeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tooltip } from 'antd';
import fileDownload from 'js-file-download';
import { useState } from 'react';
import { useModel } from 'umi';
import PreviewHoSo from './components/PreviewHoSo';
import './components/style.less';
import { SelectDotCapNhat } from '@/pages/DotCapNhatHoSo/select';
import moment from 'moment';

const ThongTinSinhVienPage = () => {
	const { record, loading, setLoading } = useModel('sinhvien.sinhvien');
	const [isCapNhat, setIsCapNhat] = useState<boolean>(false);
	const { record: recordDot, setRecord: setRecordDot } = useModel('daotao.dotcapnhathoso');
	const ngoaiThoiGian = record?.choPhepSua
		? false
		: moment().isBefore(moment(recordDot?.thoiGianBatDau)) || moment().isAfter(moment(recordDot?.thoiGianKetThuc));
	// const [currentStep, setCurrentStep] = useState<string>('0');
	// const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1200px)' });

	// useEffect(() => {
	//   setCurrentStep('0');
	// }, [record?.ssoId]);

	// const onChangeStep = (step: string) => {
	//   setCurrentStep(step);
	// };

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
		<Card title='Thông tin cá nhân'>
			{isCapNhat ? (
				<>
					<Space style={{ marginBottom: 12 }} wrap>
						<Button icon={<LeftOutlined />} onClick={() => setIsCapNhat(false)}>
							Quay lại
						</Button>
					</Space>
					<FormSinhVien onCancel={() => setIsCapNhat(false)} />
				</>
			) : (
				<>
					{' '}
					<Space style={{ marginBottom: 12 }} wrap>
						<SelectDotCapNhat
							style={{ width: 300 }}
							isSetRecord
							value={recordDot?._id}
							onChange={(val: any, option: { rawData: any }) => {
								const rawData = option?.rawData;
								setRecordDot(rawData);
							}}
						/>
						{record?.ssoId ? (
							<>
								<Tooltip
									title={
										(ngoaiThoiGian&&!record?.choPhepSua)
											? `Ngoài thời gian cập nhật hồ sơ (${moment(recordDot?.thoiGianBatDau).format(
													'HH:mm DD/MM/YYYY',
											  )} - ${moment(recordDot?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')})`
											: 'Cập nhật hồ sơ'
									}
								>
									<Button
										disabled={ngoaiThoiGian}
										type='primary'
										icon={<EditOutlined />}
										onClick={() => setIsCapNhat(true)}
									>
										Cập nhật hồ sơ
									</Button>
								</Tooltip>
								<Button icon={<PrinterOutlined />} onClick={onExport} loading={loading}>
									In hồ sơ
								</Button>
							</>
						) : null}
					</Space>
					<PreviewHoSo />
				</>
			)}

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
		</Card>
	);
};

export default ThongTinSinhVienPage;
