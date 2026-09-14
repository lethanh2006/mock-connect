import { IdpStatus } from '@/services/IdpCoVan/constant';
import { Space } from 'antd';
import { useModel } from 'umi';
import IdpExportTemplate from './IdpExportTemplate';
import IdpReviewActions from './IdpReviewActions';

type IdpRecordModalContentProps = {
	onSuccess?: () => void;
};

const IdpRecordModalContent: React.FC<IdpRecordModalContentProps> = ({ onSuccess }) => {
	const { record } = useModel('idp.covanidp');

	if (!record) return null;

	const canReview = record.status === IdpStatus.PENDING;

	return (
		<Space direction='vertical' size={16} style={{ display: 'flex' }}>
			{/* Xem chi tiết dùng đúng bố cục bản PDF (IdpExportTemplate). Template rộng cố định 794px
			    (khổ A4) nên bọc khung scroll ngang + căn giữa trong modal. */}
			<div style={{ overflowX: 'auto', margin: '-16px -16px' }}>
				<div style={{ width: 794, margin: '0 auto' }}>
					<IdpExportTemplate
						content={record.content}
						studentName={record.studentName ?? undefined}
						studentCode={record.studentCode ?? undefined}
						program={record.program ?? undefined}
						advisorName={record.advisorName ?? undefined}
					/>
				</div>
			</div>

			{canReview && (
				<IdpReviewActions id={record._id} studentName={record.studentName ?? undefined} onSuccess={onSuccess} />
			)}
		</Space>
	);
};

export default IdpRecordModalContent;
