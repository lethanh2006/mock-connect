import { Spin } from 'antd'; // Import thêm Button
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

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
	attributesId?: string;
	rolesId?: string;
	activitiesTypeId?: string;
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
		if (lower.includes('explorer') || lower.includes('level 1')) return 0.3;

		return 0.3;
	},

	formatDate: (isoString: string): string => {
		if (!isoString) return '';
		try {
			const d = new Date(isoString);
			return d.toLocaleDateString('en-GB');
		} catch {
			return isoString;
		}
	},

	toTitleCase: (str: string) => {
		return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
	},

	shortLevelName: (name: string) => {
		if (name.includes('-')) {
			return name.split('-')[1].trim().toUpperCase();
		}
		return name.toUpperCase();
	},

	getStarCount: (countObj: Record<string, number>, keyword: string): number => {
		const key = Object.keys(countObj).find((k) => k.toLowerCase().includes(keyword.toLowerCase()));
		return key ? countObj[key] : 0;
	},
};

const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Great+Vibes&display=swap');

  .transcript-scope,
  .transcript-scope * {
    font-family: 'Montserrat', sans-serif !important;
  }

  .transcript-scope .script-title {
    font-family: 'Great Vibes', cursive !important;
  }

  /* --- NEW: Page Wrapper & Background --- */
  .page-wrapper {
    min-height: 100vh;
    width: 100%;
    /* Sử dụng gradient để mô phỏng nền xanh đậm trong thiết kế */
    background: linear-gradient(135deg, #1a3b5d 0%, #24507b 100%);
    padding-bottom: 40px;
    font-family: 'Montserrat', sans-serif;
  }

  /* --- NEW: Header Section --- */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 40px;
    max-width: 1200px;
    margin: 0 auto;
    color: #fff;
  }

  .header-title {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  .header-actions {
    display: flex;
    gap: 16px;
  }

  /* Custom styles cho nút Antd để khớp thiết kế */
  .custom-btn-edit {
    background-color: #fff !important;
    color: #1a3b5d !important;
    border: none !important;
    font-weight: 700 !important;
    height: 44px !important;
    padding: 0 32px !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  .custom-btn-goal {
    background-color: #d32f2f !important; /* Màu đỏ đậm */
    color: #fff !important;
    border: none !important;
    font-weight: 700 !important;
    height: 44px !important;
    padding: 0 32px !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  }
  .custom-btn-goal:hover {
      background-color: #b71c1c !important;
  }

  /* --- EXISTING: Transcript Container (Updated) --- */
  .transcript-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 1100px; /* Tăng chiều rộng một chút */
    margin: 10px auto 0; /* Căn giữa và tạo khoảng cách với header */
    padding: 40px;
    background-color: #fdfdfd; /* Nền trắng sáng bên trong */
    border-radius: 16px; /* Bo góc cho container chính */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  /* --- EXISTING: Card Styles (Giữ nguyên) --- */
  .transcript-card {
    background: #fff;
    border: 2px solid var(--theme-color);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
  }

  .transcript-card:hover {
    transform: translateY(-3px);
  }

  .card-header {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-content {
    display: flex;
    gap: 24px;
    flex: 1;
  }

  .icon-wrapper {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .info-block {
    flex: 1;
    max-width: 70%;
  }

  .description {
    font-size: 14px;
    color: var(--theme-color);
    font-weight: 600;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .rating-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }

  .rating-row {
    display: flex;
    align-items: center;
  }

  .rating-label {
    width: 110px;
  }

  .stars {
    color: #f59e0b;
    letter-spacing: 2px;
    font-size: 14px;
    margin-left: 4px;
  }

  .script-title {
    font-family: 'Great Vibes', cursive;
    font-size: 42px;
    color: var(--theme-color);
    white-space: nowrap;
    margin-top: 5px;
    margin-right: 10px;
    text-align: right;
    line-height: 1;
  }

  /* --- TABLE --- */
  .table-container {
    width: 100%;
    border-top: 1px solid #eee;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    color: #333;
  }

  thead {
    background-color: var(--theme-color);
    color: #fff;
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 12px;
  }

  tbody tr {
    border-bottom: 1px solid #f0f0f0;
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  td {
    padding: 12px 16px;
    vertical-align: middle;
  }

  td.level-col {
    padding: 0;
    width: 160px;
    border-bottom: 1px solid #fff;
  }

  .level-badge {
    width: 100%;
    height: 100%;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    background-color: var(--level-bg);
  }

  .empty-state {
    padding: 32px;
    text-align: center;
    color: #94a3b8;
    font-style: italic;
  }
`;

const StarRating: React.FC<{ count: number }> = ({ count }) => {
	return <span className='stars'>{'★'.repeat(count)}</span>;
};

const TranscriptReport: React.FC<any> = () => {
	const { getAllModel, loading } = useModel('cct.activityoutcome');
	const { getAllModel: getAllLevel, danhSach: dsLevels } = useModel('cct.levels');
	const [danhSach, setDanhSach] = useState<any>();

	useEffect(() => {
		getAllLevel(undefined, { order: 1 });
		getAllModel(undefined, undefined, undefined, undefined, 'my-cct', false).then((res) => setDanhSach(res));
	}, []);

	return (
		<Spin spinning={loading}>
			<style>{cssStyles}</style>

			<div className='transcript-scope'>
				{/* Wrapper bao ngoài để tạo nền */}
				<div className='page-wrapper'>
					{/* Header mới */}
					<div className='page-header'>
						<div className='header-title'>Co-Curricular Transcript</div>
					</div>

					{/* Container chính chứa danh sách cards */}
					<div className='transcript-container'>
						{danhSach?.map((item: any) => {
							const { attribute, countLevel, activitiesOutCome, listCompetencies } = item;
							const themeColor = attribute.color || '#333';

							const cardStyle = { '--theme-color': themeColor } as React.CSSProperties;

							return (
								<div key={attribute._id} className='transcript-card' style={cardStyle}>
									<div className='card-header'>
										<div className='header-content'>
											<div className='icon-wrapper'>
												<img
													src={attribute.icon}
													alt={attribute.name}
													onError={(e) => (e.currentTarget.style.display = 'none')}
												/>
											</div>
											<div className='info-block'>
												<div className='description'>{attribute.description}</div>
												<div style={{ display: 'flex', gap: 120 }}>
													<div className='rating-list'>
														{dsLevels?.map((item) => (
															<div className='rating-row'>
																<span className='rating-label'>{item?.name}:</span>
																<StarRating count={Utils.getStarCount(countLevel, item?.name)} />
															</div>
														))}
													</div>

													<div
														className='rating-list'
														style={{
															color: attribute.color,
															fontWeight: 800,
														}}
													>
														<span className='rating-label'>Skill acquierd:</span>
														{listCompetencies?.map((item: any, idx: number) => (
															<div key={idx} className='rating-label'>
																• {item}
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
										<div className='script-title'>{Utils.toTitleCase(attribute.name)}</div>
									</div>

									<div className='table-container'>
										{activitiesOutCome && activitiesOutCome.length > 0 ? (
											<table>
												<thead>
													<tr>
														<th style={{ width: '160px' }}></th>
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

														const activityName = act.activitiesName || act.activitiesType?.name || 'Unknown Activity';

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
																<td style={{ fontWeight: 600, color: '#444' }}>{activityName}</td>
																<td style={{ color: '#666' }}>{Utils.formatDate(act.startDate)}</td>
																<td style={{ color: '#666' }}>{Utils.formatDate(act.endDate)}</td>
																<td>{act.roles?.name}</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										) : (
											<div className='empty-state'>No activities recorded for this attribute</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</Spin>
	);
};

export default TranscriptReport;
