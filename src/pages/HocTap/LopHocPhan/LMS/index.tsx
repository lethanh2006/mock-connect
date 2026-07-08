import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { formatDateTime } from '@/utils/formatDate';
import { openSafeUrl } from '@/utils/security';
import { ApiOutlined } from '@ant-design/icons';
import { Card, Checkbox, Col, Descriptions, message, Progress, Row, Spin, Tabs, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';

const LmsOdooPage = (props: { idLopHocPhan: string }) => {
	const intl = useIntl();
	const { idLopHocPhan } = props;
	const { getByIdModel, record, loading } = useModel('lophocphan.lmsodoo');
	const [activeKey, setActiveKey] = useState<string>('1');

	const dataWithTT = useMemo(() => {
		let tt = 0;

		return (record?.hocLieuAll ?? [])?.map((item) => {
			if (item?.isCategory === true) {
				tt = 0;
				return item;
			}

			tt++;
			return { ...item, tt };
		});
	}, [record?.hocLieuAll]);

	const getData = () => {
		if (idLopHocPhan) getByIdModel(`lop-hoc-phan/${idLopHocPhan}/me/info`);
	};

	useEffect(() => {
		getData();
	}, [idLopHocPhan]);

	const onCell = (rec: LopHocPhan.THocLieuAllLms) => ({
		style: {
			fontWeight: rec?.isCategory === true ? 600 : undefined,
			backgroundColor: rec?.isCategory === true ? '#e8fafdbf' : undefined,
		},
		colSpan: rec?.isCategory === true ? 0 : 1,
	});

	const columns: IColumn<LopHocPhan.THocLieuLms>[] = [
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.tenbai' }),
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.solanlambai' }),
			dataIndex: 'soLanLamBaiKiemTra',
			width: 100,
			align: 'center',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.tghoanthanh' }),
			dataIndex: 'thoiGianHoanThanh',
			width: 130,
			align: 'center',
			render: (val, rec) => val && formatDateTime(val),
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.trangthai' }),
			dataIndex: 'hoanThanh',
			align: 'center',
			width: 100,
			render: (val, rec) =>
				val ? (
					<Tag color='green'>{intl.formatMessage({ id: 'lophocphan.id.lms.hoanthanh' })}</Tag>
				) : (
					<Tag color='red'>{intl.formatMessage({ id: 'lophocphan.id.lms.chuahoanthanh' })}</Tag>
				),
		},
	];

	const columnsAll: IColumn<LopHocPhan.THocLieuAllLms>[] = [
		{
			title: 'TT',
			dataIndex: 'tt' as any,
			width: 40,
			align: 'center',
			render: (val, rec) => {
				if (rec.isCategory === true) {
					return { children: null, props: { colSpan: 0 } };
				}
				return val;
			},
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.tenbai' }),
			dataIndex: 'ten',
			width: 220,
			filterType: 'string',
			onCell: (rec) => ({
				...onCell(rec),
				colSpan: rec?.isCategory === true ? 6 : 1,
			}),
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.tgkt' }),
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			sortable: true,
			render: (val, rec) => {
				if (rec?.isCategory === true) {
					return { children: null, props: { colSpan: 0 } };
				}
				return val && formatDateTime(val);
			},
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.baikiemtra' }),
			dataIndex: 'laBaiKiemTra',
			width: 90,
			align: 'center',
			render: (val, rec) => {
				if (rec?.isCategory === true) {
					return { children: null, props: { colSpan: 0 } };
				}
				return <Checkbox checked={rec?.laBaiKiemTra} />;
			},
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lms.trangthai' }),
			dataIndex: 'textCheckBaiKiemTra',
			align: 'center',
			width: 160,
			render: (val, rec) => {
				if (rec?.isCategory === true) {
					return { children: null, props: { colSpan: 0 } };
				}

				let color = 'default';

				if (rec.hoanThanh && !rec.quaHan) {
					color = 'green';
				} else if (rec.hoanThanh && rec.quaHan) {
					color = 'orange';
				} else if (!rec.hoanThanh && rec.quaHan) {
					color = 'red';
				} else {
					color = 'blue';
				}

				return <Tag color={color}>{val}</Tag>;
			},
		},
	];

	return (
		<Spin spinning={loading}>
			<ButtonExtend
				style={{ marginBottom: 16 }}
				type='primary'
				icon={<ApiOutlined />}
				onClick={() => {
					if (idLopHocPhan) {
						getByIdModel(`lop-hoc-phan/${idLopHocPhan}/url/sv`, false).then((res: unknown) => {
							const url = typeof res === 'string' ? res : (res as { url?: string })?.url;
							if (url && openSafeUrl(url)) return;
							if (url) message.error(intl.formatMessage({ id: 'lichsukien.chitiet.duongdan.khonghople' }));
							else message.error(intl.formatMessage({ id: 'lichsukien.chitiet.loi' }));
						});
					}
				}}
			>
				{intl.formatMessage({ id: 'lophocphan.id.lms.title' })}
			</ButtonExtend>

			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card variant='borderless'>
						<div className='fw500' style={{ marginBottom: 12, fontSize: 16 }}>
							{intl.formatMessage({ id: 'lophocphan.id.lms.thongtinlop' })}
						</div>
						<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lms.tenhp' })}>
								{record?.hocPhan?.ten ?? '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lms.tientrinh' })}>
								<Progress percent={record?.tiLeHoanThanh ?? 0} />
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lms.tgvaolop' })}>
								{record?.thoiGianTaoVao ? formatDateTime(record?.thoiGianTaoVao) : '--'}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lms.tgcapnhat' })}>
								{record?.thoiGianCapNhatGanNhatVao ? formatDateTime(record?.thoiGianCapNhatGanNhatVao) : '--'}
							</Descriptions.Item>
						</Descriptions>
					</Card>
				</Col>

				<Col span={24}>
					<Card variant='borderless'>
						<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
							<Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'lophocphan.id.lms.tientrinhht' })} />
							<Tabs.TabPane key='0' tab={intl.formatMessage({ id: 'lophocphan.id.lms.baigiang' })} />
						</Tabs>

						{activeKey === '0' ? (
							<TableStaticData
								size='small'
								columns={columnsAll}
								data={dataWithTT}
								onReload={getData}
								otherProps={{
									pagination: false,
									scroll: { y: 575 },
								}}
								hasTotal
							/>
						) : activeKey === '1' ? (
							<TableStaticData
								size='small'
								columns={columns}
								data={record?.hocLieu ?? []}
								addStt
								hasTotal
								onReload={getData}
							/>
						) : null}
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default LmsOdooPage;
