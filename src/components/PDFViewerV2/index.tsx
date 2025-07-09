import { SpecialZoomLevel, Viewer, Worker, type ViewerProps } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useEffect, useRef, useState } from 'react';

interface PDFViewerProps extends Omit<ViewerProps, 'fileUrl'> {
	url: string;
}

const PDFViewerV2 = ({ url, plugins, defaultScale = SpecialZoomLevel.PageFit, ...viewerProps }: PDFViewerProps) => {
	const defaultLayoutPluginInstance = defaultLayoutPlugin();
	const viewerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState('100%');

	useEffect(() => {
		const updateHeight = () => {
			if (viewerRef.current) {
				const parentHeight = viewerRef.current.parentElement?.offsetHeight;
				if (parentHeight) {
					setHeight(`${parentHeight}px`);
				}
			}
		};

		updateHeight();
		window.addEventListener('resize', updateHeight);

		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	}, []);

	return (
		<div ref={viewerRef} style={{ height }}>
			<Worker workerUrl='/pdf.worker.min.js'>
				<Viewer
					fileUrl={url}
					defaultScale={defaultScale}
					plugins={plugins ?? [defaultLayoutPluginInstance]}
					{...viewerProps}
				/>
			</Worker>
		</div>
	);
};

export default PDFViewerV2;
