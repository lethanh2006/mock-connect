import { getMyAdvisor } from '@/services/AdvisorChange';
import { EAdvisorType } from '@/services/AdvisorChange/constant';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import IdpExportTemplate from './IdpExportTemplate';
import IdpForm from './IdpForm';

type IdpModalContentProps = {
	onSuccess?: () => void;
};

const IdpModalContent: React.FC<IdpModalContentProps> = ({ onSuccess }) => {
	const { record, isView } = useModel('idp.idp');
	const { record: sinhVien } = useModel('sinhvien.sinhvien');
	const [facultyAdvisorName, setFacultyAdvisorName] = useState<string>();

	useEffect(() => {
		getMyAdvisor({ type: EAdvisorType.FACULTY_ADVISOR })
			.then((res) => setFacultyAdvisorName(res?.data?.data?.advisorName))
			.catch(() => setFacultyAdvisorName(undefined));
	}, []);

	// Xem chi tiết dùng đúng bố cục bản PDF (IdpExportTemplate) thay cho bảng review cũ.
	// Tiêu đề modal do TableBase (modalTitle) dựng như mọi modal khác. Template rộng cố định 794px
	// (khổ A4) nên bù lại padding ngang/dưới của .ant-modal-body để nó khít mép.
	if (isView)
		return record ? (
			<div style={{ overflowX: 'auto', margin: '-16px -16px' }}>
				<IdpExportTemplate
					content={record.content}
					studentName={sinhVien?.ten}
					studentCode={sinhVien?.ma}
					program={sinhVien?.nganh?.ten}
					facultyAdvisorName={facultyAdvisorName}
				/>
			</div>
		) : null;

	return <IdpForm onSuccess={onSuccess} facultyAdvisorName={facultyAdvisorName} />;
};

export default IdpModalContent;
