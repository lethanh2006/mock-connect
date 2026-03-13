import DanhSachMinhChungCVHT from '@/pages/DiemRenLuyenV2/MinhChung/CauHinh/DanhSachCVHT';
import KhaiBaoMinhChungCVHT from '@/pages/DiemRenLuyenV2/MinhChung/KhaiBao/DanhSachKhaiBaoCVHT';
import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import StepDotChamDiemRenLuyen from '../../Dot/Step';

const MinhChungDrlBcs = (props: { idLopHc: string }) => {
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('25%');
	const minhChungRef = useRef(null);
	const { idLopHc } = props;

	const handlePaneSizeChange = (size: any) => setPaneSize(size[0]);

	return (
		<>
			<StepDotChamDiemRenLuyen />
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='20%'>
					<DanhSachMinhChungCVHT idLopHanhChinh={idLopHc} ref={minhChungRef} />
				</Pane>

				<Pane minSize='40%'>
					<KhaiBaoMinhChungCVHT
						idLopHanhChinh={idLopHc}
						getDataMinhChung={() => {
							if (minhChungRef?.current) {
								//@ts-ignore
								minhChungRef?.current?.getDataLoaiMinhChung();
							}
						}}
					/>
				</Pane>
			</SplitPane>
		</>
	);
};

export default MinhChungDrlBcs;
