import { EStepSanPhamHoatDong } from '@/services/KhoaHoc/SanPhamNCKH/constants';
import { Card, Divider, Steps } from 'antd';
import { useModel } from 'umi';
import FormGiaoNopSanPham from './FormGiaoNopSanPham';
import TableQuyDoiGio from './TableQuyDoiGio';

const FormSanPhamHoatDong = (props: { getData: any; role: 'admin' | 'cbgv'; isDangThucHien?: boolean }) => {
	const { edit, current, setCurrent, setQuyDoiGio, setQuyDoiDiem } = useModel('khoahoc.sanphamnckh');
	const { record: recordLoaiHinh } = useModel('khoahoc.loaihinhnckh');
	const { record: recordNamHoc } = useModel('khoahoc.danhmuc.namhoc');

	return (
		<Card size='small' title={edit ? 'Chỉnh sửa' : `Thêm mới ${recordLoaiHinh?.ten} - ${recordNamHoc?.tenNamHoc}`}>
			{recordLoaiHinh?.tinhTheoTungNam && (
				<>
					<Steps
						style={{ marginBottom: 8, width: recordLoaiHinh?.tinhDiem ? undefined : 500, margin: '0 auto' }}
						current={current}
						onChange={(cur) => {
							setCurrent(cur);
							if (cur === 0) {
								setQuyDoiGio({});
								setQuyDoiDiem({});
							}
						}}
						size='small'
					>
						{Object.values(EStepSanPhamHoatDong)
							?.filter(
								(item) =>
									(item === EStepSanPhamHoatDong.DIEM && recordLoaiHinh?.tinhDiem) ||
									item !== EStepSanPhamHoatDong.DIEM,
							)
							?.map((item) => (
								<Steps.Step key={item} title={item} />
							))}
					</Steps>
					<Divider style={{ marginTop: 16 }} />
				</>
			)}
			{current === 0 && <FormGiaoNopSanPham isDangThucHien={props.isDangThucHien} getData={props.getData} />}
			{current === 1 && (
				<>
					<TableQuyDoiGio
						fieldNameKetQua={'danhSachKetQuaQuyDoiGio'}
						fieldNameYeuCau={'danhSachYeuCauQuyDoiGio'}
						mode={'GIO'}
						role={props.role}
						getData={props.getData}
					/>
				</>
			)}
			{current === 2 && recordLoaiHinh?.tinhDiem && (
				<>
					<TableQuyDoiGio
						fieldNameKetQua={'danhSachKetQuaQuyDoiDiem'}
						fieldNameYeuCau={'danhSachYeuCauQuyDoiDiem'}
						mode={'DIEM'}
						role={props.role}
						getData={props.getData}
					/>
				</>
			)}
		</Card>
	);
};

export default FormSanPhamHoatDong;
