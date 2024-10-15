import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import SelectQuyDoiDiem from '@/pages/DaoTao/QuyDoiDiem/Select';
import {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrinhDoMinhChungQuyDoiDiem,
	mapNameLoaiHocPhanMinhChung,
} from '@/services/HocTap/constant';
import rules from '@/utils/rules';
import { Col, Form, type FormInstance, Input, InputNumber, Row, Select } from 'antd';
import { useModel } from 'umi';
import AutoHocPhanQuyDoi from './AutoHocPhan';
import AutoTruongHocQuyDoi from './AutoTruongHoc';

const FormQuyDoiDiem = (props: { form: FormInstance; isHocPhan?: boolean }) => {
	const { form, isHocPhan } = props;
	const { danhSach: danhSachQuyDoiDiem } = useModel('daotao.dmquydoidiem');
	const { danhSach: danhSachHocPhan } = useModel('hocphan.hocphan');
	const loaiMinhChung: string = Form.useWatch('loai', form);
	const loaiHocPhan: string = Form.useWatch('loaiHocPhan', form);
	const trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem = Form.useWatch('trinhDoDaoTao', form);
	const tenTruong = Form.useWatch('tenTruong', form);
	const diemHe10MinhChung = Form.useWatch('diemHe10MinhChung', form);
	const diemHe4MinhChung = Form.useWatch('diemHe4MinhChung', form);

	const onChangeHocPhanMinhChung = (maHocPhanMinhChung?: string) => {
		const ns = danhSachHocPhan.find((item) => item.ma === maHocPhanMinhChung);
		form.setFieldsValue({
			tenHocPhan: ns?.ten,
			soTinChi: ns?.soTinChi,
			trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem.DAI_HOC,
			tenTruong: APP_CONFIG_TEN_TRUONG,
		});
	};

	const onChangeDiem10 = (number: number) => {
		const rule = danhSachQuyDoiDiem.find((i) => number >= i.diemFrom && number <= i.diemTo);
		form.setFieldsValue({
			diemHe10: number,
			diemHe4MinhChung: rule?.diemThang4,
			diemChuMinhChung: rule?.diemChu,
		});
	};

	const onChangeDiem4 = (score: number) => {
		const rule = danhSachQuyDoiDiem.find((i) => i.diemThang4 === score);
		form.setFieldsValue({ diemChuMinhChung: rule?.diemChu });
	};

	return (
		<Row gutter={[12, 0]}>
			<Col xs={24}>
				<Form.Item
					name='loai'
					label='Loại minh chứng'
					rules={[...rules.required]}
					extra='Đối với minh chứng NCKH, kết quả quy đổi sẽ được tính vào Điểm TBC'
				>
					<Select
						placeholder='Chọn minh chứng'
						options={Object.values(EMinhChungQuyDoiDiem).map((item) => ({
							key: item,
							label: item,
							value: item,
						}))}
					/>
				</Form.Item>
			</Col>

			{loaiMinhChung === EMinhChungQuyDoiDiem.HOC_PHAN ? (
				<>
					<Col xs={24}>
						<div className='fw500'>Thông tin học phần đã học</div>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							initialValue={ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH}
							name='loaiHocPhan'
							label='Loại học phần'
							rules={[...rules.required]}
						>
							<Select
								placeholder='Chọn loại học phần'
								options={Object.values(ELoaiHocPhanMinhChung).map((item) => ({
									key: item,
									value: item,
									label: mapNameLoaiHocPhanMinhChung[item],
								}))}
								onSelect={() => {
									form.resetFields([
										'tenHocPhan',
										'soTinChi',
										'trinhDoDaoTao',
										'tenTruong',
										'nganh',
										'maHocPhanMinhChung',
									]);
								}}
							/>
						</Form.Item>
					</Col>

					{loaiHocPhan === ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item name='trinhDoDaoTao' label='Trình độ' rules={[...rules.required]}>
									<Select
										onSelect={() => form.setFieldsValue({ tenTruong: undefined, tenHocPhan: undefined })}
										placeholder='Chọn trình độ'
										options={Object.values(ETrinhDoMinhChungQuyDoiDiem).map((item) => ({
											key: item,
											label: item,
											value: item,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='tenTruong'
									label='Trường học'
									rules={[...rules.required, ...rules.text, ...rules.length(500)]}
								>
									<AutoTruongHocQuyDoi
										trinhDoDaoTao={trinhDoDaoTao}
										onSelect={() => form.setFieldsValue({ tenHocPhan: undefined })}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='nganh'
									label='Ngành học'
									rules={[...rules.required, ...rules.text, ...rules.length(500)]}
								>
									<Input placeholder='Nhập tên ngành học' />
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='tenHocPhan'
									label='Tên học phần'
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								>
									<AutoHocPhanQuyDoi
										trinhDoDaoTao={trinhDoDaoTao}
										tenTruong={tenTruong}
										onSelect={(val) =>
											form.setFieldsValue({
												maHocPhanMinhChung: val?.maHocPhanMinhChung,
												soTinChi: val?.soTinChi,
											})
										}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item name='maHocPhanMinhChung' label='Mã học phần' rules={[...rules.text, ...rules.length(20)]}>
									<Input placeholder='Nhập mã học phần' />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									name='soDVHT'
									label='Số đơn vị học trình'
									extra={
										<small style={{ color: '#999' }}>
											<i>1,5 đơn vị học trình = 1 tín chỉ</i>
										</small>
									}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder='Nhập số đơn vị học trình'
										min={0}
										onChange={(val) => form.setFieldsValue({ soTinChi: Math.round((val ?? 0) / 1.5) })}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item name='soTinChi' label='Số tín chỉ'>
									<InputNumber style={{ width: '100%' }} placeholder='Nhập số tín chỉ' min={0} />
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item name='namTotNghiep' label='Năm tốt nghiệp'>
									<InputNumber style={{ width: '100%' }} placeholder='Nhập năm tốt nghiệp' min={0} />
								</Form.Item>
							</Col>
						</>
					) : loaiHocPhan === ELoaiHocPhanMinhChung.TRONG_CHUONG_TRINH ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item name='maHocPhanMinhChung' label='Học phần đã học' rules={[...rules.required]}>
									<SelectHocPhan selectMa onChange={(val) => onChangeHocPhanMinhChung(val?.toString())} />
								</Form.Item>
								<Form.Item name='tenHocPhan' hidden />
								<Form.Item name='soTinChi' hidden />
								<Form.Item name='trinhDoDaoTao' hidden />
								<Form.Item name='tenTruong' hidden />
							</Col>
						</>
					) : null}

					<Col xs={24}>
						<div className='fw500'>Kết quả học tập/quy đổi</div>
					</Col>
					<Col xs={12} md={8}>
						<Form.Item name='diemHe10MinhChung' label='Điểm hệ 10'>
							<InputNumber
								style={{ width: '100%' }}
								placeholder='Nhập điểm (hệ 10)'
								min={0}
								max={10}
								onChange={(val) => onChangeDiem10(Number(val))}
							/>
						</Form.Item>
					</Col>
					<Col xs={12} md={8}>
						<Form.Item name='diemHe4MinhChung' label='Điểm hệ 4'>
							<Select
								options={danhSachQuyDoiDiem.map((item) => ({
									key: item._id,
									value: item.diemThang4,
									label: item.diemThang4,
								}))}
								placeholder='Nhập điểm hệ 4'
								onChange={(val) => onChangeDiem4(val)}
								disabled={!!diemHe10MinhChung}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item name='diemChuMinhChung' label='Điểm chữ' rules={[...rules.required]}>
							<SelectQuyDoiDiem
								disabled={!!diemHe4MinhChung}
								onChange={(val) => form.setFieldsValue({ diemChu: val })}
							/>
						</Form.Item>
					</Col>
				</>
			) : loaiMinhChung === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
				<>
					<Col xs={24}>
						<div className='fw500'>Thông tin chứng chỉ</div>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='tenChungChi'
							label='Tên chứng chỉ'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập tên chứng chỉ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='bacChungChi'
							label='Điểm/Bậc chứng chỉ'
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input placeholder='Nhập điểm/bậc chứng chỉ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='donViCap'
							label='Đơn vị cấp'
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input placeholder='Nhập đơn vị cấp' />
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item name='thoiGianHieuLuc' label='Thời gian có hiệu lực'>
							<MyDatePicker />
						</Form.Item>
					</Col>
				</>
			) : (
				<>
					<Col xs={24}>
						<div className='fw500'>Thông tin Nghiên cứu khoa học</div>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='tenDeTaiNckh'
							label='Tên đề tài'
							rules={[...rules.required, ...rules.text, ...rules.length(500)]}
						>
							<Input placeholder='Nhập tên đề tài' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='nguoiHuongDanNckh' label='Người hướng dẫn' rules={[...rules.text, ...rules.length(100)]}>
							<Input placeholder='Nhập tên người hướng dẫn' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='diemNckh' label='Điểm NCKH' rules={[...rules.required]}>
							<InputNumber placeholder='Nhập điểm NCKH' style={{ width: '100%' }} min={0} />
						</Form.Item>
					</Col>
				</>
			)}

			{!isHocPhan ? (
				<Col xs={24} md={12}>
					<Form.Item name='urlsMinhChung' label='File minh chứng' rules={[...rules.required]}>
						<UploadFile resize maxCount={5} />
					</Form.Item>
				</Col>
			) : (
				<Col xs={24}>
					<Form.Item name='ghiChu' label='Ghi chú'>
						<Input placeholder='Nhập ghi chú' />
					</Form.Item>
				</Col>
			)}
		</Row>
	);
};

export default FormQuyDoiDiem;
