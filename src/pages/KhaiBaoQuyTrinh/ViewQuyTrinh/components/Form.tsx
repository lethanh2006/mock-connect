import FormRender from '@/pages/KhaiBaoQuyTrinh/MauDon/FormRender';
import { DoiTuongDieuPhoi } from '@/services/QuyTrinh/KhaiBao/constants';
import { userUpdateBuoc } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import { getDataDefaultV2 } from '@/services/QuyTrinh/MauDon/maudon';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, message, Row, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormQuyTrinh = (props: { idQuyTrinh?: string; getData: () => void }) => {
	const { currentFormKhaiBao, current, dataQuyTrinh, editFormKhaiBao, recordFormKhaiBao, setEditFormKhaiBao } =
		useModel('quytrinh.khaibaoquytrinh');
	const { danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');
	const { recordSanPham, setRecordSanPham } = useModel('quytrinh.khaibaoquytrinh');
	const { recordQuyTrinhForm } = useModel('quytrinh.quanlyquytrinh');
	const { getOneModel: getHoaDon, setVisibleForm } = useModel('taichinh.hoadon');
	const [formValues, setFormValues] = useState<any>({});
	const [loadingKhaiBao, setLoadingKhaiBao] = useState<boolean>(false);
	const [danhSachDonViXuLy, setDanhSachDonViXuLy] = useState<KhaiBaoQuyTrinh.IDonViXuLy[]>([]);
	const [form] = Form.useForm();
	const doiTuongDieuPhoi = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find(
		(item) => item?.ma === current?.ma,
	)?.doiTuongDieuPhoi;

	const onFinish = async (values: any) => {
		try {
			setLoadingKhaiBao(true);
			const maBoPhanXuLy = values?.maBoPhanXuLy ?? current?.maBoPhanXuLy;
			for (const item in values) {
				const value = values[item];
				if (value?.fileList?.length) {
					values[item] = await buildUpLoadMultiFile(values, item);
				}
			}
			delete values.maBoPhanXuLy;

			const valuesFinal: any = {};
			const valuesForm = { ...(recordQuyTrinhForm?.thongTinKhaiBao ?? {}), ...values };

			Object.keys(valuesForm).map((item) => {
				const cauHinh = currentFormKhaiBao?.cauHinhLoaiHinh?.find((ele) => ele.ma === item);
				const isDanhMuc = cauHinh?.kieuDuLieu === EKieuDuLieu.DANHMUC;
				const isDate = cauHinh?.kieuDuLieu === EKieuDuLieu.DATE;
				const isMonth = cauHinh?.kieuDuLieu === EKieuDuLieu.MONTH;
				valuesFinal[item] = {
					value:
						// (isDate || isMonth) && valuesForm
						// 	? moment(valuesForm[item]).format(isDate ? 'DD/MM/YYYY' : 'MM/YYYY')
						// 	:
						valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};
				if (isDate || isMonth) {
					valuesFinal[`${item}Date`] = { value: moment(valuesForm[item]).format(isDate ? 'DD/MM/YYYY' : 'MM/YYYY') };
				}
			});

			const payload = {
				thongTinKhaiBao: { ...recordSanPham?.thongTinKhaiBao, ...recordQuyTrinhForm?.thongTinKhaiBao, ...valuesFinal },
				maBoPhanXuLy: maBoPhanXuLy,
			};

			const res = await userUpdateBuoc(dataQuyTrinh?._id ?? '', current?.ma ?? '', payload);
			setEditFormKhaiBao(false);
			window.scroll({ top: 0, behavior: 'smooth' });
			if (res) {
				message.success('Khai báo thành công');
				props?.getData();
				if (res?.data?.data?.identityCode) {
					await getHoaDon({ identityCode: res.data.data.identityCode });
					setVisibleForm(true);
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingKhaiBao(false);
		}
	};

	const handleGetDataDefault = async () => {
		try {
			if (currentFormKhaiBao?.ma) {
				const res = await getDataDefaultV2(props?.idQuyTrinh ?? '', 'khai_bao', currentFormKhaiBao?.ma ?? '');
				const finalData = {
					...form.getFieldsValue(),
				};
				Object.keys(res?.data?.data)?.map((item: string) => {
					const cauHinh = currentFormKhaiBao?.cauHinhLoaiHinh?.find((ele) => ele.ma === item);
					finalData[item] = [EKieuDuLieu.DATE, EKieuDuLieu.MONTH].includes(cauHinh.kieuDuLieu)
						? moment(res?.data?.data[item])
						: res?.data?.data[item];
				});
				if (res) {
					form.setFieldsValue(finalData);
				}
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (dataQuyTrinh) {
			const currentBuocXuLy = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === current?.ma);
			if (currentBuocXuLy) {
				const arr: KhaiBaoQuyTrinh.IDonViXuLy[] = [];
				dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.map((val) => {
					if (currentBuocXuLy?.danhSachMaBoPhanXuLy?.includes(val?.ma)) {
						arr.push(val);
					}
				});
				setDanhSachDonViXuLy(arr);
			}
		}
	}, [dataQuyTrinh]);

	useEffect(() => {
		if (editFormKhaiBao && recordFormKhaiBao) {
			const recordFormKhaiBaoFinal: any = {};
			Object.keys(recordFormKhaiBao).map((key) => {
				const khaiBao = recordFormKhaiBao[key];
				recordFormKhaiBaoFinal[key] = khaiBao;
			});

			form.setFieldsValue(recordFormKhaiBaoFinal);
		}
	}, [editFormKhaiBao, recordFormKhaiBao]);

	useEffect(() => {
		if (props?.idQuyTrinh && currentFormKhaiBao?.ma) {
			handleGetDataDefault();
		}
		return () => {
			setRecordSanPham(undefined);
		};
	}, [props?.idQuyTrinh, currentFormKhaiBao?.ma]);

	return (
		<Spin spinning={loadingKhaiBao}>
			<Form
				style={{ position: 'relative' }}
				scrollToFirstError
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				labelCol={{ span: 24 }}
				form={form}
				onFinish={onFinish}
				layout={'vertical'}
			>
				<Row gutter={[12, 0]}>
					{currentFormKhaiBao?.cauHinhLoaiHinh?.map((item) => (
						<FormRender formValues={formValues} key={item.ma} cauHinh={item} form={form} />
					))}
				</Row>
				{!current?.maBoPhanXuLy && doiTuongDieuPhoi === DoiTuongDieuPhoi.NGUOI_CU_THE && (
					<Form.Item name={'maBoPhanXuLy'} label={'Bộ phận xử lý'} rules={[...rules.required]}>
						<Select
							style={{ width: '100%' }}
							placeholder={'Chọn bộ phận xử lý'}
							onChange={() => {}}
							options={danhSachDonViXuLy?.map((val) => {
								return {
									value: val?.ma,
									label: val?.ten,
								};
							})}
						/>
					</Form.Item>
				)}

				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<Button icon={<SaveOutlined />} style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
						Lưu
					</Button>
					{editFormKhaiBao && (
						<Button
							icon={<CloseOutlined />}
							style={{ marginRight: 8 }}
							onClick={() => {
								setEditFormKhaiBao(false);
								window.scroll({ top: 0, behavior: 'smooth' });
							}}
						>
							Hủy
						</Button>
					)}
				</div>
			</Form>
		</Spin>
	);
};
export default FormQuyTrinh;
