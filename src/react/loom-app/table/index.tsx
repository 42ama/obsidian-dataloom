import React from "react";

import _ from "lodash";

import FooterCellContainer from "../footer-cell-container";
import HeaderCellContainer from "../header-cell-container";
import BodyRow from "./body-row";
import HeaderCell from "./header-cell";
import BodyCell from "./body-cell";
import FooterCell from "./footer-cell";
import NewColumnButton from "../new-column-button";
import RowOptions from "../row-options";
import BodyCellContainer from "../body-cell-container";

import { usePrevious } from "src/shared/hooks";
import {
	ColumnAddClickHandler,
	ColumnChangeHandler,
	ColumnDeleteClickHandler,
	ColumnReorderHandler,
	ColumnTypeClickHandler,
} from "../app/hooks/use-column/types";
import { RowReorderHandler } from "../app/hooks/use-row/types";

import {
	Column,
	Source,
	Row,
	Cell,
	CellType,
	TextCell,
	NumberCell,
	TagCell,
	MultiTagCell,
	SourceFileCell,
	DateCell,
	CheckboxCell,
	EmbedCell,
	FileCell,
} from "src/shared/loom-state/types/loom-state";
import CellNotFoundError from "src/shared/error/cell-not-found-error";
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
import { getAcceptedFrontmatterTypes } from "src/shared/frontmatter/utils";
import FrontmatterCache from "src/shared/frontmatter/frontmatter-cache";

interface Props {
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

const Table = React.forwardRef<HTMLDivElement | null, Props>(function Table(
	{
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
	const previousRowLength = usePrevious(rows.length);

	/**
	 * Scrolls to the bottom of the page when the "New Row" button is pressed
	 */
	React.useEffect(() => {
		// if (previousRowLength === undefined) return;
		// if (previousRowLength < rows.length)
		// 	(
		// 		ref as React.MutableRefObject<VirtuosoHandle | null>
		// 	).current?.scrollToIndex(rows.length - 1);
	}, [ref, previousRowLength, rows.length]);

	const visibleColumns = columns.filter((column) => column.isVisible);

	return (
		<div
			style={{
				flexGrow: 1,
				overflow: "scroll",
			}}
		>
			<div className="dataloom-table">
				<div className="dataloom-header">
					<HeaderRows
						visibleColumns={visibleColumns}
						numFrozenColumns={numFrozenColumns}
						resizingColumnId={resizingColumnId}
						columns={columns}
						sources={sources}
						onColumnDeleteClick={onColumnDeleteClick}
						onColumnAddClick={onColumnAddClick}
						onColumnTypeChange={onColumnTypeChange}
						onFrozenColumnsChange={onFrozenColumnsChange}
						onColumnReorder={onColumnReorder}
						onColumnChange={onColumnChange}
					/>
				</div>
				<div className="dataloom-body">
					{rows.map((row) => (
						<BodyRow key={row.id} onRowReorder={onRowReorder}>
							<BodyCells
								row={row}
								visibleColumns={visibleColumns}
								sources={sources}
								numFrozenColumns={numFrozenColumns}
								onRowDeleteClick={onRowDeleteClick}
								onRowInsertAboveClick={onRowInsertAboveClick}
								onRowInsertBelowClick={onRowInsertBelowClick}
								onCellChange={onCellChange}
								onTagAdd={onTagAdd}
								onTagCellAdd={onTagCellAdd}
								onTagCellRemove={onTagCellRemove}
								onTagCellMultipleRemove={
									onTagCellMultipleRemove
								}
								onTagChange={onTagChange}
								onTagDeleteClick={onTagDeleteClick}
								onRowReorder={onRowReorder}
								onColumnChange={onColumnChange}
							/>
						</BodyRow>
					))}
				</div>
				<div className="dataloom-footer">
					<FooterRows
						showCalculationRow={showCalculationRow}
						visibleColumns={visibleColumns}
						rows={rows}
						sources={sources}
						numFrozenColumns={numFrozenColumns}
						onColumnChange={onColumnChange}
					/>
				</div>
			</div>
		</div>
	);
});

interface BodyRowsProps {
	row: Row;
	visibleColumns: Column[];
	sources: Source[];
	numFrozenColumns: number;
	onRowDeleteClick: (rowId: string) => void;
	onRowInsertAboveClick: (rowId: string) => void;
	onRowInsertBelowClick: (rowId: string) => void;
	onCellChange: CellChangeHandler;
	onTagAdd: TagAddHandler;
	onTagCellAdd: TagCellAddHandler;
	onTagCellRemove: TagCellRemoveHandler;
	onTagCellMultipleRemove: TagCellMultipleRemoveHandler;
	onTagChange: TagChangeHandler;
	onTagDeleteClick: TagDeleteHandler;
	onRowReorder: RowReorderHandler;
	onColumnChange: ColumnChangeHandler;
}

const BodyCells = ({
	row,
	visibleColumns,
	sources,
	numFrozenColumns,
	onRowDeleteClick,
	onRowInsertAboveClick,
	onRowInsertBelowClick,
	onRowReorder,
	onCellChange,
	onTagAdd,
	onTagCellAdd,
	onTagCellRemove,
	onTagCellMultipleRemove,
	onTagChange,
	onTagDeleteClick,
	onColumnChange,
}: BodyRowsProps) => {
	const { id: rowId, lastEditedDateTime, creationDateTime, sourceId } = row;
	const source = sources.find((source) => source.id === sourceId) ?? null;

	const columns = [null, ...visibleColumns, null];
	return columns.map((column, i) => {
		let contentNode: React.ReactNode;
		let key: string;

		if (column === null) {
			key = `filler-${i}`;
			if (i === 0) {
				contentNode = (
					<RowOptions
						source={source}
						rowId={rowId}
						onDeleteClick={onRowDeleteClick}
						onInsertAboveClick={onRowInsertAboveClick}
						onInsertBelowClick={onRowInsertBelowClick}
						onRowReorder={onRowReorder}
					/>
				);
			} else {
				contentNode = <></>;
			}
		} else {
			const {
				id: columnId,
				width,
				type,
				shouldWrapOverflow,
				currencyType,
				includeTime,
				dateFormatSeparator,
				numberPrefix,
				numberSeparator,
				numberFormat,
				numberSuffix,
				dateFormat,
				hour12,
				tags,
				verticalPadding,
				horizontalPadding,
				aspectRatio,
				frontmatterKey,
			} = column;

			const cell = row.cells.find((cell) => cell.columnId === columnId);
			if (!cell)
				throw new CellNotFoundError({
					columnId,
					rowId,
				});

			const source =
				sources.find((source) => source.id === row.sourceId) ?? null;

			key = column.id;

			const { id, hasValidFrontmatter } = cell;

			const commonProps = {
				id,
				hasValidFrontmatter,
				columnId,
				frontmatterKey,
				verticalPadding,
				includeTime,
				dateFormatSeparator,
				horizontalPadding,
				aspectRatio,
				columnTags: tags,
				source,
				hour12,
				numberFormat,
				rowCreationTime: creationDateTime,
				dateFormat,
				currencyType,
				numberPrefix,
				numberSuffix,
				numberSeparator,
				rowLastEditedTime: lastEditedDateTime,
				shouldWrapOverflow,
				width,
				onCellChange,
			};

			switch (type) {
				case CellType.TEXT: {
					const { content } = cell as TextCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							content={content}
						/>
					);
					break;
				}
				case CellType.NUMBER: {
					const { value } = cell as NumberCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							value={value}
						/>
					);
					break;
				}
				case CellType.TAG: {
					const { tagId } = cell as TagCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							tagId={tagId}
							onTagAdd={onTagAdd}
							onTagCellAdd={onTagCellAdd}
							onTagCellRemove={onTagCellRemove}
							onTagCellMultipleRemove={onTagCellMultipleRemove}
							onTagChange={onTagChange}
							onTagDeleteClick={onTagDeleteClick}
						/>
					);
					break;
				}
				case CellType.MULTI_TAG: {
					const { tagIds } = cell as MultiTagCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							tagIds={tagIds}
							onCellChange={onCellChange}
							onTagAdd={onTagAdd}
							onTagCellAdd={onTagCellAdd}
							onTagCellRemove={onTagCellRemove}
							onTagCellMultipleRemove={onTagCellMultipleRemove}
							onTagChange={onTagChange}
							onTagDeleteClick={onTagDeleteClick}
						/>
					);
					break;
				}
				case CellType.FILE: {
					const { path, alias } = cell as FileCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							path={path}
							alias={alias}
						/>
					);
					break;
				}
				case CellType.EMBED: {
					const { pathOrUrl, alias, isExternal } = cell as EmbedCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							pathOrUrl={pathOrUrl}
							alias={alias}
							isExternal={isExternal}
						/>
					);
					break;
				}
				case CellType.CHECKBOX: {
					const { value } = cell as CheckboxCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							value={value}
						/>
					);
					break;
				}
				case CellType.DATE: {
					const { dateTime } = cell as DateCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							dateTime={dateTime}
							onColumnChange={onColumnChange}
						/>
					);
					break;
				}
				case CellType.CREATION_TIME: {
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
						/>
					);
					break;
				}
				case CellType.LAST_EDITED_TIME: {
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
						/>
					);
					break;
				}
				case CellType.SOURCE: {
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
						/>
					);
					break;
				}
				case CellType.SOURCE_FILE: {
					const { path } = cell as SourceFileCell;
					contentNode = (
						<BodyCellContainer
							key={id}
							{...commonProps}
							type={type}
							path={path}
						/>
					);
					break;
				}
				default:
					throw new Error(`Cell type ${type} not implemented`);
			}
		}
		return (
			<BodyCell
				key={key}
				rowId={rowId}
				contentNode={contentNode}
				index={i}
				numFrozenColumns={numFrozenColumns}
			/>
		);
	});
};

interface HeaderRowsProps {
	visibleColumns: Column[];
	numFrozenColumns: number;
	resizingColumnId: string | null;
	columns: Column[];
	sources: Source[];
	onColumnDeleteClick: ColumnDeleteClickHandler;
	onColumnAddClick: ColumnAddClickHandler;
	onColumnTypeChange: ColumnTypeClickHandler;
	onFrozenColumnsChange: (value: number) => void;
	onColumnReorder: ColumnReorderHandler;
	onColumnChange: ColumnChangeHandler;
}

const HeaderRows = ({
	visibleColumns,
	numFrozenColumns,
	resizingColumnId,
	columns,
	sources,
	onColumnDeleteClick,
	onColumnAddClick,
	onColumnTypeChange,
	onFrozenColumnsChange,
	onColumnReorder,
	onColumnChange,
}: HeaderRowsProps) => {
	const tableColumns = [null, ...visibleColumns, null];
	return (
		<div className="dataloom-row">
			{tableColumns.map((column, i) => {
				let content: React.ReactNode;
				let key: string;

				if (column === null) {
					key = `filler-${i}`;
					if (i === 0) {
						content = <></>;
					} else {
						content = (
							<NewColumnButton onClick={onColumnAddClick} />
						);
					}
				} else {
					const { id, type } = column;
					const frontmatterTypes = getAcceptedFrontmatterTypes(type);

					let frontmatterKeys: string[] = [];
					frontmatterTypes.forEach((frontmatterType) => {
						frontmatterKeys = [
							...frontmatterKeys,
							...FrontmatterCache.getInstance().getPropertyNames(
								frontmatterType
							),
						];
					});

					const isKeySelectable = (key: string) => {
						const columnWithKey = columns.find(
							(column) => column.frontmatterKey === key
						);
						if (!columnWithKey) return true;
						if (columnWithKey.id === id) return true;
						return false;
					};

					const columnKeys = frontmatterKeys.map((key) => ({
						value: key,
						isSelectable: isKeySelectable(key),
					}));

					key = id;
					content = (
						<HeaderCellContainer
							key={id}
							index={i}
							column={column}
							frontmatterKeys={columnKeys}
							numColumns={columns.length}
							numSources={sources.length}
							numFrozenColumns={numFrozenColumns}
							resizingColumnId={resizingColumnId}
							onColumnChange={onColumnChange}
							onColumnDeleteClick={onColumnDeleteClick}
							onColumnTypeChange={onColumnTypeChange}
							onFrozenColumnsChange={onFrozenColumnsChange}
						/>
					);
				}

				return (
					<HeaderCell
						key={key}
						index={i}
						numFrozenColumns={numFrozenColumns}
						columnId={column?.id}
						content={content}
						isDraggable={i > 0 && i < tableColumns.length - 1}
						onColumnReorder={onColumnReorder}
					/>
				);
			})}
		</div>
	);
};

interface FooterRowsProps {
	showCalculationRow: boolean;
	visibleColumns: Column[];
	rows: Row[];
	sources: Source[];
	numFrozenColumns: number;
	onColumnChange: ColumnChangeHandler;
}

const FooterRows = ({
	showCalculationRow,
	visibleColumns,
	numFrozenColumns,
	sources,
	rows,
	onColumnChange,
}: FooterRowsProps) => {
	if (!showCalculationRow) return undefined;

	const columns = [null, ...visibleColumns, null];
	return (
		<div className="dataloom-row">
			{columns.map((column, i) => {
				let content: React.ReactNode;
				let key: string;

				if (column === null) {
					key = `filler-${i}`;
					content = <></>;
				} else {
					const {
						id: columnId,
						type,
						currencyType,
						dateFormat,
						dateFormatSeparator,
						numberFormat,
						width,
						tags,
						calculationType,
					} = column;

					const columnCells: Cell[] = rows.map((row) => {
						const { id: rowId, cells } = row;
						const cell = cells.find(
							(cell) => cell.columnId === columnId
						);
						if (!cell)
							throw new CellNotFoundError({
								columnId,
								rowId,
							});
						return cell;
					});

					key = columnId;
					content = (
						<FooterCellContainer
							sources={sources}
							columnId={columnId}
							columnTags={tags}
							numberFormat={numberFormat}
							dateFormatSeparator={dateFormatSeparator}
							currencyType={currencyType}
							dateFormat={dateFormat}
							columnCells={columnCells}
							rows={rows}
							calculationType={calculationType}
							width={width}
							cellType={type}
							onColumnChange={onColumnChange}
						/>
					);
				}

				return (
					<FooterCell
						key={key}
						index={i}
						numFrozenColumns={numFrozenColumns}
						content={content}
					/>
				);
			})}
		</div>
	);
};

const areEqual = (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
	return _.isEqual(prevProps, nextProps);
};

export default React.memo(Table, areEqual);
