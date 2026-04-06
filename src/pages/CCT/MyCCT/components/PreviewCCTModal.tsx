import { Checkbox, Modal } from 'antd';
import React, { forwardRef, useState } from 'react';

interface Props {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	children: React.ReactNode;
}

const PreviewCCTModal = forwardRef<HTMLDivElement, Props>(({ open, onCancel, onConfirm, children }, ref) => {
	const [confirmed, setConfirmed] = useState(false);

	return (
		<Modal
			open={open}
			onCancel={() => {
				setConfirmed(false);
				onCancel();
			}}
			onOk={onConfirm}
			okText='Submit'
			cancelText='Close'
			okButtonProps={{ disabled: !confirmed }}
			width={1300}
			destroyOnClose
		>
			<div style={{ maxHeight: '70vh', overflow: 'auto' }}>
				<div className='cct-container' ref={ref}>
					{children}
				</div>
			</div>

			<div style={{ marginTop: 16 }}>
				<Checkbox onChange={(e) => setConfirmed(e.target.checked)}>
					I hereby declare that all information submitted in this Co-curricular Transcript (CCT) is true, accurate, and
					complete to the best of my knowledge. I confirm that I have carefully reviewed and verified all entries and
					supporting evidence, and I understand that any misrepresentation or omission may result in disciplinary action
					in accordance with University regulations.
				</Checkbox>
			</div>
		</Modal>
	);
});

export default PreviewCCTModal;
