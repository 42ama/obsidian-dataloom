import { TableState } from "src/services/tableState/types";
import { MARKDOWN_LIST_ITEM_REGEX } from "../constants";
import { ImportType } from "../types";
import { addRow } from "src/services/tableState/row";
import { CellNotFoundError } from "src/services/tableState/error";

export const getDisplayNameForImportType = (type: ImportType) => {
	switch (type) {
		case ImportType.MARKDOWN_LIST:
			return "Markdown list";
		default:
			return "";
	}
};

export const validateMarkdownList = (text: string) => {
	const lines = text.split("\n");
	return lines.every((line) => line.match(MARKDOWN_LIST_ITEM_REGEX));
};

export const getMarkdownListItems = (text: string) => {
	const lines = text.split("\n");
	return lines.map((line) => line.trim().replace("-", "").trim());
};

export const importMarkdownListItems = (
	listItems: string[],
	columnId: string,
	state: TableState
): TableState => {
	let stateCopy = structuredClone(state);

	//For each list item add a new row
	for (let i = 0; i < listItems.length; i++) stateCopy = addRow(stateCopy);

	const { bodyRows, bodyCells } = stateCopy.model;

	listItems.forEach((item, i) => {
		const row = bodyRows[bodyRows.length - listItems.length + i];
		const cell = bodyCells.find(
			(cell) => cell.columnId === columnId && cell.rowId === row.id
		);
		if (!cell) throw new CellNotFoundError();
		//Now update the markdown of the corresponding body cell with the list item
		cell.markdown = item;
	});

	return stateCopy;
};
