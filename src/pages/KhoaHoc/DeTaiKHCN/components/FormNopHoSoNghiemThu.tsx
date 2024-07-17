import UploadFile from '@/components/Upload/UploadFile';
import {
	EDangSanPham,
	EPhaseDeTaiKHCN,
	ETrangThaiNghiemThu,
	arrKeyNameSanPhamNghiemThu,
} from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { buildUpLoadFile, buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableKeHoachUngDung from './TableKeHoachUngDung';
import TableSanPham from './TableSanPham';
import TableUngDungTrongHocVien from './TableUngDungTrongHocVien';
import TinyEditor from '@/components/TinyEditor';

const FormNopHoSoNghiemThu = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		formSubmiting,
		visibleForm,
		setLoading,
		loading,
		giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel,
	} = useModel('khoahoc.detaikhcn');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const rec: any = {
				...record?.dangKyKhcn,
				...record?.deCuongKhcn,
				...record?.nghiemThuKhcn,
			};
			arrKeyNameSanPhamNghiemThu.map((item, index) => {
				rec[item.field] = record?.nghiemThuKhcn?.sanPham[index]?.url;
			});
			form.setFieldsValue(rec);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			if (!record) return;
			setLoading(true);
			const baoCaoUrl = await buildUpLoadMultiFile(values, 'baoCaoUrl');
			const banGiaiTrinhUrl = await buildUpLoadFile(values, 'banGiaiTrinhUrl');
			const sach = await buildUpLoadMultiFile(values, 'sach');
			const baiBao = await buildUpLoadMultiFile(values, 'baiBao');
			const hoiThaoQuocTe = await buildUpLoadMultiFile(values, 'hoiThaoQuocTe');
			const hoiThaoKhoa = await buildUpLoadMultiFile(values, 'hoiThaoKhoa');
			const ungDung = await buildUpLoadMultiFile(values, 'ungDung');
			const sanPham: any = {
				sach,
				baiBao,
				hoiThaoKhoa,
				hoiThaoQuocTe,
				ungDung,
			};

			const arrSanPham: DeTaiKHCN.SanPhamNghiemThu[] = [];
			arrKeyNameSanPhamNghiemThu.map((item) => {
				arrSanPham.push({
					loai: item.title,
					url: sanPham?.[item.field] ?? [],
				});
			});

			const nghiemThuKhcn: any = {
				...values,
				...record?.nghiemThuKhcn,
				baoCaoUrl,
				banGiaiTrinhUrl,
				sanPham: arrSanPham,
				sanPhamChinh: [
					...(record?.nghiemThuKhcn?.sanPhamDeCuongDangI ?? []),
					...(record?.nghiemThuKhcn?.sanPhamDeCuongDangII ?? []),
					...(record?.nghiemThuKhcn?.sanPhamDeCuongDangIII ?? []),
				],
				sanPhamDeCuongDangI: undefined,
				sanPhamDeCuongDangII: undefined,
				sanPhamDeCuongDangIII: undefined,
			};

			const payload = {
				nghiemThuKhcn,
			};

			giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel(record?._id, payload, 'nghiem-thu', props.getData)
				.then(() => form.resetFields())
				.catch((er) => {
					setLoading(false);
					console.log(er);
				});
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={'Chỉnh sửa hồ sơ nghiệm thu'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[16, 0]}>
					<Col xs={24} sm={12}>
						<Form.Item rules={[...rules.required]} label='Báo cáo tổng hợp kết quả nghiên cứu đề tài' name='baoCaoUrl'>
							<UploadFile
								maxCount={5}
								accept='.doc, .docx, .pdf'
								otherProps={{
									multiple: true,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					{record?.phaseDeTaiKhcn === EPhaseDeTaiKHCN.NGHIEM_THU &&
						record.trangThaiNghiemThu === ETrangThaiNghiemThu.YEU_CAU_CHINH_SUA && (
							<Col xs={24} sm={12}>
								<Form.Item
									rules={[...rules.required]}
									label='Bản giải trình nội dung chỉnh sửa Báo cáo tổng hợp kết quả nghiên cứu đề tài'
									name='banGiaiTrinhUrl'
								>
									<UploadFile
										maxCount={1}
										accept='.doc, .docx, .pdf'
										otherProps={{
											multiple: false,
											showUploadList: { showDownloadIcon: false },
										}}
									/>
								</Form.Item>
							</Col>
						)}
					{/* <Col span={24}>Sản phẩm của đề tài được công bố hoặc minh chứng ứng dụng trong thực tiễn (nếu có)</Col> */}
					{/* {arrKeyNameSanPhamNghiemThu.map((item, index) => (
						<Col key={item.field} xs={24} sm={12}>
							<Form.Item label={`${index + 1}. ${item.title}`} name={item.field}>
								<UploadFile
									maxCount={5}
									accept='.doc, .docx, .pdf'
									otherProps={{
										multiple: true,
										showUploadList: { showDownloadIcon: false },
									}}
								/>
							</Form.Item>
						</Col>
					))} */}
					{/* <Col span={24}>
						<div>Nội dung ứng dụng trong đào tạo (quá trình dạy và học) tại Học viện</div>
						<TableUngDungTrongHocVien mode='edit' data={record?.nghiemThuKhcn?.noiDungUngDungHocVien ?? []} />
					</Col>
					<Col xs={24} lg={24}>
						<Form.Item name={'noiDungUngDungKhac'} label='Nội dung ứng dụng khác' rules={[...rules.text]}>
							<TinyEditor height={300} />
						</Form.Item>
					</Col> */}
					{/* <Col span={24}>
						<div>
							Sản phẩm chính của đề tài (Dạng I){' '}
							<i>
								Mẫu (model, maket); Sản phẩm (là hàng hoá, có thể được tiêu thụ trên thị trường); Vật liệu; Thiết bị,
								máy móc; Dây chuyền công nghệ và các loại khác
							</i>
						</div>
						<TableSanPham
							phase='nghiemThuKhcn'
							type={EDangSanPham.DANG_SAN_PHAM_I}
							mode='edit'
							data={record?.nghiemThuKhcn?.sanPhamDeCuongDangI ?? []}
						/>
						<br />
					</Col> */}
					{/* <Col span={24}>
						<div>
							Sản phẩm chính của đề tài (Dạng II){' '}
							<i>
								Nguyên lý ứng dụng; Phương pháp; Tiêu chuẩn; Quy phạm; Phần mềm máy tính; Bản vẽ thiết kế; Quy trình
								công nghệ; Sơ đồ, bản đồ; Số liệu, Cơ sở dữ liệu; Báo cáo phân tích; Tài liệu dự báo (phương pháp, quy
								trình, mô hình,...); Đề án, qui hoạch; Luận chứng kinh tế-kỹ thuật, Báo cáo nghiên cứu khả thi và các
								sản phẩm khác
							</i>
						</div>
						<TableSanPham
							phase='nghiemThuKhcn'
							type={EDangSanPham.DANG_SAN_PHAM_II}
							mode='edit'
							data={record?.nghiemThuKhcn?.sanPhamDeCuongDangII ?? []}
						/>
						<br />
					</Col> */}
					<Col span={24}>
						<div>
							Sản phẩm công bố/sản phẩm ứng dụng của đề tài <i>(Đã có hoặc dự tính trong tương lai)</i>
						</div>
						<TableSanPham
							phase='nghiemThuKhcn'
							type={EDangSanPham.DANG_SAN_PHAM_III}
							mode='edit'
							data={record?.nghiemThuKhcn?.sanPhamDeCuongDangIII ?? []}
						/>
						<br />
					</Col>
					<Col span={24}>
						<div>
							Kế hoạch ứng dụng <i>(Trong quá trình dạy và học tại Học viện Phụ nữ Việt Nam/Khác)</i>:
						</div>
						<TableKeHoachUngDung mode='edit' data={record?.nghiemThuKhcn?.keHoachUngDung ?? []} />
						<br />
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={loading || formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormNopHoSoNghiemThu;
