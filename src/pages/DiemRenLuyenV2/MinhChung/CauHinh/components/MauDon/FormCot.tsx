import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, Radio, Row, Select, message, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
// import FormGiaTriLienQuan from '@/pages/QuanLyKhoaHocV2/LoaiHinh/components/FormGiaTriLienQuan';
import _ from 'lodash';
import { removeVietnameseTones } from '@/utils/utils';
import FormGiaTriLienQuan from './FormGiaTriLienQuan';
import { EKieuDuLieu, ETextDisplay, MapKeyNameTextDisplay } from '@/services/FormDong/LoaiHinh/constants';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';

const FormCot = (props: { onCancel: any }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { formSubmiting, recordCauHinh, setRecordCauHinh, editCot, recordCot } = useModel('quytrinh.quanlyquytrinh');
	const [truongThongTinLienQuan, setTruongThongTinLienQuan] = useState<LoaiHinh.Cot | undefined>(
		recordCauHinh?.danhSachCot?.find((item: { ma: any }) => item.ma === recordCot?.truongThongTinLienQuan),
	);
	const { getAllModel: getAllDanhMucChung, loading: loadingDanhMucChung, danhSach } = useModel('quytrinh.danhmuc');
	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieu>(recordCot?.kieuDuLieu ?? EKieuDuLieu.BOOLEAN);
	// const {
	// 	getAllModel: getAllDanhMucChung,
	// 	loading: loadingDanhMucChung,
	// 	danhSach,
	// } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		if (recordCot?.ma && editCot) form.setFieldsValue(recordCot);
	}, [recordCot?.ma]);

	const onFinish = async (values: any, isContinue: boolean) => {
		if (editCot && recordCauHinh && recordCot) {
			const index = recordCauHinh.danhSachCot.map((item: { ma: any }) => item.ma).indexOf(recordCot.ma);
			const danhSachCot = [...recordCauHinh.danhSachCot];
			danhSachCot.splice(index, 1, { ...recordCot, ...values });
			setRecordCauHinh({ ...recordCauHinh, danhSachCot });
		} else {
			setRecordCauHinh({
				...(recordCauHinh || {}),
				danhSachCot: [...(recordCauHinh?.danhSachCot ?? []), values],
			} as LoaiHinh.TruongThongTin);
		}
		message.success(editCot ? intl.formatMessage({ id: 'diemrenluyen.cauhinh.thongbao.suathanhcong' }) : intl.formatMessage({ id: 'diemrenluyen.cauhinh.thongbao.themthanhcong' }));
		if (isContinue) {
			form.resetFields();
		} else props.onCancel();
	};

	const isAvailableDangMang = [EKieuDuLieu.DANHMUC, EKieuDuLieu.DECIMAL, EKieuDuLieu.NUMBER, EKieuDuLieu.TEXT].includes(
		kieuDuLieu,
	);

	return (
		<Card title={(editCot ? intl.formatMessage({ id: 'diemrenluyen.maudon.form.chinhsua' }) : intl.formatMessage({ id: 'diemrenluyen.maudon.form.themmoi' })) + ' ' + intl.formatMessage({ id: 'diemrenluyen.maudon.cot.ten' }).toLowerCase()}>
			<Form onFinish={(values) => onFinish(values, false)} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name='ma' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.ma' })} rules={[...rules.required, ...rules.text]}>
							<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.ma' })} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name='ten' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.ten' })} rules={[...rules.required, ...rules.text]}>
							<Input
								onChange={(e) => {
									if (!editCot) form.setFieldsValue({ ma: _.camelCase(removeVietnameseTones(e?.target?.value ?? '')) });
								}}
								autoFocus
								placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.ten' })}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name='kieuDuLieu' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.kieudulieu' })} rules={[...rules.required]}>
					<Select
						onChange={(val) => setKieuDuLieu(val)}
						options={Object.values(EKieuDuLieu)
							.filter((item) => item !== EKieuDuLieu.TABLE)
							.map((item) => ({ label: item, value: item }))}
						placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.kieudulieu' })}
					/>
				</Form.Item>
				{kieuDuLieu === EKieuDuLieu.DANHMUC && (
					<Form.Item
						name='maDanhMuc'
						label={
							<span>
								{intl.formatMessage({ id: 'diemrenluyen.cauhinh.danhmuc' })} (
								<Button
									loading={loadingDanhMucChung}
									onClick={() => {
										getAllDanhMucChung(false);
									}}
									style={{ padding: 0 }}
									type='link'
								>
									{intl.formatMessage({ id: 'diemrenluyen.maudon.lammoi' })}
								</Button>
								)
							</span>
						}
						rules={[...rules.required]}
					>
						<Select
							options={danhSach.map((item) => ({
								label: (
									<Popover
										placement='left'
										content={
											<div>
												{item.danhSachGiaTri.map((giaTri: { value: string }) => (
													<div key={giaTri.value}>- {giaTri.value}</div>
												))}
											</div>
										}
									>
										{item.maDanhMuc}
									</Popover>
								),
								value: item.maDanhMuc,
							}))}
							placeholder={intl.formatMessage({ id: 'diemrenluyen.cauhinh.danhmuc' })}
						/>
					</Form.Item>
				)}

				{kieuDuLieu === EKieuDuLieu.TEXT && (
					<Form.Item name='textDisplay' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.kieuhienthi' })}>
						<Select
							placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.placeholder.chon' })}
							options={Object.values(ETextDisplay).map((item) => ({ value: item, label: MapKeyNameTextDisplay[item] }))}
						/>
					</Form.Item>
				)}

				<Form.Item name='truongThongTinLienQuan' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.truongthongtinlienquan' })}>
					<Select
						allowClear
						onChange={(val) => {
							form.setFieldsValue({ giaTriLienQuan: undefined });
							setTruongThongTinLienQuan(recordCauHinh?.danhSachCot?.find((item: { ma: any }) => item.ma === val));
						}}
						options={recordCauHinh?.danhSachCot
							?.filter((item: { ma: any }) => item.ma !== recordCot?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.truongthongtinlienquan' })}
					/>
				</Form.Item>
				{truongThongTinLienQuan?.kieuDuLieu ? (
					<FormGiaTriLienQuan truongThongTinLienQuan={truongThongTinLienQuan} />
				) : null}

				<Form.Item name='layDuLieuTu' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.laydulieutu' })}>
					<Select
						allowClear
						options={recordCauHinh?.danhSachCot
							?.filter((item: { ma: any }) => item.ma !== recordCauHinh?.ma)
							?.map((item: { ten: any; ma: any }) => ({ label: item.ten, value: item.ma }))}
						placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.laydulieutu' })}
					/>
				</Form.Item>

				<Form.Item name='truongLayDuLieu' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.truonglaydulieu' })} rules={[...rules.text]}>
					<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.truonglaydulieu' })} />
				</Form.Item>

				<Row gutter={[12, 0]}>
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='batBuoc' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.batbuoc' })} rules={[...rules.required]}>
							<Radio.Group
								options={[
									{ value: true, label: intl.formatMessage({ id: 'diemrenluyen.maudon.co' }) },
									{ value: false, label: intl.formatMessage({ id: 'diemrenluyen.maudon.khong' }) },
								]}
							/>
						</Form.Item>
					</Col>
					{isAvailableDangMang && (
						<Col span={8}>
							<Form.Item name='laDangMang' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.nhapnhieugiatri' })} rules={[...rules.required]}>
								<Radio.Group
									options={[
										{ value: true, label: intl.formatMessage({ id: 'diemrenluyen.maudon.co' }) },
										{ value: false, label: intl.formatMessage({ id: 'diemrenluyen.maudon.khong' }) },
									]}
								/>
							</Form.Item>
						</Col>
					)}
					<Col span={isAvailableDangMang ? 8 : 12}>
						<Form.Item name='colspan' label={intl.formatMessage({ id: 'diemrenluyen.maudon.cot.chieurong' })}>
							<InputNumber style={{ width: '100%' }} min={0} max={24} placeholder={intl.formatMessage({ id: 'diemrenluyen.maudon.placeholder.nhap' })} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!editCot ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' }) : intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.luulai' })}
					</Button>
					{!editCot && (
						<Button
							loading={formSubmiting}
							onClick={() => {
								form.validateFields();
								const values = form.getFieldsValue();
								onFinish(values, true);
							}}
							type='primary'
						>
							{intl.formatMessage({ id: 'diemrenluyen.cauhinh.button.themmoivatieptuc' })}
						</Button>
					)}
					<Button onClick={() => props.onCancel()}>{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCot;
