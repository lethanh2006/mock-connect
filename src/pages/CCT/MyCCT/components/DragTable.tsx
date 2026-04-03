import { Empty } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface Props {
	item?: {
		attributeId?: string;
		activitiesOutCome?: MyCCT.IActivityOutComeMyCCT[];
	};
	edit?: boolean;
	onChangeOrder?: (attributeId: string, ids: string[]) => void;
}

const DragTable: React.FC<Props> = ({ item, edit, onChangeOrder }) => {
	const [data, setData] = useState<MyCCT.IActivityOutComeMyCCT[]>([]);
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);

	useEffect(() => {
		if (!edit) {
			setData(item?.activitiesOutCome || []);
		}
	}, [edit, item?.activitiesOutCome]);

	const moveRow = (from: number, to: number) => {
		if (from === to) return;

		const newData = [...data];
		const movedItem = newData.splice(from, 1)[0];
		newData.splice(to, 0, movedItem);

		setData(newData);

		onChangeOrder?.(
			item?.attributeId!,
			newData.map((i) => i.id),
		);
	};

	const handleDrop = (index: number) => {
		if (dragIndex === null) return;

		moveRow(dragIndex, index);
		setDragIndex(null);
		setHoverIndex(null);
	};

	const displayData = edit ? data : data?.slice(0, 5);

	return (
		<table className='content-table'>
			<colgroup>
				<col style={{ width: '18%' }} />
				<col style={{ width: '14%' }} />
				<col style={{ width: '14%' }} />
				<col style={{ width: '14%' }} />
				<col style={{ width: '18%' }} />
				<col style={{ width: '24%' }} />
			</colgroup>

			<thead>
				<tr>
					<th>Activity</th>
					<th>Duration</th>
					<th>Level of Engagement</th>
					<th>Role</th>
					<th>Organizer</th>
					<th>Impact</th>
				</tr>
			</thead>

			<tbody>
				{displayData?.length ? (
					displayData.map((i, index) => (
						<tr
							key={i.id}
							draggable={!!edit}
							onDragStart={(e) => {
								e.dataTransfer.setData('text/plain', '');
								e.dataTransfer.effectAllowed = 'move';
								setDragIndex(index);
							}}
							onDragOver={(e) => {
								e.preventDefault();
								setHoverIndex(index);
							}}
							onDrop={() => handleDrop(index)}
							onDragEnd={() => {
								setDragIndex(null);
								setHoverIndex(null);
							}}
							style={{
								cursor: edit ? 'grab' : 'default',
								opacity: dragIndex === index ? 0.4 : 1,
								background:
									edit && index < 5 ? '#fffbe6' : hoverIndex === index && dragIndex !== index ? '#f5f5f5' : undefined,
								borderTop: hoverIndex === index && dragIndex !== index ? '2px solid #1890ff' : undefined,
								transition: 'all 0.15s ease',
							}}
						>
							<td>{i?.activity}</td>

							<td>
								{(() => {
									const start = dayjs(i?.startDate).utc();
									const end = dayjs(i?.endDate).utc();

									const isSameMonth = start.isSame(end, 'month') && start.isSame(end, 'year');

									if (isSameMonth) {
										return start.format('MMM YYYY');
									}

									return `${start.format('MMM')} - ${end.format('MMM YYYY')}`;
								})()}
							</td>

							<td>{i?.level}</td>
							<td>{i?.role}</td>
							<td>{i?.organizationUnit}</td>
							<td>{i?.impact}</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={6} style={{ textAlign: 'center' }}>
							<Empty description='Empty' image={Empty.PRESENTED_IMAGE_SIMPLE} />
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default DragTable;
