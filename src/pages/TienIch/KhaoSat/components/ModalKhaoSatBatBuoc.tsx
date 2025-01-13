import { CheckCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormTraLoiKhaoSat from './Form';

const ModalKhaoSatBatBuoc = () => {
	const { visibleKhaoSatBatBuoc, record, dsKhaoSatBatBuoc, isThanhCong, setIsThanhCong, setVisibleKhaoSatBatBuoc } =
		useModel('tienich.dotkhaosat');
	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');

	const getBieuMauModel = () => {
		if (record?._id) getBieuMau(record?.idKhaoSat ?? '');
	};

	useEffect(() => {
		getBieuMauModel();
	}, [record?._id]);

	return (
		<Modal title='Chi tiết khảo sát' visible={visibleKhaoSatBatBuoc} footer={null} width={800} closable={false}>
			{isThanhCong ? (
				<>
					<div style={{ marginTop: 12, textAlign: 'center' }}>
						<div>
							<CheckCircleOutlined
								style={{ color: 'var(--ant-success-color)', fontSize: 100, marginBottom: 12 }}
								type='primary'
							/>
						</div>

						<div style={{ color: '#1890ff', fontSize: 20, fontWeight: 600 }}>THÀNH CÔNG</div>

						<div>
							{dsKhaoSatBatBuoc?.length ? (
								<i>
									Bạn còn <b>{dsKhaoSatBatBuoc?.length}</b> đợt khảo sát chưa thực hiện, vui lòng tiếp tục thực thiện để
									sử dụng các dịch vụ trong hệ thống!
								</i>
							) : (
								<i>Đã thực hiện khảo sát thành công, bạn có thể tiếp tục sử dụng các dịch vụ trong hệ thống!</i>
							)}
						</div>
					</div>
					<div className='form-footer'>
						{dsKhaoSatBatBuoc?.length ? (
							<Button type='primary' onClick={() => setIsThanhCong(false)}>
								Xem chi tiết
							</Button>
						) : (
							<Button
								onClick={() => {
									setIsThanhCong(false);
									setVisibleKhaoSatBatBuoc(false);
								}}
							>
								Đóng
							</Button>
						)}
					</div>
				</>
			) : (
				<>
					<div style={{ marginBottom: 12 }}>
						<Select
							style={{ width: 300 }}
							value={record?._id}
							placeholder='Chọn đợt khảo sát'
							options={dsKhaoSatBatBuoc?.map((item) => ({
								value: item._id,
								label: item.ten,
							}))}
						/>
					</div>
					<FormTraLoiKhaoSat hideCard isBatBuoc />
				</>
			)}
		</Modal>
	);
};

export default ModalKhaoSatBatBuoc;
