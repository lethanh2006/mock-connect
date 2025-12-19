import { ColorDiemChu, type ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { EMinhChungQuyDoiDiem, colorTrangThaiHocPhanQuyDoi } from '@/services/HocTap/constant';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Descriptions, Form, Modal, Row, Space, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormQuyDoiDiem from '../components/Form';

const FormHocPhanQuyDoiDiem = (props: { getData: () => void }) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const { setVisibleForm, record, visibleForm, isView, putModel, formSubmiting } = useModel(
		'daotao.quydoidiem.sinhvienquydoidiem',
	);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else form.setFieldsValue(record);
	}, [visibleForm]);

	const onFinish = async (values: QuyDoiDiem.IQuyDoiDiemSinhVien) => {
		putModel(record?._id ?? '', { ...values, maHocPhan: record?.maHocPhan }, getData);
	};

	const renderDiem = (he10?: number, he4?: number, diemChu?: ELoaiDiemChu, tinhDiemTichLuy?: boolean) => (
		<Space wrap>
			{he10 ? (
				<span>
					{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.diem.he10' })}: <b>{he10 ?? ''}</b>
				</span>
			) : null}
			{he4 ? (
				<span>
					{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.diem.he4' })}: <b>{he4}</b>
				</span>
			) : null}
			<span>
				{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.diem.chu' })}:{' '}
				<b style={diemChu ? { color: ColorDiemChu[diemChu] } : undefined}>{diemChu}</b>
			</span>
			{tinhDiemTichLuy ? (
				<span className='text-success'>{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.diem.tichluy' })}</span>
			) : null}
		</Space>
	);

	return (
		<Modal
			title={`${isView ? intl.formatMessage({ id: 'tientrinhhoctap.congnhan.form.viewTitle' }) : intl.formatMessage({ id: 'tientrinhhoctap.congnhan.form.editTitle' })}`}
			open={visibleForm}
			width={isView ? 700 : 800}
			footer={null}
			onCancel={() => setVisibleForm(false)}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{isView ? (
					<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
						<Descriptions column={1}>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.desc.hocphan' })}>
								{record?.hocPhan?.ten ?? ''} ({record?.maHocPhan ?? ''} - {record?.hocPhan?.soTinChi ?? ''}{' '}
								{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.tinchi' })})
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.desc.ketqua' })}>
								{renderDiem(record?.diemHe10, record?.diemHe4, record?.diemChu)}{' '}
								{record?.tinhDiemTichLuy ? (
									<span className='text-success'>
										{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.diem.tichluy' })}
									</span>
								) : (
									''
								)}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.desc.khuyennghi' })}>
								{
									<div
										dangerouslySetInnerHTML={{
											__html: `${record?.khuyenNghi?.map((items) => items).join(', ')}`,
										}}
									/>
								}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.desc.trangthai' })}>
								{record?.trangThai ? (
									<Tag color={colorTrangThaiHocPhanQuyDoi[record?.trangThai]}>{record?.trangThai}</Tag>
								) : null}
							</Descriptions.Item>

							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.desc.loaiminhchung' })}>
								{record?.loai}
							</Descriptions.Item>
							{record?.loai === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
								<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.chungchi.title' })}>
									<div>
										- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.chungchi.ten' })}:{' '}
										<b>{record?.tenChungChi ?? ''}</b>
										<br />- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.chungchi.bac' })}:{' '}
										<b>{record?.bacChungChi ?? ''}</b>
										<br />- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.chungchi.donvi' })}:{' '}
										<b>{record?.donViCap ?? ''}</b>
										<br />- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.chungchi.hieuluc' })}:{' '}
										<b>{record?.thoiGianHieuLuc ? dayjs(record?.thoiGianHieuLuc).format('DD/MM/YYYY') : '--'}</b>
									</div>
								</Descriptions.Item>
							) : record?.loai === EMinhChungQuyDoiDiem.NCKH ? (
								<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.nckh.title' })}>
									<div>
										- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.nckh.tendetai' })}:{' '}
										<b>{record?.tenDeTaiNckh ?? ''}</b>
										<br />- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.nckh.huongdan' })}:{' '}
										<b>{record?.nguoiHuongDanNckh ?? ''}</b>
										<br />- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.nckh.diem' })}:{' '}
										<b>{record?.diemNckh ?? ''}</b>
									</div>
								</Descriptions.Item>
							) : (
								<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.title' })}>
									<div>
										- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.ten' })}:{' '}
										{record?.tenHocPhan ? (
											<b>{record.tenHocPhan}</b>
										) : (
											<i>{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.noten' })}</i>
										)}{' '}
										({record?.maHocPhanMinhChung} - {record?.soTinChi} tín chỉ)
										<br />- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.truong' })}:{' '}
										<b>{record?.tenTruong ?? ''}</b>.{' '}
										{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.trinhdo' })}:{' '}
										<b>{record?.trinhDoDaoTao ?? ''}</b>.{' '}
										{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.nganhhoc' })}: <b>{record?.nganh ?? ''}</b>.
										{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.namtotnghiep' })}:{' '}
										<b>{record?.namTotNghiep ?? ''}</b>
										<br />- {intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp.ketqua' })}:{' '}
										{renderDiem(record?.diemHe10MinhChung, record?.diemHe4MinhChung, record?.diemChuMinhChung)}
									</div>
								</Descriptions.Item>
							)}

							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.desc.ghichu' })}>
								{record?.ghiChu ?? '--'}
							</Descriptions.Item>
						</Descriptions>
					</Row>
				) : (
					<FormQuyDoiDiem form={form} isHocPhan />
				)}

				<div className='form-footer'>
					{!isView ? (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
					) : null}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormHocPhanQuyDoiDiem;
