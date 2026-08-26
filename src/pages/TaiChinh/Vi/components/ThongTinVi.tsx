import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { tienVietNam } from '@/utils/utils';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Descriptions, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ThongTinVi = () => {
	const intl = useIntl();
	const { viCuaToi, loadingVi, getViCuaToiModel } = useModel('taichinh.vi');

	useEffect(() => {
		getViCuaToiModel();
	}, []);

	const thongKeData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'visinhvien.info.sodu' }),
			value: tienVietNam(viCuaToi?.soDu ?? 0),
			status: 'success',
		},
		{
			title: intl.formatMessage({ id: 'visinhvien.info.trangthai' }),
			value: viCuaToi?.active ? (
				<Tag icon={<CheckCircleOutlined />} color='success'>
					{intl.formatMessage({ id: 'visinhvien.info.active' })}
				</Tag>
			) : (
				<Tag icon={<StopOutlined />} color='error'>
					{intl.formatMessage({ id: 'visinhvien.info.inactive' })}
				</Tag>
			),
			status: viCuaToi?.active ? 'success' : 'error',
		},
	];

	return (
		<div style={{ marginBottom: 18 }}>
			<StatisticsCard data={thongKeData} loading={loadingVi} colSpan={{ xs: 24, md: 12 }} hideCard />

			<Descriptions column={{ xs: 1, md: 2 }} size='small' style={{ marginTop: 12 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'visinhvien.info.masv' })}>
					{viCuaToi?.userCode ?? ''}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'visinhvien.info.hoten' })}>
					{viCuaToi?.userFullname ?? ''}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'visinhvien.info.email' })}>
					{viCuaToi?.userEmail ?? ''}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'visinhvien.info.sdt' })}>
					{viCuaToi?.userPhone ?? ''}
				</Descriptions.Item>
			</Descriptions>
		</div>
	);
};

export default ThongTinVi;
