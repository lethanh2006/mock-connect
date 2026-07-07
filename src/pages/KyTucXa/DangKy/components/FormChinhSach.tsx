import { Checkbox, Col, Divider, Form, FormInstance, Row } from 'antd';

const FormChinhSachKTX = (props: { form: FormInstance }) => {
	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					VinUniversity's Commitments to Residents
				</Divider>
			</Col>
			<Col span={24}>
				<div>In return for the resident's compliance with this Agreement, VinUniversity commits to:</div>
				<div>
					<b>1. Safe living environment:</b> Provide a clean, safe, and well-maintained dormitory environment that
					supports residents' academic life and well-being.
				</div>
				<div>
					<b>2. Facility maintenance:</b> Maintain dormitory infrastructure, utilities (electricity, water, internet),
					common areas, and safety systems (fire prevention, CCTV, access control) in accordance with applicable
					regulations and University standards.
				</div>
				<div>
					<b>3. Residential support:</b> Make Residential Office staff available during published hours to receive
					requests, address maintenance issues, and respond to residents' concerns in a timely manner.
				</div>
				<div>
					<b>4. Emergency response:</b> In the event of an emergency, coordinate with appropriate medical, fire, or
					security services and promptly notify the resident's designated emergency contact(s).
				</div>
				<div>
					<b>5. Data protection:</b> Protect residents' personal information in accordance with VinUniversity's Data
					Privacy Policy, and use such information solely for legitimate dormitory management and safety purposes.
				</div>
				<div>
					<b>6. Transparent communication:</b> Provide clear, advance notice of any material changes to dormitory
					policies, fees, scheduled maintenance, or operational matters that may affect residents.
				</div>
				<div>
					<b>7. Fair dispute resolution:</b> Handle complaints, disciplinary matters, and disputes through a fair and
					consistent process, in accordance with the Student Code of Conduct and applicable University procedures.
				</div>
			</Col>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					Student Liability Release and Waiver
				</Divider>
			</Col>
			<Col span={24}>
				<div>
					THIS IS A LEGAL AGREEMENT AND INCLUDES A RELEASE OF LEGAL RIGHTS. READ AND BE CERTAIN YOU UNDERSTAND IT BEFORE
					SIGNING.
				</div>
				<div>
					1. I, the undersigned, acknowledge and understand that I’m fully responsible for my own living at
					VinUniversity and for my safety, health & well-being while living, studying and playing on and off campus.
				</div>
				<div>
					2. I further acknowledge and understand the dangers, hazards, and risks that may arise from engaging in
					activities, such as playing sports, supporting events or joining club program activities... These dangers,
					hazards, and risks can result in injury and impairment to my body, general health, well-being, and could
					include serious or even fatal injuries.
				</div>
				<div>
					3. Knowing the dangers, hazards, and risks of those activities and in consideration of being permitted to
					participate in activities, on behalf of myself, my guardians, and personal representative(s) (the
					“Releasers”), I agree to assume all the risks and responsibilities surrounding my participation. On behalf of
					myself and the Releasers I hereby covenant not to sue VinUniversity, or its trustees, officers,
					representatives, and employees (“Releasees”), and I hereby release, waive, forever discharge the Releasees
					from and against any and all liability for any harm, injury, damage, claims, demands, actions, causes of
					action, costs, and expenses of any nature that I may have or that may hereafter accused by me or a Releaser,
					arising out of, or related to, those activities. I further agree to indemnify and hold harmless the Releasees
					from and against any loss, liability, damage or cost, including court costs and attorneys’ fees that may arise
					due to my participation in activities. It is my expressed intent that this Liability Release and Waiver shall
					bind me, my Releasers, and shall be deemed as a legally binding release, waiver, discharge and covenant not to
					sue the Releasees.
				</div>
				<div>4. I also grant VinUniversity the right to use my photograph for its publications to the public.</div>
				<div>
					5. I agree to conduct myself in accordance with the rules of conduct and standards of behavior and attitude
					that are expected of me as a student of the VinUniversity and to abide by the various instructions, guidance
					and policy I am given by Student Affairs Office, Residential Office, or University members.
				</div>
				<div>
					6. I understand, agree, and hereby grant Releasees permission to authorize emergency medical treatment for me
					and contact my emergency contact below. I acknowledge that Releasees is not liable for any severe health
					complications or outcomes that may arise during my study if caused by my own health condition or fault. This
					includes but is not limited to costs associated with medical treatment, hospitalization, or other
					health-related services beyond what is offered on campus.
				</div>
				<div>
					7. I pledge to abide by all laws of the nations I am a citizen of, as well as the laws of any country I visit
					during my time as a student at VinUniversity.
				</div>
				<div>
					8. I commit to taking full responsibility for the care of my personal belongings and will not hold
					VinUniversity responsible for any loss or damage.
				</div>
				<div>
					9. I agree to provide VinUniversity with my personal information and allow VinUniversity to process it in
					accordance with VinUniversity’s personal data protection policy.
				</div>
			</Col>

			<Col span={24}>
				<Form.Item name='checkbox2' valuePropName='checked'>
					<Checkbox>
						<div className='text-info'>
							I understand and confirm that this Dormitory application is subject to room availability and that VinUni
							reserves the right to assign any other type of Dormitory available. I declare that I have read and agreed
							with the terms and conditions above and the information provided by me in this application is true and
							complete.
						</div>
					</Checkbox>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormChinhSachKTX;
