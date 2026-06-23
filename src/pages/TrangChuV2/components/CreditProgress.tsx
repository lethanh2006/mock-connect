import { tinhThongKeMinor } from '@/pages/HocTap/TienTrinhHocTap/utils';
import { Flex, Progress, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

interface CreditProgressRowProps {
	title: string;
	current?: number;
	total?: number;
	color: string;
}

const getPercent = (current?: number, total?: number) => {
	if (!total) return 0;
	return Math.min(100, ((current ?? 0) * 100) / total);
};

const CreditProgressRow = ({ title, current, total, color }: CreditProgressRowProps) => {
	const intl = useIntl();

	return (
		<Flex vertical gap={6} className='credit-progress-row'>
			<Flex align='center' justify='space-between' gap={12}>
				<Typography.Text className='credit-progress-title'>{title}</Typography.Text>
				<Typography.Text className='credit-progress-value'>
					<b>{total ? (current ?? 0) : '--'}</b> /{total || '--'}{' '}
					{intl.formatMessage({ id: 'trangchu.v2.academicProgress.credits' })}
				</Typography.Text>
			</Flex>

			<Progress
				percent={getPercent(current, total)}
				showInfo={false}
				strokeColor={color}
				strokeWidth={5}
				trailColor='#e8e8e8'
			/>
		</Flex>
	);
};

const CreditProgress = () => {
	const intl = useIntl();
	const { record: recTienTrinh, getTienTrinhTotNghiepModel } = useModel('sinhvien.tientrinhtotnghiep');
	const { getKhoaNganhMeModel } = useModel('sinhvien.sinhvien');
	const { tienTrinhKhungMinors, sinhVienGetTienTrinhKhungModel } = useModel('daotao.chuongtrinhdaotao');

	const thongKeMinor = useMemo(() => tinhThongKeMinor(tienTrinhKhungMinors), [tienTrinhKhungMinors]);

	useEffect(() => {
		getKhoaNganhMeModel().then((res) => {
			if (res?.khoaNganhChinh?.ma) getTienTrinhTotNghiepModel(res.khoaNganhChinh.ma);
			sinhVienGetTienTrinhKhungModel(false);
		});
	}, []);

	return (
		<Flex vertical gap={16}>
			<CreditProgressRow
				title={intl.formatMessage({ id: 'tientrinhhoctap.ctdt' })}
				current={recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa}
				total={recTienTrinh?.ctdtKeHoach?.tongSoTinChi}
				color='#134d8b'
			/>

			{!!thongKeMinor.tong && (
				<CreditProgressRow
					title={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}
					current={thongKeMinor.daDat}
					total={thongKeMinor.tong}
					color='#d9a45f'
				/>
			)}
		</Flex>
	);
};

export default CreditProgress;
