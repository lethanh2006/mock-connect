import DanhSachDot from '@/pages/DiemRenLuyenV2/Dot/DanhSach';
import FormNhapPhieuDiem from '@/pages/DiemRenLuyenV2/PhieuDiemRenLuyen/components/Form';
import { Card } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import StepDotChamDiemRenLuyen from '../Dot/Step';

const KhaiBaoMinhChungPage = () => {
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('25%');
	const handlePaneSizeChange = (size: any) => setPaneSize(size[0]);

	return (
		<>
			<Card title={'Phiếu điểm rèn luyện'}>
				<StepDotChamDiemRenLuyen />
				<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
					<Pane initialSize={paneSize} minSize='20%'>
						<DanhSachDot />
					</Pane>

					<Pane minSize='40%'>
						<FormNhapPhieuDiem />
					</Pane>
				</SplitPane>
			</Card>
		</>
	);
};
export default KhaiBaoMinhChungPage;
