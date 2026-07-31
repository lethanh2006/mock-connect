import { getDiemChuMarks } from '@/utils/diemChuNotation';
import { Tooltip } from 'antd';
import { useIntl } from 'umi';

type Props = {
	diemChu?: string | null;
	isQuyDoi?: boolean;
	soLanHoc?: number | null;
	/** Văn bản thêm sau (T), vd. " - Tích lũy" */
	quyDoiExtra?: string;
};

/** Hiển thị (T)/(R) cạnh điểm chữ theo quy ước Vin */
const DiemChuMarks = ({ diemChu, isQuyDoi, soLanHoc, quyDoiExtra }: Props) => {
	const intl = useIntl();
	const marks = getDiemChuMarks(diemChu, { isQuyDoi, soLanHoc });
	if (!marks.length) return null;

	return (
		<>
			{marks.map((mark) => {
				const title =
					mark === 'T'
						? intl.formatMessage({ id: 'ketquahoctap.ketquahocky.diemquydoi_tooltip' })
						: intl.formatMessage({ id: 'ketquahoctap.ketquahocky.hoclai_tooltip' });
				const label = mark === 'T' && quyDoiExtra ? `(${mark}${quyDoiExtra})` : `(${mark})`;
				return (
					<Tooltip key={mark} title={title}>
						{' '}
						{label}
					</Tooltip>
				);
			})}
		</>
	);
};

export default DiemChuMarks;
