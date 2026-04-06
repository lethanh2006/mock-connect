import React from 'react';
import './style.less';

interface CompetencyProps {
	num: number;
	title: string;
	cardClass: 'card-leader' | 'card-impact' | 'card-contributor';
	eventName: string;
	date: string;
	role: string;
	activity: string;
	competency: string;
	outcome: string;
}

const CompetencyBlock: React.FC<CompetencyProps> = ({
	num,
	title,
	cardClass,
	eventName,
	date,
	role,
	activity,
	competency,
	outcome,
}) => (
	<div className='comp-block'>
		<div className='comp-header'>
			<div className='comp-num'>{num}</div>
			<div className='comp-title'>{title}</div>
		</div>
		<div className={`event-card ${cardClass}`}>
			<div className='event-top'>
				<span className='event-name'>{eventName}</span>
				<span className='event-date'>{date}</span>
			</div>
			<div className='detail-row'>
				<span className='lbl'>Competency:</span>
				<span className='val'>{competency}</span>
			</div>
			<div className='detail-row'>
				<span className='lbl'>Role:</span>
				<span className='val'>{role}</span>
			</div>
			<div className='detail-row'>
				<span className='lbl'>Level:</span>
				<span className='val'>{activity}</span>
			</div>
			<div className='detail-row'>
				<span className='lbl'>Track:</span>
				<span className='val'>{outcome}</span>
			</div>
		</div>
	</div>
);

const MyCCTV2: React.FC = () => {
	return (
		<div className='core-x-portfolio'>
			<div className='page'>
				<div className='top-container'>
					<div className='header-left'>
						<div className='title-box'>
							<div className='main-title'>Co-Curricular & Competency Portfolio</div>
						</div>

						<div className='aspiration-box'>
							<div className='asp-label'>Self - Aspiration</div>
							<div className='asp-content'>
								"An emerging research-ready learner who demonstrated rigor, independence, and evidence-based thinking
								through applied research experiences."
							</div>
							<div className='asp-values'>
								<span>INTELLECT</span> &bull; <span>WISDOM</span> &bull; <span>BRAVERY</span>
							</div>
						</div>
					</div>

					<div className='avatar-box'>
						<img
							src='https://media-cdn-v2.laodong.vn/storage/newsportal/2025/8/26/1563963/7.jpg'
							alt='Student'
							className='student-img'
						/>
						<div className='student-name'>Student Lexce</div>
						<div style={{ fontSize: '9px' }}>ID: V20242345</div>
					</div>
				</div>

				<div className='body-grid'>
					<div className='comp-list'>
						<CompetencyBlock
							num={1}
							title='Empathy'
							cardClass='card-leader'
							eventName='VINUNI GIVING DAY'
							date='01.10.2024'
							role='Participant'
							activity='Charity trip for the students in Hung Yen, Ha Noi.'
							competency='Community Engagement, Design Thinking.'
							outcome='500+ support packages distributed, Champion of Change Award Q1/2025.'
						/>

						<CompetencyBlock
							num={2}
							title='Exceptional Capability'
							cardClass='card-impact'
							eventName='NATIONAL MATHEMATIC OLYMPIADS'
							date='01.03.2025'
							role='Participant'
							activity='Represent VinUni to participate in National Mathematical Olympiad.'
							competency='Problem solving, critical thinking.'
							outcome='Gold medal in Calculus.'
						/>

						<CompetencyBlock
							num={3}
							title='Creativity'
							cardClass='card-contributor'
							eventName='VIETNAM INTERNATIONAL CHOIR 2025'
							date='Oct - Dec 2025'
							role='Tenor'
							activity='Join VinUni team to participate as singer in the competition.'
							competency='Organization & Self-management.'
							outcome='Golden Diploma - Level 1.'
						/>

						<CompetencyBlock
							num={4}
							title='Entrepreneurial Mindset'
							cardClass='card-leader'
							eventName='SMART AQUA (START-UP)'
							date='Oct 2026 - May 2027'
							role='Technical Researcher & Developer'
							activity="Develop and implement ML model to predict water's quality."
							competency='Technical application.'
							outcome='Finalist of Global Entreprep Incubator 2027.'
						/>

						<CompetencyBlock
							num={5}
							title='Leadership Spirit'
							cardClass='card-leader'
							eventName='VINPIONEERS'
							date='Oct 2026 - May 2027'
							role='President'
							activity='Organize and lead the largest math club at VinUni.'
							competency='Team Leadership.'
							outcome='The best academic club of VinUni AY2026-2027.'
						/>
					</div>

					<div className='sidebar'>
						<div className='sig-circle'>
							<div className='sig-font'>Empathy</div>
							<div className='sig-sub'>Featured</div>
						</div>
						<div style={{ fontSize: '9px', color: '#999', marginTop: '10px', textAlign: 'center' }}>
							Count #1024
							<br />
							Verified
						</div>
					</div>
				</div>

				<div className='tracks-area'>
					{[
						{ label: 'Innovator', pos: 'p-20' },
						{ label: 'Entrepreneur', pos: 'p-40' },
						{ label: 'Intrapreneur', pos: 'p-80' },
					].map((track) => (
						<div className='track-row' key={track.label}>
							<div className='track-label'>{track.label}</div>
							<div className='track-bar-container'>
								<div className='tick p-0'>
									<span>0%</span>
								</div>
								<div className='tick p-20'>
									<span>20%</span>
								</div>
								<div className='tick p-40'>
									<span>40%</span>
								</div>
								<div className='tick p-80'>
									<span>80%</span>
								</div>
								<div className='tick p-100'>
									<span>100%</span>
								</div>
								<div className={`marker ${track.pos}`}></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MyCCTV2;
