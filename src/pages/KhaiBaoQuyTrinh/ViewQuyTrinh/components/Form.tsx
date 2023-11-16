import { Button, Form, message, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { userUpdateBuoc } from '@/services/KhaiBaoQuyTrinh/khaibaoquytrinh';
import { useModel } from 'umi';
import type { KhaiBaoQuyTrinh } from '@/services/KhaiBaoQuyTrinh/typings';
import rules from '@/utils/rules';
import FormRender from '@/pages/KhaiBaoQuyTrinh/MauDon/FormRender';

const FormQuyTrinh = (props: { getData: () => void }) => {
	const {
		currentFormKhaiBao,
		setVisibleFormKhaiBaoQuyTrinh,
		current,
		dataQuyTrinh,
		editFormKhaiBao,
		recordFormKhaiBao,
	} = useModel('quytrinh.khaibaoquytrinh');
	const { recordSanPham, setRecordSanPham } = useModel('quytrinh.khaibaoquytrinh');
	const { recordQuyTrinhForm } = useModel('quytrinh.quanlyquytrinh');
	const [formValues, setFormValues] = useState<any>({});
	const [loadingKhaiBao, setLoadingKhaiBao] = useState<boolean>(false);
	const [danhSachDonViXuLy, setDanhSachDonViXuLy] = useState<KhaiBaoQuyTrinh.IDonViXuLy[]>([]);
	const [form] = Form.useForm();
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

			const payload = {
				thongTinKhaiBao: { ...values, ...recordSanPham?.thongTinKhaiBao, ...recordQuyTrinhForm?.thongTinKhaiBao },
				maBoPhanXuLy: maBoPhanXuLy,
			};

			const res = await userUpdateBuoc(dataQuyTrinh?._id ?? '', current?.ma ?? '', payload);

			if (res) {
				message.success('Khai báo thành công');
				props?.getData();
				setVisibleFormKhaiBaoQuyTrinh(false);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoadingKhaiBao(false);
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
		return () => {
			setRecordSanPham(undefined);
		};
	}, []);
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
				{!current?.maBoPhanXuLy && (
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
					{/*<Button*/}
					{/*	onClick={() => {*/}
					{/*		setVisibleFormKhaiBaoQuyTrinh(false);*/}
					{/*	}}*/}
					{/*>*/}
					{/*	Đóng*/}
					{/*</Button>*/}
				</div>
			</Form>
		</Spin>
	);
};
export default FormQuyTrinh;
