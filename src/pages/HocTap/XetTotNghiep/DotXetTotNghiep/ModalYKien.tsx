import { useModel } from 'umi';

const ModalYKien = (props: { type: 'phan-hoi' | 'hoan' }) => {
	const { yKienXetTotNghiepModel, record } = useModel('sinhvien.xettotnghiep');
	return <div>ModalYKien</div>;
};

export default ModalYKien;
