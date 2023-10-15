import React from 'react';
import { useModel } from 'umi';

const ModalChungChiCTDT = () => {
	const { record, visibleForm, setVisibleForm } = useModel('sinhvien.chungchictdt');

	return <div>ModalChungChiCTDT</div>;
};

export default ModalChungChiCTDT;
