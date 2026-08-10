import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { buildUpLoadMultiFileMultipart, EFileScope } from '@/services/uploadFile';
import { Button, Form, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormRender from './FormRender';

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
	const intl = useIntl();

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
							values[item] = await buildUpLoadMultiFileMultipart(values, item, {
								scope: EFileScope.INTERNAL,
								module: 'diem-ren-luyen',
								returnValue: 'url',
							});
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
					message.success(
						props.edit
							? intl.formatMessage({ id: 'diemrenluyen.cauhinh.thongbao.suathanhcong' })
							: intl.formatMessage({ id: 'diemrenluyen.cauhinh.thongbao.themthanhcong' }),
					);
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
							{!props.edit
								? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' })
								: intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.luulai' })}
						</Button>
					)}
					{!props?.isView && (
						<Button onClick={() => props.onCancel()}>
							{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.huy' })}
						</Button>
					)}
				</div>
			</Form>
			{props?.isView && (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button onClick={() => props.onCancel()}>
						{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.huy' })}
					</Button>
				</div>
			)}
		</>
	);
};

export default FormTable;
