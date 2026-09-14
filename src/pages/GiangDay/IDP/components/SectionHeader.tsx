import styles from './IdpDetail.less';

const SectionHeader = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
	<div className={styles.sectionHeader} style={style}>
		<span className={styles.sectionHeaderArrow}>▶</span>
		{children}
		<span className={styles.sectionHeaderLine} />
	</div>
);

export default SectionHeader;
