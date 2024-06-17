const KeHoachHeader = (props: { header?: KeHoachNamHoc.TGridHeader }) => {
	const { header } = props;

	return (
		<div className='title-row'>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Học kỳ</div>
				{/* Thêm 1 tuần '0' */}
				<div className='cell title-cell' style={{ width: 36 }} />
				{header?.hocKys?.map((item) => (
					<div
						className={`cell title-cell border-right ${item.isBreak ? 'break' : ''}`}
						key={item.title}
						style={{ width: 36 * item.span + item.span - 1 }}
					>
						{item.isBreak ? '' : item.title}
					</div>
				))}
			</div>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Tháng</div>
				<div className='cell title-cell' style={{ width: 36 }} />
				{header?.months.map((item) => (
					<div
						className='cell title-cell border-right'
						key={item.title}
						style={{ width: 36 * item.span + item.span - 1 }}
					>
						{item.title}
					</div>
				))}
			</div>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Tuần</div>
				<div className='cell title-cell' style={{ width: 36 }} />
				{header?.weeks.map((tuan, index) => (
					<div className={`cell title-cell ${header?.days?.[index]?.isBreak ? 'break' : ''}`} key={tuan}>
						{tuan}
					</div>
				))}
			</div>
			<div className='row-ke-hoach'>
				<div className='cell title-cell first-cell'>Ngày</div>
				<div className='cell title-cell' style={{ width: 36 }} />
				{header?.days.map((item, index) => (
					<div className={`cell title-cell ${header?.days?.[index]?.isBreak ? 'break' : ''}`} key={item.span}>
						{item.title}
					</div>
				))}
			</div>
		</div>
	);
};

export default KeHoachHeader;
