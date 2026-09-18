import backgroundImage from '@/assets/cct/background.png';
import studentdevelopment from '@/assets/trangchu/StudentDevelopment.svg';
import PageCard from '@/components/PageCard';
import { Col, Row } from '@/components/MyGrid';
import './style.less';

const StudentDevelopment = () => {
	return (
		<PageCard title='Student Development Framework'>
			<div className='student-development-wrapper'>
				<div className='framework-bg-overlay' style={{ backgroundImage: `url(${backgroundImage})` }}></div>

				<div className='framework-content'>
					<Row gutter={[0, 20]}>
						<Col span={24}>
							<div className='framework-intro'>
								<p>
									The VinUni Student Development framework is a layered model of holistic student development from entry
									to graduation.
								</p>
								<p>
									At its foundation are the <span className='hl-blue'>A.A.C.C</span> attributes—
									<span className='hl-bold'>Outstanding Ability, Aspiration, Creativity, and Commitment</span>
									—built upon through the <span className='hl-blue'>E.X.C.E.L</span> framework:
									<span className='hl-bold'>
										{' '}
										Empathy, eXceptional Ability, Creativity, Entrepreneurial Spirit, and Leadership Mindset.
									</span>{' '}
									These competencies are developed through academic, co-curricular, and experiential learning, enabling
									students to create real-world impact.
								</p>
								<p>
									Aligned with VinUni’s talent development philosophy, the Co-curricular and Competency Transcript
									captures students’ readiness across three pathways:
									<span className='hl-bold'> Innovators, Entrepreneurs, and Intrapreneurs.</span>
								</p>
								<p>
									Throughout this journey, students embody three enduring qualities:
									<span className='hl-bold'> Big Thinker, Problem Solver, and Adaptive Learner.</span>
								</p>
							</div>
						</Col>

						<Col span={24}>
							<Row gutter={[32, 32]} align='middle'>
								<Col xs={24} md={15}>
									<div className='framework-cards-group'>
										<div className='custom-card'>
											<h3 className='card-title'>A.A.C.C – Entry Profile</h3>
											<p className='card-desc'>
												Outstanding Ability, Aspiration, Creativity, Commitment. Your starting identity and direction.
											</p>
										</div>
										<div className='custom-card'>
											<h3 className='card-title'>E.X.C.E.L – Graduate Attributes</h3>
											<p className='card-desc'>
												Empathy, eXceptional Ability, Creativity, Entrepreneurial Spirit, Leadership Mindset.
											</p>
										</div>
										<div className='custom-card'>
											<h3 className='card-title'>T.S.L – Graduate Identity</h3>
											<p className='card-desc'>
												Big Thinker, Problem Solver, Adaptive Learner — your enduring qualities.
											</p>
										</div>
									</div>
								</Col>
								<Col xs={24} md={9} className='img-col'>
									<img src={studentdevelopment} alt='Student Development Framework' className='framework-svg' />
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</div>
		</PageCard>
	);
};

export default StudentDevelopment;
