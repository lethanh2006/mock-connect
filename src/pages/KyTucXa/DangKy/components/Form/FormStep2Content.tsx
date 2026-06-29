import React from 'react';
import { Checkbox, Form, Typography, Button } from 'antd';
import { useIntl } from 'umi';
import ReactMarkdown from 'react-markdown';

interface FormStep2ContentProps {
	showCheckbox?: boolean; // true = show confirmTerms checkbox (create mode), false = hide (view mode)
	policyText?: string;
}

interface SignaturePadProps {
	value?: string;
	onChange?: (value: string | undefined) => void;
	disabled?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ value, onChange, disabled }) => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = React.useState(false);

	React.useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		
		canvas.width = canvas.offsetWidth || 400;
		canvas.height = canvas.offsetHeight || 150;
		
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 2.5;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		if (value) {
			const img = new Image();
			img.onload = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);
			};
			img.src = value;
		}
	}, [value]);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (disabled) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		let clientX, clientY;

		if ('touches' in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		ctx.beginPath();
		ctx.moveTo(clientX - rect.left, clientY - rect.top);
		setIsDrawing(true);
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawing || disabled) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		let clientX, clientY;

		if ('touches' in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		ctx.lineTo(clientX - rect.left, clientY - rect.top);
		ctx.stroke();
	};

	const stopDrawing = () => {
		if (!isDrawing || disabled) return;
		setIsDrawing(false);
		const canvas = canvasRef.current;
		if (canvas && onChange) {
			onChange(canvas.toDataURL());
		}
	};

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (onChange) {
			onChange(undefined);
		}
	};

	return (
		<div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', padding: '8px', background: '#fafafa' }}>
			<canvas
				ref={canvasRef}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
				style={{
					width: '100%',
					height: '150px',
					background: '#ffffff',
					cursor: disabled ? 'not-allowed' : 'crosshair',
					display: 'block',
					borderRadius: '4px',
					touchAction: 'none',
				}}
			/>
			{!disabled && (
				<div style={{ marginTop: '8px', textAlign: 'right' }}>
					<Button size="small" onClick={clearCanvas}>
						Xoá chữ ký
					</Button>
				</div>
			)}
		</div>
	);
};

const FormStep2Content = ({ showCheckbox = true, policyText }: FormStep2ContentProps) => {
	const intl = useIntl();
	const isHtml = policyText && /<[a-z][\s\S]*>/i.test(policyText);

	return (
		<div className="ktx-step2-wrapper">
			{policyText ? (
				<div className="ktx-register-section">
					<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.commitments' })}</Typography.Title>
					<div className="ktx-register-section__content">
						<div className="ktx-terms-content">
							{isHtml ? (
								<div dangerouslySetInnerHTML={{ __html: policyText }} />
							) : (
								<ReactMarkdown>{policyText}</ReactMarkdown>
							)}
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="ktx-register-section">
						<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.commitments' })}</Typography.Title>
						<div className="ktx-register-section__content">
							<div className="ktx-terms-content">
								<p className="fw-500" style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.desc' })}</p>
								<ol className="ktx-terms-list">
									<li>
										<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.1.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.1.content' })}
									</li>
									<li>
										<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.2.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.2.content' })}
									</li>
									<li>
										<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.3.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.3.content' })}
									</li>
									<li>
										<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.4.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.4.content' })}
									</li>
									<li>
										<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.5.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.5.content' })}
									</li>
									<li>
										<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.6.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.6.content' })}
									</li>
									<li>
										<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.7.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.7.content' })}
									</li>
								</ol>
							</div>
						</div>
					</div>

					<div className="ktx-register-section mt-4">
						<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.step.waiver' })}</Typography.Title>
						<div className="ktx-register-section__content">
							<div className="ktx-terms-content">
								<p className="fw-500" style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.warning' })}</p>
								<ol className="ktx-terms-list">
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.1' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.2' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.3' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.4' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.5' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.6' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.7' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.8' })}</li>
									<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.9' })}</li>
								</ol>
							</div>
						</div>
					</div>
				</>
			)}

			{showCheckbox ? (
				<>
					<div className="ktx-register-section mt-4">
						<Typography.Title level={5} className="ktx-section-title-arrow">
							{intl.formatMessage({ id: 'kytucxa.dangky.form.section.signature' }, { defaultMessage: 'Chữ ký số của sinh viên' })}
						</Typography.Title>
						<div className="ktx-register-section__content">
							<Form.Item
								name="signatureBase64"
								rules={[{ required: true, message: intl.formatMessage({ id: 'kytucxa.dangky.form.msg.signatureRequired' }, { defaultMessage: 'Vui lòng vẽ chữ ký của bạn' }) }]}
							>
								<SignaturePad />
							</Form.Item>
						</div>
					</div>

					<div className="ktx-register-section mt-4">
						<div className="ktx-register-section__content">
							<Form.Item
								name="confirmTerms"
								valuePropName="checked"
								rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error(intl.formatMessage({ id: 'kytucxa.dangky.form.msg.mustAgree' }))) }]}
							>
								<Checkbox className="ktx-confirm-checkbox">
									<span className="ktx-confirm-text">
										{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmText' })}
									</span>
								</Checkbox>
							</Form.Item>
						</div>
					</div>
				</>
			) : (
				<div className="ktx-register-section mt-4">
					<Typography.Title level={5} className="ktx-section-title-arrow">
						{intl.formatMessage({ id: 'kytucxa.dangky.form.section.signature' }, { defaultMessage: 'Chữ ký số của sinh viên' })}
					</Typography.Title>
					<div className="ktx-register-section__content">
						<Form.Item noStyle shouldUpdate={(prev, curr) => prev.signatureUrl !== curr.signatureUrl}>
							{({ getFieldValue }) => {
								const signatureUrl = getFieldValue('signatureUrl');
								return signatureUrl ? (
									<img src={signatureUrl} alt="Signature" style={{ maxHeight: '100px', border: '1px solid #d9d9d9', borderRadius: '4px', padding: '4px', background: '#fff' }} />
								) : (
									<span>Chưa có chữ ký</span>
								);
							}}
						</Form.Item>
					</div>
				</div>
			)}
		</div>
	);
};

export default FormStep2Content;
