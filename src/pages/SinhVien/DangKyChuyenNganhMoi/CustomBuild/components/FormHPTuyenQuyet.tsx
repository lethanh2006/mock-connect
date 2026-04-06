import { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import rules from '@/utils/rules';
import { Button, Col, Form, Row } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectHocPhanTienQuyet from './Select/SelectHocPhanTienQuyet';

const FormHPTuyenQuyet = (props: {
	onOk: (val: PhieuDkCtdt.HocPhanDkCtdt[]) => void;
	onCancel?: () => void;
	maHocPhanChinh?: string;
}) => {
	const [form] = Form.useForm();
	const { onOk, onCancel, maHocPhanChinh } = props;
	const intl = useIntl();
	const { dsKhoiHocPhanTienQuyet } = useModel('daotao.chuongtrinhdaotao');

	const onFinish = async (values: any) => {
		const listMa: string[] = values.hocPhan || [];
		const mapHocPhan = (ma?: string) => {
			let found: any = null;
			dsKhoiHocPhanTienQuyet.forEach((item: ChuongTrinhDaoTao.IKhoiHpCt) => {
				const child = item.dsHocPhanTienQuyet?.find((c: any) => c.ma === ma);
				if (child) found = child;
			});
			return found;
		};

		const result: PhieuDkCtdt.HocPhanDkCtdt[] = listMa
			.map((ma: string) => {
				const hp = mapHocPhan(ma);
				if (!hp || !hp.ten || hp.soTinChi === undefined || !hp.trangThaiKqht) {
					return null;
				}
				return {
					ma,
					ten: hp.ten,
					soTinChi: hp.soTinChi,
					trangThaiKqht: hp.trangThaiKqht,
				};
			})
			.filter((item): item is PhieuDkCtdt.HocPhanDkCtdt => item !== null);
		form.resetFields();
		onOk(result);
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[8, 0]}>
				<Col span={24}>
					<Form.Item
						name='hocPhan'
						label={intl.formatMessage({ id: 'minor.idm.form.prerequisiteCourse' })}
						rules={[...rules.required]}
					>
						<SelectHocPhanTienQuyet maHocPhan={maHocPhanChinh} allowClear multiple />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'minor.idm.button.addPrerequisite' })}
				</Button>
				<Button
					onClick={() => {
						form.resetFields();
						onCancel?.();
					}}
				>
					{intl.formatMessage({ id: 'minor.button.cancel' })}
				</Button>
			</div>
		</Form>
	);
};

export default FormHPTuyenQuyet;
