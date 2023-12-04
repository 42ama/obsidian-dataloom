import React from "react";

import { VirtuosoHandle } from "react-virtuoso";
import _ from "lodash";

import {
	ColumnAddClickHandler,
	ColumnChangeHandler,
	ColumnDeleteClickHandler,
	ColumnReorderHandler,
	ColumnTypeClickHandler,
} from "../app/hooks/use-column/types";
import { RowReorderHandler } from "../app/hooks/use-row/types";

import { Column, Source, Row } from "src/shared/loom-state/types/loom-state";
import { CellChangeHandler } from "../app/hooks/use-cell/types";
import {
	TagAddHandler,
	TagCellAddHandler,
	TagCellRemoveHandler,
	TagCellMultipleRemoveHandler,
	TagChangeHandler,
	TagDeleteHandler,
} from "../app/hooks/use-tag/types";

import "./styles.css";
import RegularTable from "./regular-table";
import VirtualizedTable from "./virtualized-table";

interface Props {
	isVirtualized: boolean;
	showCalculationRow: boolean;
	numFrozenColumns: number;
	columns: Column[];
	resizingColumnId: string | null;
	sources: Source[];
	rows: Row[];
	onColumnDeleteClick: ColumnDeleteClickHandler;
	onColumnAddClick: ColumnAddClickHandler;
	onColumnTypeChange: ColumnTypeClickHandler;
	onFrozenColumnsChange: (value: number) => void;
	onColumnReorder: ColumnReorderHandler;
	onRowDeleteClick: (rowId: string) => void;
	onRowInsertAboveClick: (rowId: string) => void;
	onRowInsertBelowClick: (rowId: string) => void;
	onColumnChange: ColumnChangeHandler;
	onCellChange: CellChangeHandler;
	onTagAdd: TagAddHandler;
	onTagCellAdd: TagCellAddHandler;
	onTagCellRemove: TagCellRemoveHandler;
	onTagCellMultipleRemove: TagCellMultipleRemoveHandler;
	onTagChange: TagChangeHandler;
	onTagDeleteClick: TagDeleteHandler;
	onRowReorder: RowReorderHandler;
}

const Table = React.forwardRef<VirtuosoHandle, Props>(function Table(
	{
		isVirtualized,
		sources,
		rows,
		columns,
		numFrozenColumns,
		resizingColumnId,
		showCalculationRow,
		onColumnDeleteClick,
		onColumnAddClick,
		onColumnTypeChange,
		onFrozenColumnsChange,
		onColumnReorder,
		onRowDeleteClick,
		onRowInsertAboveClick,
		onRowInsertBelowClick,
		onColumnChange,
		onCellChange,
		onTagAdd,
		onTagCellAdd,
		onTagCellRemove,
		onTagCellMultipleRemove,
		onTagChange,
		onTagDeleteClick,
		onRowReorder,
	},
	ref
) {
	if (isVirtualized) {
		return (
			<VirtualizedTable
				ref={ref}
				sources={sources}
				columns={columns}
				rows={rows}
				numFrozenColumns={numFrozenColumns}
				resizingColumnId={resizingColumnId}
				showCalculationRow={showCalculationRow}
				onColumnDeleteClick={onColumnDeleteClick}
				onColumnAddClick={onColumnAddClick}
				onColumnTypeChange={onColumnTypeChange}
				onFrozenColumnsChange={onFrozenColumnsChange}
				onColumnReorder={onColumnReorder}
				onRowDeleteClick={onRowDeleteClick}
				onRowInsertAboveClick={onRowInsertAboveClick}
				onRowInsertBelowClick={onRowInsertBelowClick}
				onColumnChange={onColumnChange}
				onCellChange={onCellChange}
				onTagAdd={onTagAdd}
				onTagCellAdd={onTagCellAdd}
				onTagCellRemove={onTagCellRemove}
				onTagCellMultipleRemove={onTagCellMultipleRemove}
				onTagChange={onTagChange}
				onTagDeleteClick={onTagDeleteClick}
				onRowReorder={onRowReorder}
			/>
		);
	}
	return (
		<RegularTable
			columns={columns}
			rows={rows}
			sources={sources}
			numFrozenColumns={numFrozenColumns}
			resizingColumnId={resizingColumnId}
			showCalculationRow={showCalculationRow}
			onColumnDeleteClick={onColumnDeleteClick}
			onColumnAddClick={onColumnAddClick}
			onColumnTypeChange={onColumnTypeChange}
			onFrozenColumnsChange={onFrozenColumnsChange}
			onColumnReorder={onColumnReorder}
			onRowDeleteClick={onRowDeleteClick}
			onRowInsertAboveClick={onRowInsertAboveClick}
			onRowInsertBelowClick={onRowInsertBelowClick}
			onColumnChange={onColumnChange}
			onCellChange={onCellChange}
			onTagAdd={onTagAdd}
			onTagCellAdd={onTagCellAdd}
			onTagCellRemove={onTagCellRemove}
			onTagCellMultipleRemove={onTagCellMultipleRemove}
			onTagChange={onTagChange}
			onTagDeleteClick={onTagDeleteClick}
			onRowReorder={onRowReorder}
		/>
	);
});

const areEqual = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
	return _.isEqual(prevProps, nextProps);
};

export default React.memo(Table, areEqual);
