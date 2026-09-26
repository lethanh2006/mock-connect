import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Button } from '@/components/Icons';
import { Card } from '@/components/PageCard';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { useModel } from 'umi';
import TabHocTapRenLuyenSinhVien from '../HocTapRenLuyen';

const ModalHocBaSinhVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const { visible, setVisible } = props;
	// const [currentStep, setCurrentStep] = useState<number>(0);

	// useEffect(() => {
	// 	if (record?.ssoId && visibleHocBa) getByIdModel(`${record.ssoId}/info`).then((res) => form.setFieldsValue(res));
	// 	setCurrentStep(0);
	// }, [record?.ssoId, visibleHocBa]);

	// const onChangeStep = (step: number) => {
	// 	setCurrentStep(step);
	// };

	return (
		<ModalExpandable
			width={1100}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			styles={{ body: { padding: 0 } }}
		>
			<Card
				bordered={false}
				title={
					<>
						Học bạ số{' '}
						<SelectSongNganh
							size='small'
							className='field-w-250'
							value={maKhoaNganh}
							onChange={(val) => setMaKhoaNganh(val)}
						/>
					</>
				}
			>
				{/* <Steps current={currentStep} onChange={onChangeStep} style={{ marginBottom: 18 }}>
					<Steps.Step title={intl.formatMessage({ id: 'sinhvien.hocba.tab1' })} icon={<ContactsOutlined />} />
					<Steps.Step title={intl.formatMessage({ id: 'sinhvien.hocba.tab2' })} icon={<OrderedListOutlined />} />
					<Steps.Step title={intl.formatMessage({ id: 'sinhvien.hocba.tab3' })} icon={<SolutionOutlined />} />
					<Steps.Step title={intl.formatMessage({ id: 'sinhvien.hocba.tab4' })} icon={<DeploymentUnitOutlined />} />
				</Steps> */}

				{/* {currentStep === 0 ? (
					<Form form={form} layout='vertical' disabled>
						<FormContentSinhVien form={form} editForm={false} />
					</Form>
				) : currentStep === 1 ? ( */}

				<TabHocTapRenLuyenSinhVien />

				{/* ) : currentStep === 2 ? (
					<>
						<ChungChiCdrPage hideSongNganh />

						<TotNghiepVanBangTab hideSongNganh collapse />
					</>
				) : (
					<>
						<FormKhenThuongKyLuat />

						<LichSuBaoLuuThoiHoc collapse />
					</>
				)} */}

				<div className='form-footer'>
					<Button variant='outline' onClick={() => setVisible(false)}>
						Đóng
					</Button>
				</div>
			</Card>
		</ModalExpandable>
	);
};

export default ModalHocBaSinhVien;
