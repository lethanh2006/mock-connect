import { exportLyLich } from '@/services/DaoTao/SinhVien';
import { PrinterOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import fileDownload from 'js-file-download';
import { useModel } from 'umi';
import PreviewHoSo from './components/PreviewHoSo';

const ThongTinSinhVienPage = () => {
	const { record } = useModel('sinhvien.sinhvien');
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
			exportLyLich(record?.ssoId).then((res) => fileDownload(res.data, `Hồ sơ ${record.ten}.pdf`));
		}
	};

	return (
		<Card title='Thông tin cá nhân'>
			<Space style={{ marginBottom: 12 }} wrap>
				{record?.ssoId ? (
					<Button icon={<PrinterOutlined />} onClick={onExport}>
						In hồ sơ
					</Button>
				) : null}
			</Space>

			<PreviewHoSo />
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
