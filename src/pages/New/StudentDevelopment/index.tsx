import studentdevelopment from '@/assets/trangchu/StudentDevelopment.svg';
import PageCard from '@/components/PageCard';
import './style.less';

const CARDS = [
	{
		tag: 'Entry Profile',
		tone: 'blue',
		title: 'A.A.C.C',
		description: 'Outstanding Ability, Aspiration, Creativity, Commitment. Your starting identity and direction.',
	},
	{
		tag: 'Graduate Attributes',
		tone: 'red',
		title: 'E.X.C.E.L',
		description: 'Empathy, eXceptional Ability, Creativity, Entrepreneurial Spirit, Leadership Mindset.',
	},
	{
		tag: 'Graduate Identity',
		tone: 'orange',
		title: 'T.S.L',
		description: 'Big Thinker, Problem Solver, Adaptive Learner — your enduring qualities.',
	},
] as const;

const StudentDevelopment = () => {
	return (
		<PageCard className='student-development' stickyHeader title='Student Development Framework'>
			<div className='student-development__body'>
				<section className='student-development__intro'>
					<p>
						The VinUni Student Development framework is a layered model of holistic student development from entry to
						graduation.
						<br />
						At its foundation are the <span className='student-development__accent'>A.A.C.C</span> attributes -{' '}
						<span className='student-development__accent'>
							Outstanding Ability, Aspiration, Creativity, and Commitment
						</span>{' '}
						- built upon through the <span className='student-development__accent'>E.X.C.E.L</span> framework:{' '}
						<span className='student-development__accent'>
							Empathy, eXceptional Ability, Creativity, Entrepreneurial Spirit, and Leadership Mindset.
						</span>{' '}
						These competencies are developed through academic, co-curricular, and experiential learning, enabling
						students to create real-world impact.
					</p>
					<p>
						Aligned with VinUni’s talent development philosophy, the Co-curricular and Competency Transcript captures
						students’ readiness across three pathways:{' '}
						<span className='student-development__accent'>Innovators, Entrepreneurs, and Intrapreneurs.</span>
						<br />
						Throughout this journey, students embody three enduring qualities:{' '}
						<span className='student-development__accent'>Big Thinker, Problem Solver, and Adaptive Learner.</span>
					</p>
				</section>

				<div className='student-development__diagram'>
					<img src={studentdevelopment} alt='Student Development Framework' />
				</div>

				<div className='student-development__cards'>
					{CARDS.map((card) => (
						<article key={card.title} className='student-development__card'>
							<div className='student-development__card-body'>
								<div className='student-development__card-head'>
									<span className={`student-development__tag student-development__tag--${card.tone}`}>{card.tag}</span>
									<h2 className='student-development__card-title'>{card.title}</h2>
								</div>
								<p className='student-development__card-desc'>{card.description}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</PageCard>
	);
};

export default StudentDevelopment;
