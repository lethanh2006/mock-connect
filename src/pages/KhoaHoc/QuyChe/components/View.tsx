const ViewQuyChe = (props: { record: QuyChe.IRecord }) => {
	return (
		<div>
			<div dangerouslySetInnerHTML={{ __html: props.record.moTa }} />
			<div>
				File đính kèm:{' '}
				<a href={props.record.fileDinhKem} target='_blank' rel='noreferrer'>
					Xem tập tin
				</a>
			</div>
		</div>
	);
};

export default ViewQuyChe;
