import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';
import { Button, Form, Row, message } from 'antd';
import FormRender from './FormRender';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { buildUpLoadMultiFile } from '@/services/uploadFile';

const FormTable = (props: {
	cauHinh: LoaiHinhNCKH.TruongThongTin | LoaiHinhNCKH.Cot;
	onCancel: any;
	edit: boolean;
	record: any;
}) => {
	const [form] = Form.useForm();
	const [formValues, setFormValues] = useState<any>({});
	const { record: recordSanPham, setRecord } = useModel('khoahoc.sanphamnckh');
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		if (props.record) {
			form.setFieldsValue(props.record);
		}
	}, [props?.record?.index]);

	return (
		<Form
			onValuesChange={(changedValues, values) => {
				setFormValues(values);
			}}
			labelCol={{ span: 24 }}
			form={form}
			onFinish={async (values) => {
				try {
					setLoading(true);
					const record: any = recordSanPham || {};
					for (const item in values) {
						const value = values[item];
						if (value?.fileList?.length) {
							values[item] = await buildUpLoadMultiFile(values, item);
						}
					}

					if (props.edit) {
						const index = record?.thongTinKhaiBao
							?.find((item: { ma: string }) => item.ma === props.cauHinh.ma)
							?.value?.map((item: any, indexTemp: number) => item.index || indexTemp + 1)
							.indexOf(props.record.index);
						const list = [
							...(record?.thongTinKhaiBao?.find((item: { ma: string }) => item.ma === props.cauHinh.ma)?.value ?? []),
						];
						list.splice(index, 1, { ...props.record, ...values });
						setRecord({
							...record,
							thongTinKhaiBao: record?.thongTinKhaiBao?.map((item: { ma: string }) => {
								if (item.ma !== props.cauHinh.ma) return item;
								else
									return {
										...item,
										value: list,
									};
							}),
						});
					} else {
						const length = record?.thongTinKhaiBao?.find((item: { ma: string }) => item.ma === props.cauHinh.ma)?.value
							?.length;
						const isChuaCoTrongThongTinKhaiBao = !record?.thongTinKhaiBao?.find(
							(item: { ma: string }) => item.ma === props.cauHinh.ma,
						);
						const payload = {
							...record,
							thongTinKhaiBao: record?.thongTinKhaiBao?.length
								? record?.thongTinKhaiBao?.map((item: { ma: string }) => {
										if (item.ma !== props.cauHinh.ma) return item;
										else
											return {
												...item,
												value: [
													...(record?.thongTinKhaiBao?.find((ele: { ma: string }) => ele.ma === props.cauHinh.ma)
														?.value ?? []),
													{ ...values, index: length ? length + 1 : 1 },
												],
											};
								  })
								: [
										{
											...props.cauHinh,
											value: [
												...(record?.thongTinKhaiBao?.find((ele: { ma: string }) => ele.ma === props.cauHinh.ma)
													?.value ?? []),
												{ ...values, index: length ? length + 1 : 1 },
											],
										},
								  ],
						};

						if (isChuaCoTrongThongTinKhaiBao) {
							payload.thongTinKhaiBao = [
								...payload.thongTinKhaiBao,
								{
									...props.cauHinh,
									value: [{ ...values, index: 1 }],
								},
							];
						}

						setRecord(payload);
					}
					setLoading(false);
					message.success(props.edit ? 'Sửa thành công' : 'Thêm thành công');
					props.onCancel();
				} catch (err) {
					setLoading(false);
				}
			}}
		>
			<Row gutter={[12, 0]}>
				{props?.cauHinh?.danhSachCot?.map((item) => (
					<FormRender
						danhSachCauHinh={props.cauHinh.danhSachCot}
						form={form}
						formValues={formValues}
						key={item.ma}
						cauHinh={item}
					/>
				))}
			</Row>
			<div className='form-footer'>
				<Button loading={loading} htmlType='submit' type='primary'>
					{!props.edit ? 'Thêm mới' : 'Lưu lại'}
				</Button>
				<Button onClick={() => props.onCancel()}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormTable;
