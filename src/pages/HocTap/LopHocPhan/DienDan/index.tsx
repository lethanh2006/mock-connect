import { useModel, history } from 'umi';
import { useEffect } from 'react';
import './style.less';
import { Button, Spin } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import CardAddStatus from './components/CardAddStatus';
import CardStatus from './components/CardStatus';

interface IProps {
	idLopHocPhan: string;
}
const DienDan = (props: IProps) => {
	const { idLopHocPhan } = props;
	const { getModel, danhSach, deleteModel, handleEdit, getByIdModel, record, loading, putModel } =
		useModel('diendan.baidang');
	const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');

	const query = history?.location?.query;

	const getData = () => {
		if (query?.idBaiViet) {
			getByIdModel(query?.idBaiViet?.toString(), true);
		} else {
			getModel({ lopHocPhanId: idLopHocPhan }, undefined, { ghimBaiViet: -1 });
		}
	};

	useEffect(() => {
		if (idLopHocPhan) getData();
	}, [idLopHocPhan, query]);

	useEffect(() => {
		getThongTinCuaToiModel();
	}, []);

	if (query?.idBaiViet) {
		return (
			<Spin spinning={loading}>
				<div className='dien-dan'>
					<div>
						<Button
							icon={<LeftOutlined />}
							type={'link'}
							onClick={() => {
								history.push(`${history?.location?.pathname}${history?.location?.hash ?? ''}`);
							}}
						>
							Quay lại
						</Button>
					</div>
					<CardAddStatus hiddenAdd idLopHocPhan={idLopHocPhan} getData={getData} />
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								width: '100%',
								maxWidth: '625px',
								display: 'grid',
								gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
								gap: 20,
							}}
						>
							<CardStatus
								data={record as BaiDang.IRecord}
								deleteModel={(id) => {
									deleteModel(id, () => {
										getData();
										history.push(`${history?.location?.pathname}${history?.location?.hash ?? ''}`);
									});
								}}
								handleEdit={(data) => {
									handleEdit(data);
								}}
								handlePin={(data) => {
									putModel(record?._id ?? '', { ghimBaiViet: data }, getData);
								}}
								detail
							/>
						</div>
					</div>
				</div>
			</Spin>
		);
	} else {
		return (
			<Spin spinning={loading}>
				<div className='dien-dan'>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								width: '100%',
								maxWidth: '625px',
								display: 'grid',
								gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
								gap: 20,
							}}
						>
							<CardAddStatus idLopHocPhan={idLopHocPhan} getData={getData} />
							{danhSach?.map((val) => {
								return (
									<CardStatus
										data={val}
										deleteModel={(id) => {
											deleteModel(id, getData);
										}}
										handleEdit={(data) => {
											handleEdit(data);
										}}
										handlePin={(data) => {
											putModel(val?._id, { ghimBaiViet: data }, getData);
										}}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</Spin>
		);
	}
};
export default DienDan;
