import { Button, Form, Row, message } from 'antd';
import FormRender from './FormRender';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';

const FormTable = (props: {
	cauHinh: LoaiHinh.TruongThongTin | LoaiHinh.Cot;
	onCancel: any;
	edit: boolean;
	isView?: boolean;
	record: any;
}) => {
	const [form] = Form.useForm();
	const [formValues, setFormValues] = useState<any>({});
	const { recordQuyTrinhForm, setRecordQuyTrinhForm } = useModel('quytrinh.quanlyquytrinh');

	useEffect(() => {
		if (props.record) {
			form.setFieldsValue(props.record);
		}
	}, [props?.record?.index]);

	return (
		<>
			<Form
				disabled={props?.isView}
				onValuesChange={(changedValues, values) => {
					setFormValues(values);
				}}
				labelCol={{ span: 24 }}
				form={form}
				onFinish={async (values) => {
					const record: any = recordQuyTrinhForm || {};
					for (const item in values) {
						const value = values[item];
						if (value?.fileList?.length) {
							values[item] = await buildUpLoadMultiFile(values, item);
						}
					}

					if (props.edit) {
						const index = record?.thongTinKhaiBao?.[props.cauHinh.ma]
							?.map((item: any) => item.index)
							.indexOf(props.record.index);
						const list = [...(record?.thongTinKhaiBao?.[props.cauHinh.ma] ?? [])];
						list.splice(index, 1, { ...props.record, ...values });

						setRecordQuyTrinhForm({
							...record,
							thongTinKhaiBao: { ...record.thongTinKhaiBao, [props.cauHinh.ma]: list },
						});
					} else {
						const length = record?.thongTinKhaiBao?.[props.cauHinh.ma]?.length;
						setRecordQuyTrinhForm({
							...record,
							thongTinKhaiBao: {
								...record.thongTinKhaiBao,
								[props.cauHinh.ma]: [
									...(record?.thongTinKhaiBao?.[props.cauHinh.ma] ?? []),
									{ ...values, index: length ? length + 1 : 1 },
								],
							},
						});
					}
					message.success(props.edit ? 'Sửa thành công' : 'Thêm thành công');
					props.onCancel();
				}}
			>
				<Row gutter={[12, 0]}>
					{props?.cauHinh?.danhSachCot?.map((item) => (
						<FormRender form={form} formValues={formValues} key={item.ma} cauHinh={item} />
					))}
				</Row>
				<div className='form-footer'>
					{!props?.isView && (
						<Button htmlType='submit' type='primary'>
							{!props.edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
					)}
					{!props?.isView && <Button onClick={() => props.onCancel()}>Đóng</Button>}
				</div>
			</Form>
			{props?.isView && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={() => props.onCancel()}>Đóng</Button>
				</div>
			)}
		</>
	);
};

export default FormTable;
