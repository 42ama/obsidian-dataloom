import React, { useState, useRef, useEffect, useCallback } from "react";

import Menu from "../Menu";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
import MultiTagCell from "../MultiTagCell";
import TagMenu from "../TagMenu";

import { useForceUpdate } from "../../services/utils";

import { CELL_TYPE } from "../../constants";

import "./styles.css";

export default function EditableTd({
	cellId = "",
	width = "",
	text = "",
	tags = [],
	type = "",
	onRemoveTagClick = null,
	onTagClick = null,
	onSaveText = null,
	onAddTag = null,
}) {
	const [inputText, setInputText] = useState("");

	const tdRef = useRef();

	const forceUpdate = useForceUpdate();

	const initialClickCell = {
		top: 0,
		left: 0,
		height: 0,
	};
	const [clickedCell, setClickedCell] = useState(initialClickCell);

	useEffect(() => {
		if (clickedCell.height > 0) forceUpdate();
	}, [clickedCell.height, forceUpdate]);

	const textAreaRef = useCallback(
		(node) => {
			if (type === CELL_TYPE.TEXT || type === CELL_TYPE.NUMBER)
				if (node) {
					node.selectionStart = inputText.length;
					node.selectionEnd = inputText.length;
				}
		},
		[type, inputText.length]
	);

	useEffect(() => {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
				setInputText(text);
				break;
			default:
				break;
		}
	}, [type, text]);

	function handleCellClick(e) {
		if (clickedCell.height > 0) return;

		const { x, y, height } = tdRef.current.getBoundingClientRect();
		setClickedCell({ top: y, left: x, height });
	}

	function handleAddTag(text) {
		onAddTag(cellId, text);
		setInputText("");
		setClickedCell(initialClickCell);
	}

	function handleTagClick(tagId) {
		onTagClick(cellId, tagId);
		setClickedCell(initialClickCell);
	}

	function handleOutsideClick() {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
				onSaveText(inputText);
				break;
			case CELL_TYPE.TAG:
				if (inputText !== "") {
					onAddTag(cellId, inputText);
					setInputText("");
				}
				break;
			case CELL_TYPE.MULTI_TAG:
				// if (text !== "") {
				// 	//Check if current text exists as a tag, otherwise add it,
				// 	const found = tags.find((tag) => tag.content === text);
				// 	if (!found) {
				// 		onSaveClick("", [initialTag(text), ...tags]);
				// 		setInputText("");
				// 		break;
				// 	}
				// }
				// onSaveClick("", tags);
				break;
			default:
				break;
		}
		setClickedCell(initialClickCell);
	}

	function handleMultiTagClick(id) {}

	function handleAddMultiTag(text) {
		// //If already exists then return
		// const tag = tags.find((tag) => tag.content === text);
		// if (tag !== undefined) return;
		// setTags((prevState) => [initialTag(text), ...prevState]);
		// setInputText("");
	}

	function renderCell() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return <TextCell content={inputText} />;
			case CELL_TYPE.NUMBER:
				return <TextCell content={inputText} />;
			case CELL_TYPE.TAG:
				const tag = tags.find((tag) => tag.selected.includes(cellId));
				return (
					<TagCell
						content={tag !== undefined ? tag.content : ""}
						hide={tag === undefined}
					/>
				);
			case CELL_TYPE.MULTI_TAG:
				return <MultiTagCell tags={tags} />;
			default:
				return <></>;
		}
	}

	function renderCellMenu() {
		switch (type) {
			case CELL_TYPE.TEXT:
				return (
					<textarea
						className="NLT__input"
						ref={textAreaRef}
						autoFocus
						value={inputText}
						onChange={(e) =>
							setInputText(e.target.value.replace("\n", ""))
						}
					/>
				);
			case CELL_TYPE.NUMBER:
				return (
					<input
						className="NLT__input NLT__input--number"
						type="number"
						autoFocus
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
					/>
				);
			case CELL_TYPE.TAG:
				return (
					<TagMenu
						cellId={cellId}
						tags={tags}
						text={inputText}
						onAddTag={handleAddTag}
						onTextChange={(e) => setInputText(e.target.value)}
						onRemoveTagClick={onRemoveTagClick}
						onTagClick={handleTagClick}
					/>
				);
			case CELL_TYPE.MULTI_TAG:
				return (
					<TagMenu
						cellId={cellId}
						tags={tags}
						text={inputText}
						onAddTag={handleAddMultiTag}
						onTextChange={(e) => setInputText(e.target.value)}
						onTagClick={handleMultiTagClick}
					/>
				);
			default:
				return <></>;
		}
	}

	function getMenuWidth() {
		switch (type) {
			case CELL_TYPE.TAG:
			case CELL_TYPE.MULTI_TAG:
				return "fit-content";
			default:
				return tdRef.current ? tdRef.current.offsetWidth : 0;
		}
	}

	function getMenuHeight() {
		switch (type) {
			case CELL_TYPE.NUMBER:
				return "2rem";
			case CELL_TYPE.TAG:
			case CELL_TYPE.MULTI_TAG:
				return "fit-content";
			default:
				return clickedCell.height;
		}
	}

	let tdClassName = "NLT__td";
	if (type === CELL_TYPE.NUMBER) tdClassName += " NLT__td--number";

	return (
		<td
			className={tdClassName}
			ref={tdRef}
			style={{ maxWidth: width }}
			onClick={handleCellClick}
		>
			{renderCell()}
			<Menu
				hide={clickedCell.height === 0}
				style={{
					minWidth: type === CELL_TYPE.TEXT ? "11rem" : 0,
					width: getMenuWidth(),
					top: clickedCell.top,
					left: clickedCell.left,
					height: getMenuHeight(),
				}}
				content={renderCellMenu()}
				onOutsideClick={handleOutsideClick}
			/>
		</td>
	);
}
