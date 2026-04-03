import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const DragAwards = ({
	data = [],
	edit,
	onChangeOrder,
}: {
	data: any[];
	edit: boolean;
	onChangeOrder: (ids: string[]) => void;
}) => {
	const [list, setList] = useState<any[]>(data);

	useEffect(() => {
		setList(data);
	}, [data]);

	useEffect(() => {
		if (!edit) {
			setList(data);
		}
	}, [edit, data]);

	const handleDrag = (from: number, to: number) => {
		if (from === to) return;

		const updated = [...list];
		const item = updated.splice(from, 1)[0];
		updated.splice(to, 0, item);

		setList(updated);
		onChangeOrder(updated.map((i) => i._id));
	};

	const displayData = edit ? list : list?.slice(0, 5);

	return (
		<ul className='award-list'>
			{displayData?.map((item, index) => (
				<li
					key={item._id}
					draggable={edit}
					onDragStart={(e) => {
						e.dataTransfer.setData('from', String(index));
					}}
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => {
						const from = Number(e.dataTransfer.getData('from'));
						handleDrag(from, index);
					}}
					className={edit ? `award-item ${index < 5 ? 'highlight-top' : ''}` : ''}
				>
					<strong>
						{item?.competition} - {item?.rank} ({dayjs(item?.dateOfAchievement).format('DD/MM/YYYY')})
					</strong>

					<p>
						<i>{item?.description}</i>
					</p>
				</li>
			))}
		</ul>
	);
};

export default DragAwards;
