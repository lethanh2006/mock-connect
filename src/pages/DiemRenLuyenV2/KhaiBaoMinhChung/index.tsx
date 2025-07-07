import DanhSachMinhChung from '@/pages/DiemRenLuyenV2/MinhChung/CauHinh/DanhSach';
import { useModel } from '@@/plugin-model/useModel';
import { Alert, Card, Space } from 'antd';
import moment from 'moment';
import {  useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import SelectDotDiemRenLuyen from '../Dot/Select';
import StepDotChamDiemRenLuyen from '../Dot/Step';
import KhaiBaoMinhChung from '../MinhChung/KhaiBao';

const KhaiBaoMinhChungPage = () => {
	const { record: recDot, setRecord: setDot, danhSach: danhSachDot } = useModel('diemrenluyenv2.dot');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('25%');
	const ngoaiThoiGian =
		recDot?.thoiGianTiepNhanMinhChung &&
		(moment().isAfter(recDot.thoiGianTiepNhanMinhChung.thoiGianKetThuc) ||
			moment().isBefore(recDot?.thoiGianTiepNhanMinhChung?.thoiGianBatDau));

	const handlePaneSizeChange = (size: any) => setPaneSize(size[0]);

	return (
		<>
			<Card
				title={
					<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
						<span>Khai báo minh chứng</span>
						<SelectDotDiemRenLuyen
							style={{ width: 300 }}
							value={recDot?._id}
							onChange={(val) => setDot(danhSachDot.find((i) => i._id === val))}
							isSetRecord={true}
						/>
					</Space>
				}
			>
				{!recDot || ngoaiThoiGian ? (
					<Alert
						showIcon
						message='Ngoài thời gian khai báo minh chứng cho đợt này'
						style={{ marginBottom: 18 }}
						type='warning'
					/>
				) : null}

				<StepDotChamDiemRenLuyen />

				<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
					<Pane initialSize={paneSize} minSize='20%'>
						<DanhSachMinhChung />
					</Pane>

					<Pane minSize='40%'>
            <KhaiBaoMinhChung />
					</Pane>
				</SplitPane>
			</Card>
		</>
	);
};
export default KhaiBaoMinhChungPage;
