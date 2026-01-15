import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { Card, Col, message, Row, Select, Spin } from 'antd';
import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLevelsManagement from '../../Levels/Select';

const FormActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();

	const { record, setVisibleForm, isView, formSubmiting, visibleForm, postActivityOutComeModel } =
		useModel('cct.activityoutcome');

	const {
		traLoiBieuMauModel,
		formSubmiting: formSubmiBieuMau,
		getByIdModel,
		loading,
		record: recBieuMau,
		setRecord: setRecBieuMau,
	} = useModel('tienich.bieumau');

	const {
		getByIdModel: getCauTraLoiMe,
		loading: loadingCauTraLoi,
		record: cauTraLoi,
		setRecord: setRecCauTraLoi,
	} = useModel('tienich.cautraloikhaosat');

	const { danhSach: dsLevels } = useModel('cct.levels');

	const [rolesId, setRolesId] = useState<string>();
	const [levelsId, setLevelsId] = useState<string>();

	const selfAssessmentQuestionsId = dsLevels?.find((item) => item?._id === levelsId)?.selfAssessmentQuestionsId;

	useEffect(() => {
		if (!visibleForm) {
			setRolesId(undefined);
			setLevelsId(undefined);
			setRecCauTraLoi({} as BieuMau.ICauTraLoiKhaoSat);
		}

		if (record?.levelsId) {
			setLevelsId(record?.levelsId);
		}

		if (record?.rolesId) {
			setRolesId(record?.rolesId);
		} else {
			setRolesId(record?.activities?.coCurricularActivityEquivalency?.[0]?.rolesId);
		}
	}, [visibleForm, record?._id]);

	useEffect(() => {
		if (record?.answerId) {
			getCauTraLoiMe(record.answerId, true).catch(console.log);
		}
	}, [record?.answerId]);

	useEffect(() => {
		if (selfAssessmentQuestionsId) {
			getByIdModel(selfAssessmentQuestionsId).catch(console.log);
		} else {
			setRecBieuMau({} as BieuMau.Record);
		}
	}, [selfAssessmentQuestionsId]);

	const submitActivityOutcome = async (roleId: string, levelsId: string, answerId: string | null) => {
		const data = {
			rolesId: roleId,
			levelsId: levelsId,
			answerId,
		};

		try {
			await postActivityOutComeModel(
				record?.activitiesId ?? '',
				data,
				getData,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			);
		} catch (err) {
			console.log(err);
		} finally {
			setVisibleForm(false);
		}
	};

	const handleKhaoSat = async (val: BieuMau.TraLoiRecord[]) => {
		if (!rolesId) {
			message.warning(intl.formatMessage({ id: 'activity.registered.role.vali' }));
			return;
		}

		if (!levelsId) {
			message.warning(intl.formatMessage({ id: 'activity.registered.level.vali' }));
			return;
		}

		if (!recBieuMau?._id) {
			await submitActivityOutcome(rolesId, levelsId, null);
			return;
		}

		try {
			const res = await traLoiBieuMauModel(
				{
					idKhaoSat: recBieuMau?._id,
					danhSachTraLoi: val,
				} as any,
				undefined,
				true,
			);

			const answerId = res?.data?._id;
			if (!answerId) return;

			await submitActivityOutcome(rolesId, levelsId, answerId);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Card title={intl.formatMessage({ id: 'activity.registered.title' })}>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<label style={{ display: 'block', marginBottom: 8 }}>
						{intl.formatMessage({ id: 'activity.registered.role' })}
					</label>
					<Select
						placeholder={intl.formatMessage({ id: 'activity.registered.role.select' })}
						disabled={isView}
						value={rolesId}
						onChange={setRolesId}
						style={{ width: '100%' }}
						options={uniqBy(record?.activities?.coCurricularActivityEquivalency ?? [], 'rolesId').map((item) => ({
							value: item?.rolesId,
							label: item?.roles?.name,
						}))}
						allowClear
					/>
				</Col>
				<Col span={24}>
					<label style={{ display: 'block', marginBottom: 8 }}>
						{intl.formatMessage({ id: 'activity.registered.level' })}
					</label>
					<SelectLevelsManagement
						allowClear
						disabled={isView}
						value={levelsId}
						onChange={(val) => setLevelsId(val as string)}
						style={{ width: '100%' }}
					/>
				</Col>

				<Col span={24}>
					<Spin spinning={loading || loadingCauTraLoi}>
						<FormTraLoiKhaoSat
							onOk={handleKhaoSat}
							cauTraLoi={cauTraLoi?.danhSachTraLoi ?? []}
							hideCard
							disabledForm={isView ? true : false}
							formSubmiting={formSubmiBieuMau || formSubmiting}
							onCancel={() => setVisibleForm(false)}
							recBieuMauProps={recBieuMau}
						/>
					</Spin>
				</Col>
			</Row>
		</Card>
	);
};

export default FormActivityOutCome;
