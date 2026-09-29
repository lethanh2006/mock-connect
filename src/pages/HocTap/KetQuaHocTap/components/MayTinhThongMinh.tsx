import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type DiemHocPhan } from '@/services/DaoTao/DiemHocPhan/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import rules from '@/utils/rules';
import { convertNumberScoreToAlphabet } from '@/utils/utils';
import { Button } from '@vinuni/ui';
import { Col, Row } from '@/components/MyGrid';
import ModalExpandable from '@/components/Table/ModalExpandable';
import {
	Checkbox,
	Descriptions,
	Form,
	InputNumber,
	Popover,
	Segmented,
	Tag,
} from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { Card } from '@/components/PageCard';

const MayTinhThongMinh = (props: { maKhoaNganh?: string }) => {
	const intl = useIntl();
	const { maKhoaNganh } = props;
	const { getDiemSinhVienModel, loading, tongTuChon } = useModel('daotao.diemhocphan');
	const { getAllModel: getLoaiHp, danhSach: danhSachLoaiHp } = useModel('daotao.loaihocphan');
	const [danhSach, setDanhSach] = useState<DiemHocPhan.IDiemSinhVien[]>();
	const [record, setRecord] = useState<DiemHocPhan.IDiemSinhVien>();
	const [tongKet, setTongKet] = useState<number>(0);
	const [tuChonCoDiem, setTuChonCoDiem] = useState<number>(0);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [showAll, setShowAll] = useState<string>('none');
	const [form] = Form.useForm();
	const loaiHpTinhDiem = danhSachLoaiHp.filter((i) => i.isTinhDiem).map((i) => i.ma);

	const tinhDiemTongKet = (data: DiemHocPhan.IDiemSinhVien[]) => {
		const tongDiem = _.sumBy(data, (item) => {
			if (!loaiHpTinhDiem.includes(item.maLoaiHocPhan)) return 0;
			const diem = (item.diemDuKienThang4 ?? item.diemThang4 ?? 0) * (item.soTinChi ?? 0);
			return diem;
		});
		const tongTinChi = _.sumBy(data, (item) =>
			loaiHpTinhDiem.includes(item.maLoaiHocPhan) && (item.diemDuKienThang4 || item.diemThang4)
				? (item.soTinChi ?? 0)
				: 0,
		);
		setTongKet(Math.round(tongTinChi === 0 ? 0 : (tongDiem * 100) / tongTinChi) / 100);

		const monTuChonCoDiem = data.filter(
			(item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && (item.diemDuKienThang4 || item.diemThang4),
		);
		setTuChonCoDiem(_.sumBy(monTuChonCoDiem, (item) => item.soTinChi ?? 0));
	};

	const fetch = async () => {
		await getDiemSinhVienModel({ maKhoaNganh }).then((data) => {
			tinhDiemTongKet(data);
			setDanhSach(data);
		});
	};

	useEffect(() => {
		getLoaiHp();
	}, []);

	useEffect(() => {
		if (maKhoaNganh && danhSachLoaiHp.length) fetch();
	}, [maKhoaNganh, danhSachLoaiHp.length]);

	const onOk = (values: any) => {
		const data = danhSach?.map((item) =>
			item.ma === record?.ma
				? {
					...record,
					diemDuKien: parseFloat(values.diemDuKien) || undefined,
					diemDuKienThang4: parseFloat(convertNumberScoreToAlphabet(values.diemDuKien)[1]) || undefined,
				}
				: item,
		);
		tinhDiemTongKet(data ?? []);
		setDanhSach(data);
		setModalVisible(false);
	};

	const onCell = (rec: DiemHocPhan.IDiemSinhVien) => ({
		onClick: () => {
			setRecord(rec);
			form.setFieldsValue({
				diemDuKien: rec?.diemDuKien ?? rec?.diemTongKet ?? undefined,
			});
			setModalVisible(true);
		},
		style: {
			cursor: 'pointer',
			backgroundColor: !rec.diemThang4 && !rec.diemDuKienThang4 ? '#f7dcdcbd' : undefined,
			color: !rec.diemThang4 && !rec.diemDuKienThang4 ? 'red' : undefined,
		},
	});

	const columns: IColumn<DiemHocPhan.IDiemSinhVien>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			dataIndex: 'ma',
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.mahp' }),
			filterType: 'string',
			sortable: true,
			width: 100,
			onCell,
		},
		{
			dataIndex: 'ten',
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.tenhp' }),
			filterType: 'string',
			width: 200,
			onCell,
		},
		{
			dataIndex: 'soTinChi',
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.stc' }),
			width: 60,
			align: 'center',
			onCell,
		},
		{
			dataIndex: 'loaiHocPhanCtdt',
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.loaihp' }),
			width: 80,
			align: 'center',
			// render: (val: ELoaiHocPhanCTDT) =>
			// 	val && <Tag color={val === ELoaiHocPhanCTDT.BAT_BUOC ? 'orange' : 'blue'}>{val}</Tag>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.hpTinhDiem' }),
			width: 60,
			align: 'center',
			render: (val, rec) => <Checkbox disabled checked={loaiHpTinhDiem.includes(rec.maLoaiHocPhan)} />,
			onCell,
		},
		{
			dataIndex: 'diemThang4',
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.diem4' }),
			width: 80,
			align: 'center',
			onCell,
		},
		{
			dataIndex: 'diemDuKien',
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.diemDuKien10' }),
			render: (s) => <b>{s}</b>,
			width: 80,
			align: 'center',
			onCell,
		},
		{
			dataIndex: 'diemDuKienThang4',
			title: intl.formatMessage({ id: 'ketquahoctap.maytinh.table.diemDuKien4' }),
			render: (s) => <b>{s}</b>,
			width: 80,
			align: 'center',
			onCell,
		},
	];

	return (
		<>
			<Row gutter={[12, 12]}>
				{/* <Text italic style={{ marginBottom: '16px' }}>
        * Lưu ý: Những điểm &#34;--&#34; là do bạn chưa đánh giá giảng viên. Vui lòng đánh giá để
        xem điểm!
      </Text> */}
				<Col span={24}>
					{intl.formatMessage({ id: 'ketquahoctap.maytinh.title.intro' })}
					<Popover
						content={
							<div style={{ maxWidth: 600 }}>
								{intl.formatMessage({ id: 'ketquahoctap.maytinh.guide.step1' })}
								<br />
								{intl.formatMessage({ id: 'ketquahoctap.maytinh.guide.step2' })}{' '}
								<b>{intl.formatMessage({ id: 'ketquahoctap.maytinh.guide.step2.bold' })}</b>;
								<br />
								{intl.formatMessage({ id: 'ketquahoctap.maytinh.guide.step3' })}
								<br />
								{intl.formatMessage({ id: 'ketquahoctap.maytinh.guide.step4' })}
							</div>
						}
					>
						<a>{intl.formatMessage({ id: 'ketquahoctap.maytinh.more' })}</a>
					</Popover>
				</Col>
				<Col span={24}>
					{intl.formatMessage({ id: 'ketquahoctap.maytinh.tongket.label' })}:{' '}
					{/* Hệ 10:{' '}
        <b style={{ fontSize: '1.5rem',  }}>{tongKet}</b>
        <Divider type="vertical" /> */}
					<b style={{ fontSize: '1.3rem', marginLeft: 8 }} className='text-primary'>
						{tongKet}
					</b>{' '}
					/ 4
					{/* <Divider type="vertical" />
        Dạng chữ: <b style={{ fontSize: '1.5rem',  }}>{chuDuKien}</b> */}
				</Col>
				<Col span={24}>
					{intl.formatMessage({ id: 'ketquahoctap.maytinh.tuchon.label' })}:{' '}
					<b className={tuChonCoDiem === tongTuChon ? 'text-success' : 'text-error'}>
						{tuChonCoDiem} / {tongTuChon}
					</b>{' '}
					{intl.formatMessage({ id: 'ketquahoctap.maytinh.tuchon.tongstc' })}.
				</Col>

				<Col span={24} style={{ marginTop: 12 }}>
					<TableStaticData
						columns={columns}
						data={
							danhSach?.filter((item) => showAll === 'all' || (item.trangThai && item.trangThai !== 'Chưa có điểm')) ??
							[]
						}
						otherProps={{ scroll: { y: 600 }, pagination: false }}
						loading={loading}
						hasTotal
					>
						<Segmented
							value={showAll}
							onChange={(val) => setShowAll(val.toString())}
							options={[
								{ value: 'none', label: intl.formatMessage({ id: 'ketquahoctap.maytinh.segment.learned' }) },
								{ value: 'all', label: intl.formatMessage({ id: 'ketquahoctap.maytinh.segment.all' }) },
							]}
						/>
					</TableStaticData>
				</Col>
			</Row>

			<ModalExpandable
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				width={600}
				footer={null}
				title={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.title' })}
			>
				<Card title={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.title' })}>
					<Descriptions column={1}>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.mahp' })}>
							{record?.ma}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.tenhp' })}>
							{record?.ten}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.stc' })}>
							{record?.soTinChi} {intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.tinchi' })}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.diem10' })}>
							{record?.diemTongKet}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.diem4' })}>
							{record?.diemThang4}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.diemchu' })}>
							{record?.diemChu ? <Tag color={ColorDiemChu[record?.diemChu]}>{record?.diemChu}</Tag> : null}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.maytinh.modal.trangthai' })}>
							{record?.trangThai}
						</Descriptions.Item>
					</Descriptions>

					<Form form={form} onFinish={onOk}>
						<Form.Item
							name='diemDuKien'
							label={<span className='fw500'>{intl.formatMessage({ id: 'ketquahoctap.maytinh.form.label' })}</span>}
							rules={[...rules.number(10, 4)]}
						>
							<InputNumber
								placeholder={intl.formatMessage({ id: 'ketquahoctap.maytinh.form.placeholder' })}
								min={4}
								max={10}
								style={{ width: '100%' }}
							/>
						</Form.Item>

						<div className='form-footer' style={{ width: '100%' }}>
							<Button type='submit' variant='default'>
								{intl.formatMessage({ id: 'ketquahoctap.maytinh.common.ok' })}
							</Button>
							<Button variant='outline' onClick={() => setModalVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
						</div>
					</Form>
				</Card>
			</ModalExpandable>
		</>
	);
};

export default MayTinhThongMinh;
