import FormRender from '@/pages/KhaiBaoQuyTrinh/MauDon/FormRender';
import { DoiTuongDieuPhoi } from '@/services/QuyTrinh/KhaiBao/constants';
import { userUpdateBuoc } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import { getDataDefaultV2 } from '@/services/QuyTrinh/MauDon/maudon';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Form, message, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormQuyTrinh = (props: { idQuyTrinh?: string; getData: () => void }) => {
	const { currentFormKhaiBao, current, dataQuyTrinh, editFormKhaiBao, recordFormKhaiBao } =
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
				valuesFinal[item] = {
					value: valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};
			});

			const payload = {
				thongTinKhaiBao: { ...recordSanPham?.thongTinKhaiBao, ...recordQuyTrinhForm?.thongTinKhaiBao, ...valuesFinal },
				maBoPhanXuLy: maBoPhanXuLy,
			};

			const res = await userUpdateBuoc(dataQuyTrinh?._id ?? '', current?.ma ?? '', payload);

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
		debugger;

		try {
			if (currentFormKhaiBao?.ma) {
				const res = await getDataDefaultV2(props?.idQuyTrinh ?? '', 'khai_bao', currentFormKhaiBao?.ma ?? '');
				if (res) {
					form.setFieldsValue({
						...form.getFieldsValue(),
						...res?.data?.data,
					});
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
			form.setFieldsValue(recordFormKhaiBao);
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

				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
						Khai báo
					</Button>
				</div>
			</Form>
		</Spin>
	);
};
export default FormQuyTrinh;
