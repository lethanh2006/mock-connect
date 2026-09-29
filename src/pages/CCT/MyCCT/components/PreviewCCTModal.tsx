import { Button } from '@/components/Icons';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { Checkbox } from 'antd';
import React, { forwardRef, useState } from 'react';

interface Props {
	open: boolean;
	onCancel: () => void;
	onConfirm: () => void;
	children: React.ReactNode;
}

const PreviewCCTModal = forwardRef<HTMLDivElement, Props>(({ open, onCancel, onConfirm, children }, ref) => {
	const [confirmed, setConfirmed] = useState(false);

	const handleClose = () => {
		setConfirmed(false);
		onCancel();
	};

	return (
		<ModalExpandable
			open={open}
			onCancel={handleClose}
			width={1300}
			destroyOnClose
			footer={
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
					<Button variant='outline' onClick={handleClose}>
						Close
					</Button>
					<Button variant='default' disabled={!confirmed} onClick={onConfirm}>
						Submit
					</Button>
				</div>
			}
		>
			<div style={{ maxHeight: '70vh', overflow: 'auto' }}>{children}</div>

			<div style={{ marginTop: 16 }}>
				<Checkbox onChange={(e) => setConfirmed(e.target.checked)}>
					I hereby declare that all information submitted in this Co-curricular Transcript (CCT) is true, accurate, and
					complete to the best of my knowledge. I confirm that I have carefully reviewed and verified all entries and
					supporting evidence, and I understand that any misrepresentation or omission may result in disciplinary action
					in accordance with University regulations.
				</Checkbox>
			</div>
		</ModalExpandable>
	);
});

export default PreviewCCTModal;
