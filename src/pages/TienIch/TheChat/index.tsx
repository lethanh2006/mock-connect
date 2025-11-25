import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { Descriptions, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectDotTheChat from './Dot/Select';
import ChiTietKetQuaDanhGia from './KetQua';

const TheChatPage = () => {
	const { initialState } = useModel('@@initialState');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recDot, setRecord, danhSach: dsDot } = useModel('tienich.thechat.dot');
	const { record, getOneModel, loading: loadingChiSo } = useModel('tienich.thechat.chisothehinh');
	const { getAllModel, danhSach, loading: loadingKetQua } = useModel('tienich.thechat.ketquathechat');

	useEffect(() => {
		if (initialState?.currentUser?.ssoId && recDot?._id) {
			getOneModel({ dotDanhGiaTheChatId: recDot?._id, ssoIdSinhVien: initialState?.currentUser?.ssoId });
			getAllModel(
				undefined,
				undefined,
				{
					dotDanhGiaTheChatId: recDot?._id,
					ssoIdSinhVien: initialState?.currentUser?.ssoId,
				},
				undefined,
				'me/many',
			);
		}
	}, [initialState?.currentUser?.ssoId, recDot?._id]);

	const getBMIColor = (bmi: number | null) => {
		if (!bmi) return;
		if (bmi < 18.5) return '#1890ff';
		if (bmi < 25) return '#52c41a';
		if (bmi < 30) return '#faad14';
		return '#f5222d';
	};

	const getWHRStatus = (whr: number | null) => {
		if (!whr) return {};
		if (whr < 0.85) return { text: 'Tốt', color: '#52c41a' };
		if (whr < 0.9) return { text: 'Trung bình', color: '#faad14' };
		return { text: 'Cao', color: '#f5222d' };
	};

	return (
		<>
			<FilterHocKy style={{ marginBottom: 12 }} isSetHocKy>
				<SelectDotTheChat
					isSetRecord
					style={{ width: 250 }}
					value={record?._id}
					condition={{ maHocKy: recHocKy?.ma }}
					onChange={(val) => setRecord(dsDot?.find((item) => item?._id === val))}
				/>
			</FilterHocKy>

			<Spin spinning={loadingChiSo || loadingKetQua}>
				<Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}>
					<Descriptions.Item label='Mã sinh viên'>{record?.maSv ?? danhSach?.[0]?.maSv ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Họ tên'>{record?.tenSv ?? danhSach?.[0]?.tenSv ?? '--'}</Descriptions.Item>
					<Descriptions.Item label='Lớp hành chính'>
						{record?.lopHanhChinh ?? danhSach?.[0]?.lopHanhChinh ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label='Khóa ngành'>
						{record?.tenKhoaNganh ?? danhSach?.[0]?.tenKhoaNganh ?? '--'}
					</Descriptions.Item>
				</Descriptions>

				{danhSach?.length ? (
					<div style={{ marginTop: 12 }}>
						<ChiTietKetQuaDanhGia danhSachKetQua={danhSach} />
					</div>
				) : null}

				{record?._id && (
					<div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
						<hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '15px 0' }} />

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
							<div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
								<div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Chiều cao</div>
								<div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>
									{record?.chieuCao} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>cm</span>
								</div>
							</div>
							<div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
								<div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Cân nặng</div>
								<div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>
									{record?.canNang} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>kg</span>
								</div>
							</div>
						</div>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
							<div style={{ background: '#fff3e0', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
								<div style={{ fontSize: '12px', color: '#e65100', marginBottom: '4px' }}>Vòng eo</div>
								<div style={{ fontSize: '20px', fontWeight: 'bold', color: '#e65100' }}>
									{record?.vongEo} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>cm</span>
								</div>
							</div>
							<div style={{ background: '#f3e5f5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
								<div style={{ fontSize: '12px', color: '#7b1fa2', marginBottom: '4px' }}>Vòng mông</div>
								<div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7b1fa2' }}>
									{record?.vongMong} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>cm</span>
								</div>
							</div>
						</div>

						<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
							<div
								style={{
									background: getBMIColor(record?.bmi ?? null) + '15',
									padding: '12px',
									borderRadius: '8px',
									textAlign: 'center',
								}}
							>
								<div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>BMI</div>
								<div style={{ fontSize: '20px', fontWeight: 'bold', color: getBMIColor(record?.bmi ?? null) }}>
									{record?.bmi}
								</div>
							</div>
							<div
								style={{
									background: getWHRStatus(record?.whr ?? null).color + '15',
									padding: '12px',
									borderRadius: '8px',
									textAlign: 'center',
								}}
							>
								<div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>WHR</div>
								<div style={{ fontSize: '20px', fontWeight: 'bold', color: getWHRStatus(record?.whr ?? null).color }}>
									{record?.whr}
								</div>
								<div style={{ fontSize: '11px', marginTop: '2px', color: getWHRStatus(record?.whr ?? null).color }}>
									{getWHRStatus(record?.whr ?? null).text}
								</div>
							</div>
						</div>

						<div
							style={{
								marginTop: '15px',
								fontSize: '13px',
								background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
								padding: '14px',
								borderRadius: '8px',
								color: '#2e7d32',
								lineHeight: '1.6',
								border: '1px solid #c8e6c9',
							}}
						>
							{record?.danhGiaChung}
						</div>
					</div>
				)}
			</Spin>
		</>
	);
};

export default TheChatPage;
