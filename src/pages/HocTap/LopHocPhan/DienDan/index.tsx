import { Empty, Skeleton, Spin } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { history, Link, useModel } from 'umi';
import './style.less';
import CardAddStatus from './components/CardAddStatus';
import CardStatus from './components/CardStatus';

interface IProps {
	idLopHocPhan: string;
}
const DienDanLopPage = (props: IProps) => {
	const { idLopHocPhan } = props;
	const {
		getModel,
		danhSach,
		deleteModel,
		handleEdit,
		getByIdModel,
		record,
		loading,
		putModel,
		total,
		setLimit,
		limit,
	} = useModel('diendan.baidang');
	const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const { idBaiViet } = history?.location?.query ?? {};

	const getData = () => {
		if (idBaiViet) getByIdModel(idBaiViet?.toString(), true);
		else getModel({ lopHocPhanId: idLopHocPhan }, undefined, { ghimBaiViet: -1 });
	};

	useEffect(() => {
		if (idLopHocPhan) getData();
	}, [idLopHocPhan, idBaiViet, limit]);

	useEffect(() => {
		getThongTinCuaToiModel();
	}, []);

	return (
		<div className='dien-dan'>
			{!!idBaiViet ? (
				<div style={{ marginBottom: 12 }}>
					<Link
						to='#!'
						onClick={(e) => {
							e.preventDefault();
							history.push(`${history?.location?.pathname}${history?.location?.hash ?? ''}`);
						}}
					>
						← Quay lại
					</Link>
				</div>
			) : null}

			<Spin spinning={loading}>
				<div className='main-content'>
					<CardAddStatus hiddenAdd={!!idBaiViet} idLopHocPhan={idLopHocPhan} getData={getData} />

					{!idBaiViet ? (
						<InfiniteScroll
							style={{ overflow: 'unset' }}
							dataLength={danhSach?.length}
							next={() => {
								if (loading) return;
								setLimit(limit + 5);
							}}
							hasMore={danhSach?.length < total}
							loader={
								<div style={{ padding: '12px 24px' }}>
									<Skeleton paragraph={{ rows: 3 }} active />
								</div>
							}
							scrollableTarget='body'
						>
							{danhSach.length ? (
								danhSach?.map((val) => (
									<CardStatus
										key={val._id}
										data={val}
										deleteModel={(id) => deleteModel(id, getData)}
										handleEdit={(data) => handleEdit(data)}
										handlePin={(data) => putModel(val?._id, { ghimBaiViet: data }, getData)}
										getDataPost={getData}
									/>
								))
							) : (
								<Empty description='Diễn đàn chưa có bài đăng nào!' style={{ marginTop: 32 }} />
							)}

							{!!danhSach.length && danhSach?.length === total ? (
								<div className='flex justify-center' style={{ marginTop: 24, color: '#a7abaf' }}>
									Đã xem hết bản tin
								</div>
							) : null}
						</InfiniteScroll>
					) : record?._id ? (
						<CardStatus
							data={record}
							deleteModel={(id) => {
								deleteModel(id, () => {
									getData();
									history.push(`${history?.location?.pathname}${history?.location?.hash ?? ''}`);
								});
							}}
							handleEdit={(data) => handleEdit(data)}
							handlePin={(data) => putModel(record?._id ?? '', { ghimBaiViet: data }, getData)}
							detail
							getDataPost={getData}
						/>
					) : (
						<Empty description='Không tìm thấy bài viết' />
					)}
				</div>
			</Spin>
		</div>
	);
};
export default DienDanLopPage;
