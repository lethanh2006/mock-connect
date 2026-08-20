import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
	BatchSpanProcessor,
	TraceIdRatioBasedSampler,
	WebTracerProvider,
} from '@opentelemetry/sdk-trace-web';

const CLIENT_APP = 'web-connect';
const INITIALIZED_FLAG = '__VINUNI_BROWSER_OTEL_INITIALIZED__';

type RuntimeConfig = Record<string, string | undefined>;

type ObservabilityWindow = Window & {
	__APP_CONFIG__?: RuntimeConfig;
	[INITIALIZED_FLAG]?: boolean;
};

const getRuntimeConfig = (): RuntimeConfig =>
	(window as ObservabilityWindow).__APP_CONFIG__ ?? {};

const isEnabled = (value: string | undefined) =>
	value === undefined || ['1', 'true', 'yes'].includes(value.trim().toLowerCase());

const getSampleRatio = (value: string | undefined) => {
	const ratio = Number(value ?? '0.25');
	return Number.isFinite(ratio) && ratio >= 0 && ratio <= 1 ? ratio : 0.25;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getOriginPatterns = (config: RuntimeConfig) => {
	const origins = new Set<string>([window.location.origin]);

	for (const root of [config.APP_CONFIG_IP_ROOT, config.APP_CONFIG_IP_ROOT_API]) {
		if (!root) continue;

		try {
			origins.add(new URL(root, window.location.origin).origin);
		} catch {
			// Invalid optional runtime configuration must not break application startup.
		}
	}

	return [...origins].map(
		(origin) => new RegExp(`^${escapeRegExp(origin)}(?:/|$)`),
	);
};

const getIgnoredUrlPatterns = (config: RuntimeConfig, endpoint: string) =>
	[endpoint, config.APP_CONFIG_KEYCLOAK_AUTHORITY]
		.filter((value): value is string => Boolean(value))
		.map((value) => new RegExp(escapeRegExp(value)));

const initializeBrowserOtel = () => {
	const observabilityWindow = window as ObservabilityWindow;
	if (observabilityWindow[INITIALIZED_FLAG]) return;

	const config = getRuntimeConfig();
	const endpoint = config.APP_CONFIG_OTEL_TRACES_ENDPOINT?.trim();
	if (!endpoint || !isEnabled(config.APP_CONFIG_OTEL_ENABLED)) return;

	const apiUrlPatterns = getOriginPatterns(config);
	const ignoredUrlPatterns = getIgnoredUrlPatterns(config, endpoint);
	const addClientAttribute = (span: { setAttribute: (key: string, value: string) => void }) => {
		span.setAttribute('vinuni.client_app', CLIENT_APP);
	};

	const exporter = new OTLPTraceExporter({ url: endpoint });
	const provider = new WebTracerProvider({
		resource: resourceFromAttributes({
			'service.name': CLIENT_APP,
			'service.version': config.APP_CONFIG_APP_VERSION ?? 'unknown',
			'vinuni.client_app': CLIENT_APP,
		}),
		sampler: new TraceIdRatioBasedSampler(getSampleRatio(config.APP_CONFIG_OTEL_SAMPLE_RATIO)),
		spanProcessors: [
			new BatchSpanProcessor(exporter, {
				maxExportBatchSize: 64,
				maxQueueSize: 256,
				scheduledDelayMillis: 5000,
			}),
		],
	});

	provider.register({ contextManager: new ZoneContextManager() });
	registerInstrumentations({
		instrumentations: [
			new DocumentLoadInstrumentation(),
			new FetchInstrumentation({
				applyCustomAttributesOnSpan: addClientAttribute,
				ignoreUrls: ignoredUrlPatterns,
				propagateTraceHeaderCorsUrls: apiUrlPatterns,
			}),
			new XMLHttpRequestInstrumentation({
				applyCustomAttributesOnSpan: addClientAttribute,
				ignoreUrls: ignoredUrlPatterns,
				propagateTraceHeaderCorsUrls: apiUrlPatterns,
			}),
		],
	});

	observabilityWindow[INITIALIZED_FLAG] = true;
};

if (typeof window !== 'undefined') {
	initializeBrowserOtel();
}
