import React from "react";

import { VirtuosoHandle } from "react-virtuoso";

import Table from "../table";
import OptionBar from "../option-bar";
import BottomBar from "../bottom-bar";

import { useLoomState } from "../loom-state-provider";
import { useFilter } from "./hooks/use-filter";
import { filterRowsBySearch } from "./filter-by-search";
import { useColumn } from "./hooks/use-column";
import { useRow } from "./hooks/use-row";
import { useCell } from "./hooks/use-cell";
import { useTag } from "./hooks/use-tag";
import { useAppMount } from "../app-mount-provider";
import { useExportEvents } from "src/react/loom-app/app/hooks/use-export-events";
import { useRowEvents } from "src/react/loom-app/app/hooks/use-row-events";
import { useColumnEvents } from "src/react/loom-app/app/hooks/use-column-events";
import { useTableSettings } from "./hooks/use-table-settings";
import useFocus from "./hooks/use-focus";

import {
	isMacRedoDown,
	isMacUndoDown,
	isWindowsRedoDown,
	isWindowsUndoDown,
} from "src/shared/keyboard-event";
import { useLogger } from "src/shared/logger";
import { useSource } from "./hooks/use-source";

import "src/react/global.css";
import "./styles.css";
import { useAppEvents } from "./hooks/use-app-events";
import { useMenuEvents } from "./hooks/use-menu-events";
import { useAppSelector } from "src/redux/hooks";
import { numToPx } from "src/shared/conversion";
import { DefaultRowDisplay } from "src/main";

export default function App() {
	const logger = useLogger();
	const { reactAppId, isMarkdownView } = useAppMount();

	const { defaultRowDisplay } = useAppSelector(
		(state) => state.global.settings
	);
	const { loomState, resizingColumnId, searchText, onRedo, onUndo } =
		useLoomState();

	const tableRef = React.useRef<VirtuosoHandle | null>(null);
	const appRef = React.useRef<HTMLDivElement | null>(null);

	useExportEvents(loomState);
	useRowEvents();
	useColumnEvents();
	useMenuEvents();
	const { onClick } = useAppEvents();

	const { onSourceAdd, onSourceDelete, onSourceUpdate } = useSource();

	const { onFocusKeyDown } = useFocus();
	const { onFrozenColumnsChange, onCalculationRowToggle } =
		useTableSettings();

	const { onFilterAdd, onFilterUpdate, onFilterDelete, filterByFilters } =
		useFilter();

	const {
		onColumnDeleteClick,
		onColumnAddClick,
		onColumnTypeChange,
		onColumnChange,
		onColumnReorder,
	} = useColumn();

	const {
		onRowAddClick,
		onRowDeleteClick,
		onRowInsertAboveClick,
		onRowInsertBelowClick,
		onRowReorder,
	} = useRow();

	const { onCellChange } = useCell();

	const {
		onTagCellAdd,
		onTagAdd,
		onTagCellRemove,
		onTagCellMultipleRemove,
		onTagDeleteClick,
		onTagChange,
	} = useTag();

	const { columns, filters, settings, sources, rows } = loomState.model;
	const { numFrozenColumns, showCalculationRow } = settings;

	React.useEffect(() => {
		function calculateTableRowsHeight(
			appEl: HTMLElement,
			defaultRowDisplay: DefaultRowDisplay
		) {
			// Get all row elements ('tr') from the table
			const rows = appEl.querySelectorAll(
				".dataloom-body > .dataloom-row"
			);
			if (rows.length === 0) return 0;

			let numRowsToCalculate;
			if (defaultRowDisplay === "all") {
				numRowsToCalculate = rows.length;
			} else {
				numRowsToCalculate = defaultRowDisplay;
				if (numRowsToCalculate > rows.length) {
					numRowsToCalculate = rows.length;
				}
			}

			// Calculate the height of the first 5 rows
			let totalHeight = 0;
			for (let i = 0; i < numRowsToCalculate; i++) {
				const { height } = rows[i].getBoundingClientRect();
				totalHeight += height;
			}
			return totalHeight;
		}

		function calculateTableHeaderHeight(appEl: HTMLElement) {
			const headerEl = appEl.querySelector(".dataloom-header");
			if (!headerEl) return 0;
			const { height } = headerEl.getBoundingClientRect();
			return height;
		}

		function calculateTableFooterHeight(appEl: HTMLElement) {
			const footerEl = appEl.querySelector(".dataloom-footer");
			if (!footerEl) return 0;
			const { height } = footerEl.getBoundingClientRect();
			return height;
		}

		function calculateOptionBarHeight(appEl: HTMLElement) {
			const optionBarEl = appEl.querySelector(".dataloom-option-bar");
			if (!optionBarEl) return 0;
			const { height } = optionBarEl.getBoundingClientRect();
			return height;
		}

		function calculateBottomBarHeight(appEl: HTMLElement) {
			const bottomBarEl = appEl.querySelector(".dataloom-bottom-bar");
			if (!bottomBarEl) return 0;
			const { height } = bottomBarEl.getBoundingClientRect();
			return height;
		}

		const appEl = document.getElementById(reactAppId);
		if (!appEl) return;

		appEl.style.height = "20000px";

		requestAnimationFrame(() => {
			let calculatedHeight = 0;
			calculatedHeight += calculateTableRowsHeight(
				appEl,
				defaultRowDisplay
			);
			calculatedHeight += calculateTableHeaderHeight(appEl);
			calculatedHeight += calculateTableFooterHeight(appEl);
			calculatedHeight += calculateOptionBarHeight(appEl);
			calculatedHeight += calculateBottomBarHeight(appEl);

			appEl.style.height = numToPx(calculatedHeight);
		});
	}, [reactAppId, defaultRowDisplay, rows.length]);

	function handleScrollToTopClick() {
		tableRef.current?.scrollToIndex(0);
	}

	function handleScrollToBottomClick() {
		tableRef.current?.scrollToIndex(filteredRows.length - 1);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		logger("App handleKeyDown");
		//Stop propagation to the global event
		e.stopPropagation();
		if (isWindowsRedoDown(e) || isMacRedoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			onRedo();
		} else if (isWindowsUndoDown(e) || isMacUndoDown(e)) {
			//Prevent Obsidian action bar from triggering
			e.preventDefault();
			onUndo();
		} else {
			onFocusKeyDown(e);
		}
	}

	let filteredRows = filterByFilters(loomState);
	filteredRows = filterRowsBySearch(
		sources,
		columns,
		filteredRows,
		searchText
	);

	let className = "dataloom-app";
	if (isMarkdownView) className += " dataloom-app--markdown-view";
	return (
		<div
			ref={appRef}
			tabIndex={0}
			id={reactAppId}
			className={className}
			onKeyDown={handleKeyDown}
			onClick={onClick}
		>
			<OptionBar
				columns={columns}
				sources={sources}
				filters={filters}
				showCalculationRow={showCalculationRow}
				onColumnChange={onColumnChange}
				onFilterAddClick={onFilterAdd}
				onFilterDeleteClick={onFilterDelete}
				onFilterUpdate={onFilterUpdate}
				onCalculationRowToggle={onCalculationRowToggle}
				onSourceAdd={onSourceAdd}
				onSourceDelete={onSourceDelete}
				onSourceUpdate={onSourceUpdate}
			/>
			<Table
				ref={tableRef}
				sources={sources}
				rows={filteredRows}
				columns={columns}
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
			<BottomBar
				onRowAddClick={onRowAddClick}
				onScrollToTopClick={handleScrollToTopClick}
				onScrollToBottomClick={handleScrollToBottomClick}
				onUndoClick={onUndo}
				onRedoClick={onRedo}
			/>
		</div>
	);
}
