import FormRender from '@/pages/KhaiBaoQuyTrinh/MauDon/FormRender';
import { DoiTuongDieuPhoi } from '@/services/QuyTrinh/KhaiBao/constants';
import { userUpdateBuoc } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import { getDataDefaultV2 } from '@/services/QuyTrinh/MauDon/maudon';
import { buildUpLoadMultiFileMultipart, EFileScope } from '@/services/uploadFile';
import { formatDate } from '@/utils/formatDate';
import rules from '@/utils/rules';
import { IconXmark, IconSave } from '@/components/Icons';
import { Button, Form, message, Row, Select, Spin } from 'antd';
import { pick } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';

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
	const intl = useIntl();
	const doiTuongDieuPhoi = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find(
		(item) => item?.ma === current?.ma,
	)?.doiTuongDieuPhoi;

	const allowedFieldKeys = useMemo(
		() => currentFormKhaiBao?.cauHinhLoaiHinh?.map((item) => item.ma) ?? [],
		[currentFormKhaiBao?.cauHinhLoaiHinh],
	);

	const onFinish = async (values: any) => {
		try {
			setLoadingKhaiBao(true);
			const sanitizedValues = pick(values, [...allowedFieldKeys, 'maBoPhanXuLy']);
			const maBoPhanXuLy = sanitizedValues?.maBoPhanXuLy ?? current?.maBoPhanXuLy;
			const uploadValues = pick(sanitizedValues, allowedFieldKeys);

			for (const item of allowedFieldKeys) {
				const value = uploadValues[item];
				if (value?.fileList?.length) {
					uploadValues[item] = await buildUpLoadMultiFileMultipart(uploadValues, item, {
						scope: EFileScope.INTERNAL,
						module: 'quy-trinh',
						returnValue: 'url',
					});
				}
			}

			const valuesFinal: any = {};
			const existingFormValues = pick(recordQuyTrinhForm?.thongTinKhaiBao ?? {}, allowedFieldKeys);
			const valuesForm = { ...existingFormValues, ...uploadValues };

			allowedFieldKeys.forEach((item) => {
				const cauHinh = currentFormKhaiBao?.cauHinhLoaiHinh?.find((ele) => ele.ma === item);
				if (!cauHinh) return;
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
					valuesFinal[`${item}Date`] = { value: formatDate(valuesForm[item], isDate ? 'DD/MM/YYYY' : 'MM/YYYY') };
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
				message.success(intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
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
					if (!cauHinh) return;
					finalData[item] = [EKieuDuLieu.DATE, EKieuDuLieu.MONTH].includes(cauHinh.kieuDuLieu)
						? formatDate(res?.data?.data[item])
						: res?.data?.data[item] === 'Invalid date'
							? undefined
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
			form.setFieldsValue(pick(recordFormKhaiBao, allowedFieldKeys));
		}
	}, [editFormKhaiBao, recordFormKhaiBao, allowedFieldKeys]);

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
						<FormRender
							danhSachCauHinh={currentFormKhaiBao.cauHinhLoaiHinh}
							formValues={formValues}
							key={item.ma}
							cauHinh={item}
							form={form}
						/>
					))}
				</Row>
				{!current?.maBoPhanXuLy && doiTuongDieuPhoi === DoiTuongDieuPhoi.NGUOI_CU_THE && (
					<Form.Item
						name={'maBoPhanXuLy'}
						label={intl.formatMessage({ id: 'phanhoi.column.donvi' })}
						rules={[...rules.required]}
					>
						<Select
							style={{ width: '100%' }}
							placeholder={intl.formatMessage({ id: 'phanhoi.column.donvi' })}
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
					<Button icon={<IconSave />} style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					{editFormKhaiBao && (
						<Button
							icon={<IconXmark />}
							style={{ marginRight: 8 }}
							onClick={() => {
								setEditFormKhaiBao(false);
								window.scroll({ top: 0, behavior: 'smooth' });
							}}
						>
							{intl.formatMessage({ id: 'global.button.huy' })}
						</Button>
					)}
				</div>
			</Form>
		</Spin>
	);
};
export default FormQuyTrinh;
