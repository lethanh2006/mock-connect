import ButtonExtend from '@/components/Table/ButtonExtend';
import { ReloadOutlined } from '@ant-design/icons';
import { Skeleton, Spin } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { history, Link, useModel } from 'umi';
import '../../LopHocPhan/DienDan/style.less';
import CardStatusBaiTap from './components/CardStatusBaiTap';

const BaiTapPage = (props: { lopHocPhanId: string }) => {
	const { lopHocPhanId } = props;
	const { getModel, danhSach, loading, setLimit, limit, total } = useModel('daotao.baitap');
	const { idBaiTap } = history?.location?.query ?? {};

	const getData = () => {
		if (lopHocPhanId)
			getModel(undefined, undefined, undefined, undefined, undefined, `lop-hoc-phan/${lopHocPhanId}/me`);
	};

	useEffect(() => {
		getData();
	}, [lopHocPhanId]);

	return (
		<div className='dien-dan'>
			{!!idBaiTap ? (
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
					{!danhSach?.length ? (
						<div style={{ textAlign: 'center' }}>
							<div style={{ marginBottom: 8 }}>
								<img src='/images/bai-tap.svg' />
							</div>
							<div>
								<b>Hiện tại lớp tín chỉ chưa có bài tập</b> <br />
								<span>Theo giõ thông báo để không bỏ lỡ bài tập nào!</span>
							</div>
						</div>
					) : (
						<>
							<div style={{ textAlign: 'right', marginBottom: 8 }}>
								<ButtonExtend icon={<ReloadOutlined />} onClick={() => getData()}>
									Tải lại
								</ButtonExtend>
							</div>
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
								{danhSach?.map((val) => (
									<CardStatusBaiTap key={val._id} data={val} getData={getData} />
								))}
							</InfiniteScroll>
						</>
					)}
				</div>
			</Spin>
		</div>
	);
};

export default BaiTapPage;
