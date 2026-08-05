import styles from './index.less';

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
	<div className={styles.sectionHeader}>
		<span className={styles.sectionHeaderArrow}>▶</span>
		{children}
		<span className={styles.sectionHeaderLine} />
	</div>
);

export default SectionHeader;
