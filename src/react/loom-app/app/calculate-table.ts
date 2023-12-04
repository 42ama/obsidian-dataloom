// export const calculateTableRowsHeight = (
// 	appEl: HTMLElement,
// 	defaultRowDisplay: DefaultRowDisplay
// ) => {
// 	// Get all row elements ('tr') from the table
// 	const rows = appEl.querySelectorAll(".dataloom-body > .dataloom-row");
// 	if (rows.length === 0) return 0;

// 	let numRowsToCalculate;
// 	if (defaultRowDisplay === "all") {
// 		numRowsToCalculate = rows.length;
// 	} else {
// 		numRowsToCalculate = defaultRowDisplay;
// 		if (numRowsToCalculate > rows.length) {
// 			numRowsToCalculate = rows.length;
// 		}
// 	}

// 	// Calculate the height of the first 5 rows
// 	let totalHeight = 0;
// 	for (let i = 0; i < numRowsToCalculate; i++) {
// 		const { height } = rows[i].getBoundingClientRect();
// 		totalHeight += height;
// 	}
// 	return totalHeight;
// };

export const calculateTableHeaderHeight = (appEl: HTMLElement) => {
	const headerEl = appEl.querySelector(".dataloom-header");
	if (!headerEl) return 0;
	const { height } = headerEl.getBoundingClientRect();
	return height;
};

export const calculateTableFooterHeight = (appEl: HTMLElement) => {
	const footerEl = appEl.querySelector(".dataloom-footer");
	if (!footerEl) return 0;
	const { height } = footerEl.getBoundingClientRect();
	return height;
};

export const calculateOptionBarHeight = (appEl: HTMLElement) => {
	const optionBarEl = appEl.querySelector(".dataloom-option-bar");
	if (!optionBarEl) return 0;
	const { height } = optionBarEl.getBoundingClientRect();
	return height;
};

export const calculateBottomBarHeight = (appEl: HTMLElement) => {
	const bottomBarEl = appEl.querySelector(".dataloom-bottom-bar");
	console.log(bottomBarEl);
	if (!bottomBarEl) return 0;
	const { height } = bottomBarEl.getBoundingClientRect();
	return height;
};

export const calculateTableRowsHeight = (defaultRowDisplay: number) => {
	return defaultRowDisplay * 38;
};
