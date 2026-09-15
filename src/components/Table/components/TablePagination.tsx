import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@vinuni/ui';
import React from 'react';
import { IconChervolLeft, IconChervolRight } from '@/components/Icons';
import '../style.less';

export interface TablePaginationProps {
	page: number;
	limit: number;
	total: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	pageSizeOptions?: string[];
	extra?: React.ReactNode;
}

type PageToken = number | 'ellipsis';

const buildPageTokens = (current: number, totalPages: number): PageToken[] => {
	if (totalPages <= 1) return [1];

	const delta = 1;
	const left = Math.max(2, current - delta);
	const right = Math.min(totalPages - 1, current + delta);
	const tokens: PageToken[] = [1];

	if (left > 2) tokens.push('ellipsis');
	for (let i = left; i <= right; i++) tokens.push(i);
	if (right < totalPages - 1) tokens.push('ellipsis');
	if (totalPages > 1) tokens.push(totalPages);

	return tokens;
};

/** Thay thế `pagination` built-in của antd Table bằng Pagination trình bày thuần của vinuni. */
export const TablePagination: React.FC<TablePaginationProps> = ({
	page,
	limit,
	total,
	onPageChange,
	onLimitChange,
	pageSizeOptions = ['5', '10', '25', '50', '100'],
	extra,
}) => {
	const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
	const tokens = buildPageTokens(page, totalPages);

	return (
		<div className='table-pagination-bar'>
			<div className='table-pagination-left'>{extra}</div>

			<div className='table-pagination-right'>
				<Pagination style={{ width: 'auto', margin: 0 }}>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink
							href='#!'
							size='icon-sm'
							aria-label='Previous'
							aria-disabled={page <= 1}
							style={page <= 1 ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
							onClick={(e) => {
								e.preventDefault();
								if (page > 1) onPageChange(page - 1);
							}}
						>
							<IconChervolLeft />
						</PaginationLink>
					</PaginationItem>

					{tokens.map((token, index) =>
						token === 'ellipsis' ? (
							<PaginationItem key={`ellipsis-${index}`}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={token}>
								<PaginationLink
									href='#!'
									size='icon-sm'
									isActive={token === page}
									onClick={(e) => {
										e.preventDefault();
										if (token !== page) onPageChange(token);
									}}
								>
									{token}
								</PaginationLink>
							</PaginationItem>
						),
					)}

					<PaginationItem>
						<PaginationLink
							href='#!'
							size='icon-sm'
							aria-label='Next'
							aria-disabled={page >= totalPages}
							style={page >= totalPages ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
							onClick={(e) => {
								e.preventDefault();
								if (page < totalPages) onPageChange(page + 1);
							}}
						>
							<IconChervolRight />
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			<Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
				<SelectTrigger size='sm' style={{ width: 140 }}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{pageSizeOptions.map((item) => (
						<SelectItem key={item} value={item}>
							{item} / trang
						</SelectItem>
					))}
				</SelectContent>
				</Select>
			</div>
		</div>
	);
};
