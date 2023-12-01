import { PluginSettingTab, App } from "obsidian";
import { Setting } from "obsidian";
import DataLoomPlugin, { DefaultRowDisplay } from "../main";
import { renderBuyMeACoffeeBadge } from "./shared";

export default class DataLoomSettingsTab extends PluginSettingTab {
	plugin: DataLoomPlugin;

	constructor(app: App, plugin: DataLoomPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.renderSupportHeader(containerEl);
		this.renderFileSettings(containerEl);
		this.renderTableSettings(containerEl);
		this.renderExportSettings(containerEl);
		this.renderEmbeddedLoomSettings(containerEl);
		this.renderModalSettings(containerEl);
		this.renderDebugSettings(containerEl);
	}

	private renderSupportHeader(containerEl: HTMLElement) {
		new Setting(containerEl).setName("DataLoom").setHeading();

		const supportDesc = new DocumentFragment();
		supportDesc.createDiv({
			text: "Enjoying the plugin? Please buy me an herbal tea to support the development of DataLoom.",
		});

		new Setting(containerEl).setDesc(supportDesc);

		renderBuyMeACoffeeBadge(containerEl);
		const spacing = containerEl.createDiv();
		spacing.style.marginBottom = "0.75em";
	}

	private renderFileSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("File").setHeading();

		//Attachments folder
		const attachmentsFolderDesc = new DocumentFragment();
		attachmentsFolderDesc.createDiv({
			text: "Create looms in the attachments folder defined in the Obsidian settings.",
		});
		attachmentsFolderDesc.createSpan({
			text: "This can be changed in",
		});

		attachmentsFolderDesc.createSpan({
			text: " Files & Links -> Default location for new attachments",
			cls: "dataloom-modal-text--emphasize",
		});
		attachmentsFolderDesc.createEl("br");
		attachmentsFolderDesc.createDiv({
			text: "Otherwise, the folder location below will be used",
		});

		new Setting(containerEl)
			.setName("Create looms in the attachments folder")
			.setDesc(attachmentsFolderDesc)
			.addToggle((cb) => {
				cb.setValue(
					this.plugin.settings.createAtObsidianAttachmentFolder
				).onChange(async (value) => {
					this.plugin.settings.createAtObsidianAttachmentFolder =
						value;
					await this.plugin.saveSettings();
					this.display();
				});
			});

		//Folder location
		const defaultLocationDesc = new DocumentFragment();
		defaultLocationDesc.createSpan({
			text: "Where newly created looms are placed. Default location is the vault root folder, if not specified.",
		});

		if (this.plugin.settings.createAtObsidianAttachmentFolder === false) {
			new Setting(containerEl)
				.setName("Default location for new looms")
				.setDesc(defaultLocationDesc)
				.addText((cb) => {
					cb.setValue(
						this.plugin.settings.customFolderForNewFiles
					).onChange(async (value) => {
						this.plugin.settings.customFolderForNewFiles = value;
						await this.plugin.saveSettings();
					});
				});
		}
	}

	private renderTableSettings(containerEl: HTMLElement) {
		const freezeColumnsDesc = new DocumentFragment();
		freezeColumnsDesc.createSpan({
			text: "The number of columns to stay in place when the table scrolls horizontally.",
		});

		new Setting(containerEl).setName("Table").setHeading();
		new Setting(containerEl)
			.setName("Frozen columns")
			.setDesc(freezeColumnsDesc)
			.addDropdown((cb) => {
				cb.addOptions({
					"0": "0",
					"1": "1",
					"2": "2",
					"3": "3",
				})
					.setValue(
						this.plugin.settings.defaultFrozenColumnCount.toString()
					)
					.onChange(async (value) => {
						this.plugin.settings.defaultFrozenColumnCount =
							parseInt(value);
						await this.plugin.saveSettings();
					});
			});
	}

	private renderExportSettings(containerEl: HTMLElement) {
		const removeMarkdownOnExportDesc = new DocumentFragment();
		removeMarkdownOnExportDesc.createSpan({
			text: "If enabled, content will be exported as plain text instead of markdown. For example, if enabled, a checkbox cell's content will be exported true or false instead of [ ] or [x].",
		});

		new Setting(containerEl).setName("Export").setHeading();
		new Setting(containerEl)
			.setName("Remove markdown")
			.setDesc(removeMarkdownOnExportDesc)
			.addToggle((cb) => {
				cb.setValue(
					this.plugin.settings.removeMarkdownOnExport
				).onChange(async (value) => {
					this.plugin.settings.removeMarkdownOnExport = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private renderEmbeddedLoomSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Embedded looms").setHeading();

		const defaultRowDisplayDesc = new DocumentFragment();
		defaultRowDisplayDesc.createSpan({
			text: "The number of rows that should be displayed",
		});

		new Setting(containerEl)
			.setName("Default row display")
			.setDesc(defaultRowDisplayDesc)
			.addDropdown((cb) => {
				cb.addOptions({
					"5": "5",
					"10": "10",
					"25": "25",
					"50": "50",
					all: "all",
				})
					.setValue(this.plugin.settings.defaultRowDisplay.toString())
					.onChange(async (value) => {
						if (value === "all") {
							this.plugin.settings.defaultRowDisplay = value;
						} else {
							this.plugin.settings.defaultRowDisplay = parseInt(
								value
							) as DefaultRowDisplay;
						}
						await this.plugin.saveSettings();
					});
			});
	}

	private renderModalSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Modal").setHeading();
		new Setting(containerEl)
			.setName("Release notes")
			.setDesc(
				"Display release notes the first time a loom file is opened after the plugin is updated."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.showWhatsNewModal).onChange(
					async (value) => {
						this.plugin.settings.showWhatsNewModal = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}

	private renderDebugSettings(containerEl: HTMLElement) {
		new Setting(containerEl).setName("Debug").setHeading();
		new Setting(containerEl)
			.setName("Debug mode")
			.setDesc(
				"Turns on console.log for plugin events. This is useful for troubleshooting."
			)
			.addToggle((cb) => {
				cb.setValue(this.plugin.settings.shouldDebug).onChange(
					async (value) => {
						this.plugin.settings.shouldDebug = value;
						await this.plugin.saveSettings();
					}
				);
			});
	}
}
