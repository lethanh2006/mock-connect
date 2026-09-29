import {
	Command,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SearchInput,
} from '@/components/Icons';
import { getSearchStorage, updateSearchStorage } from '@/components/Table/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';
import './SearchTienTrinh.less';

type SearchTienTrinhProps = {
	storageKey: string;
	value: string;
	onChange: (value: string) => void;
};

const SearchTienTrinh = ({ storageKey, value, onChange }: SearchTienTrinhProps) => {
	const intl = useIntl();
	const [searchOptions, setSearchOptions] = useState<{ value: string }[]>([]);
	const [searchHistoryOpen, setSearchHistoryOpen] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const refreshHistory = useCallback(() => {
		const history = getSearchStorage(storageKey);
		setSearchOptions(history.map((item: string) => ({ value: item })));
	}, [storageKey]);

	useEffect(() => {
		refreshHistory();
	}, [refreshHistory]);

	const handleSearchTrigger = useCallback(
		(nextValue: string) => {
			const keyword = nextValue?.trim() || '';
			onChange(keyword);

			if (keyword) updateSearchStorage(storageKey, keyword);
			refreshHistory();

			setTimeout(() => {
				searchInputRef.current?.blur();
			}, 0);
		},
		[onChange, refreshHistory, storageKey],
	);

	return (
		<Popover open={searchHistoryOpen && searchOptions.length > 0} onOpenChange={setSearchHistoryOpen}>
			{/* SearchInput gồm icon + input + nút xóa, không phải một phần tử đơn nên không asChild thẳng lên nó. */}
			<PopoverTrigger asChild>
				<div className='view-switch-search'>
					<SearchInput
						ref={searchInputRef}
						variant='tiled'
						className='global-search'
						clearable
						value={value}
						placeholder={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.search.placeholder' })}
						title={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.search.tooltip' })}
						autoComplete='off'
						onFocus={() => setSearchHistoryOpen(true)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSearchTrigger((e.target as HTMLInputElement).value);
								setSearchHistoryOpen(false);
							}
						}}
						onClear={() => {
							handleSearchTrigger('');
							setSearchHistoryOpen(false);
						}}
						onChange={(e) => {
							const nextValue = e.target.value;
							onChange(nextValue);
							if (!nextValue.trim()) handleSearchTrigger('');
						}}
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent align='start' className='p-0' onOpenAutoFocus={(e) => e.preventDefault()}>
				<Command surface={false}>
					<CommandList>
						{searchOptions.map((opt) => (
							<CommandItem
								key={opt.value}
								variant='cell'
								onSelect={() => {
									handleSearchTrigger(opt.value);
									setSearchHistoryOpen(false);
								}}
							>
								{opt.value}
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default SearchTienTrinh;
