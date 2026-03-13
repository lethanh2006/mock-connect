import { Card, Col, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import './style.less';

interface BaseEntity {
	_id: string;
	name: string;
	code?: string;
	order?: number;
	description?: string;
	isActive?: boolean;
}

interface AttributeInfo extends BaseEntity {
	description: string;
	color: string;
	icon: string;
	background: string | null;
}

interface ActivityOutcome {
	startDate: string;
	endDate: string;
	roles: BaseEntity;
	levels: BaseEntity;
	activitiesType?: BaseEntity;
	activitiesName?: string;
}

export interface TranscriptItem {
	attribute: AttributeInfo;
	countLevel: Record<string, number>;
	activitiesOutCome: ActivityOutcome[];
	listCompetencies?: string[];
}

const Utils = {
	hexToRgba: (hex: string, alpha: number): string => {
		let c: any;
		if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			c = hex.substring(1).split('');
			if (c.length === 3) {
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = '0x' + c.join('');
			return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
		}
		return hex;
	},

	getOpacityByLevel: (levelName?: string): number => {
		if (!levelName) return 0.3;
		const lower = levelName.toLowerCase();
		if (lower.includes('change') || lower.includes('level 3')) return 1;
		if (lower.includes('connect') || lower.includes('level 2')) return 0.6;
		return 0.3;
	},

	formatDate: (isoString: string): string => {
		if (!isoString) return '';
		return new Date(isoString).toLocaleDateString('en-GB');
	},

	toTitleCase: (str: string) =>
		str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()),

	shortLevelName: (name: string) => (name.includes('-') ? name.split('-')[1].trim().toUpperCase() : name.toUpperCase()),

	getStarCount: (countObj: Record<string, number>, keyword: string): number => {
		const key = Object.keys(countObj).find((k) => k.toLowerCase().includes(keyword.toLowerCase()));
		return key ? countObj[key] : 0;
	},
};

const StarRating: React.FC<{ count: number }> = ({ count }) => <span className='stars'>{'★'.repeat(count)}</span>;

const TranscriptReport: React.FC<any> = () => {
	const { getAllModel, loading } = useModel('cct.activityoutcome');
	const { getAllModel: getAllLevel, danhSach: dsLevels } = useModel('cct.levels');
	const [danhSach, setDanhSach] = useState<any>();

	useEffect(() => {
		getAllLevel(undefined, { order: 1 }, { isActive: true });
		getAllModel(undefined, undefined, undefined, undefined, 'my-cct', false).then((res) => setDanhSach(res));
	}, []);

	return (
		<Card
			title='Co-Curricular Transcript'
			className='table-base-card'
			variant='borderless'
			styles={{
				body: {
					padding: 0,
				},
			}}
		>
			<Spin spinning={loading}>
				<div className='transcript-scope'>
					<div className='page-wrapper'>
						<Row gutter={[12, 12]}>
							{danhSach?.map((item: any) => {
								const { attribute, countLevel, activitiesOutCome, listCompetencies } = item;
								const themeColor = attribute.color || '#333';

								const cardStyle = { '--theme-color': themeColor } as React.CSSProperties;

								return (
									<Col xs={24} sm={24} md={24} lg={24} xxl={12} key={attribute._id}>
										<div className='transcript-card' style={cardStyle}>
											<div className='card-header'>
												<div className='header-content'>
													<div className='icon-wrapper'>
														<img
															src={attribute.icon}
															alt={attribute.name}
															onError={(e) => (e.currentTarget.style.display = 'none')}
														/>
													</div>
													<div className='header-details'>
														<div className='description'>{attribute.description}</div>
														<Row gutter={[12, 12]}>
															<Col xs={24} md={8}>
																<div className='rating-list'>
																	<span className='rating-title'>Overview:</span>
																	{dsLevels?.map((lv) => (
																		<div key={lv._id} className='rating-row'>
																			<span className='level-name'>{lv.name}</span>
																			<StarRating count={Utils.getStarCount(countLevel, lv.name)} />
																		</div>
																	))}
																</div>
															</Col>

															<Col xs={24} md={5}>
																<div className='rating-list'>
																	<span className='rating-title'>Skill acquired:</span>
																	<div className='skills-list'>
																		{listCompetencies?.map((c: string, i: number) => (
																			<div key={i} className='skill-item'>
																				• {c}
																			</div>
																		))}
																	</div>
																</div>
															</Col>

															<Col xs={24} md={10}>
																<div className='script-title-wrapper'>
																	<div className='script-title'>{Utils.toTitleCase(attribute.name)}</div>
																</div>
															</Col>
														</Row>
													</div>
												</div>
											</div>

											<div className='table-container'>
												{activitiesOutCome && activitiesOutCome.length > 0 ? (
													<div className='table-responsive'>
														<table>
															<thead>
																<tr>
																	<th className='level-header'>Level</th>
																	<th>Activity</th>
																	<th>Start date</th>
																	<th>End date</th>
																	<th>Position</th>
																</tr>
															</thead>
															<tbody>
																{activitiesOutCome.map((act: any, index: number) => {
																	const levelName = Utils.shortLevelName(act.levels?.name || '');
																	const opacity = Utils.getOpacityByLevel(act.levels?.name);
																	const cellColor = Utils.hexToRgba(themeColor, opacity);

																	const activityName =
																		act.activitiesName || act.activitiesType?.name || 'Unknown Activity';

																	return (
																		<tr key={index}>
																			<td className='level-col'>
																				<div
																					className='level-badge'
																					style={{ '--level-bg': cellColor } as React.CSSProperties}
																				>
																					{levelName}
																				</div>
																			</td>
																			<td className='activity-name'>{activityName}</td>
																			<td className='date-cell'>{Utils.formatDate(act.startDate)}</td>
																			<td className='date-cell'>{Utils.formatDate(act.endDate)}</td>
																			<td className='position-cell'>{act.roles?.name}</td>
																		</tr>
																	);
																})}
															</tbody>
														</table>
													</div>
												) : (
													<div className='empty-state'>No activities recorded for this attribute</div>
												)}
											</div>
										</div>
									</Col>
								);
							})}
						</Row>
					</div>
				</div>
			</Spin>
		</Card>
	);
};

export default TranscriptReport;
