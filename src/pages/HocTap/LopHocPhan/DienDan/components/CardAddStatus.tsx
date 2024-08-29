import styled from 'styled-components';
import { Modal } from 'antd';
import { useModel } from 'umi';
import AvatarBlog from './Avatar';
import FormThemMoiBaiViet from './FormThemMoiBaiViet';

const CardAddStatusWrapper = styled.div`
	.card {
		width: 100%;
		max-width: 800px;
		padding: 20px;
		overflow: hidden;
		border-radius: 2px;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 1px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
	}
	.image {
		//width: 42px;
		//height: 42px;
		margin-right: 8px;
		//overflow: hidden;
		//border-radius: 50%;
	}

	.fake-input {
		display: flex;
		align-items: center;
		width: 100%;
		height: 40px;
		padding: 0 12px;
		background: rgba(136, 136, 136, 0.14);
		border-radius: 12px;
		cursor: pointer;
	}
`;

interface IProps {
	idLopHocPhan: string;
	getData?: () => void;
	hiddenAdd?: boolean;
}

const CardAddStatus = (props: IProps) => {
	const { idLopHocPhan, getData, hiddenAdd } = props;
	const { visibleForm, setVisibleForm, setEdit, setRecord } = useModel('diendan.baidang');
	const { record: recNhanSu } = useModel('sinhvien.sinhvien');

	return (
		<CardAddStatusWrapper>
			{!hiddenAdd && (
				<div className='card'>
					<div className='user-name flex item-center'>
						<div className='image' style={{ flexShrink: 0 }}>
							<AvatarBlog url={recNhanSu?.anhDaiDienUrl ?? ''} style={{ width: 42, height: 42 }} />
						</div>
						<div
							className='fake-input'
							onClick={() => {
								setEdit(false);
								setRecord(undefined);
								setVisibleForm(true);
							}}
						>
							Bạn có muốn chia sẻ điều gì với mọi người không?
						</div>
					</div>
				</div>
			)}

			<Modal
				title={'Thêm mới bài viết'}
				visible={visibleForm}
				onCancel={() => {
					setVisibleForm(false);
				}}
				footer={null}
				width={700}
				destroyOnClose
			>
				<FormThemMoiBaiViet idLopHocPhan={idLopHocPhan} getData={getData} />
			</Modal>
		</CardAddStatusWrapper>
	);
};
export default CardAddStatus;
