import { BaseEditorClass, inputProperties } from "./editor_base";
import { research_interface, resource_interface } from "./parcel_interfaces";
import { regex_id, regex_id_full, regex_name, regex_number } from "./regexes";

// Empty add id manager
const ADD_ID = document.getElementById("resource_add_id") as HTMLInputElement;
const ADD_BUTTON = document.getElementById("resource_add_button") as HTMLButtonElement;

const RESOURCE_PANEL = document.getElementById("show_panel") as HTMLDivElement;
const RESOURCE_INFORMATION = document.getElementById("resource_information") as HTMLDivElement;
const SAVED_INDICATOR = document.getElementById("saved_indicator") as HTMLDivElement;

// == Register editor ==
class ResearchEditorClass extends BaseEditorClass {
	public editorType: "research" = "research";
	public editorVersion: number = 1;

	public current: research_interface;

	init() {
		super.init();
		this.renderResourcePanel();
		this.updateSaveStatus();
	}

	update() {
		super.update();
		this.renderResourcePanel();
		this.updateSaveStatus();
	}

	generateEmptyParcel(id: string, name: string): research_interface {
		return {
			id: id,
			type: "research",
			name: name,
			description: "",
			symbol: "",
			researched: false,
			onUnlock: [],
		};
	}

	create(): boolean {
		if (!this.confirmChangestateSave()) {
			console.log("Cannot create parcel, was unable to save currently loaded parcel");
			return false;
		}
		if (!regex_id.test(ADD_ID.value)) {
			alert("Invalid ID");
			return false;
		}

		this.current = this.generateEmptyParcel(ADD_ID.value, ADD_ID.value.replace("_", " "));
		ADD_ID.value = "";
		this.save();
		console.log(`Created ${this.current.id}`);

		this.update();

		return true;
	}

	updateSaveStatus(): void {
		if (this.current === undefined) {
			SAVED_INDICATOR.className = "undefined";
			return;
		} else if (this.isSaved) {
			SAVED_INDICATOR.className = "saved";
			return;
		} else if (!this.isError && this.checkValidToSave()) {
			SAVED_INDICATOR.className = "unsaved";
			return;
		} else {
			SAVED_INDICATOR.className = "error";
			return;
		}
	}

	checkAllInputValidity(): boolean {
		const inputs = RESOURCE_INFORMATION.getElementsByTagName("input");
		for (const i in inputs) {
			if (inputs[i].reportValidity && !inputs[i].reportValidity()) {
				return false;
			}
		}
		return true;
	}

	checkValidToSave(): boolean {
		if (!super.checkValidToSave()) {
			return false;
		}
		if (!regex_id.test(this.current.id)) {
			console.warn(`Given invalid ID: ${this.current.id} to save`);
			this.isError = true;
			this.updateSaveStatus();
			return false;
		}
		if (!regex_name.test(this.current.name)) {
			console.warn(`Given invalid Name: ${this.current.name} to save`);
			this.isError = true;
			this.updateSaveStatus();
			return false;
		}
		return true;
	}

	clearRender() {
		RESOURCE_PANEL.innerHTML = "";
		RESOURCE_INFORMATION.innerHTML = "";
		this.renderResourcePanel();
	}

	renderResourcePanel() {
		RESOURCE_PANEL.innerHTML = "";
		for (let i = 0; i < this.research.length; i++) {
			const button = document.createElement("button");
			button.innerHTML = this.research[i];
			button.addEventListener("click", () => {
				console.log(`Loaded : ${this.research[i]}`);
				this.load(this.research[i]);
				this.renderResouceInformation();
			});
			RESOURCE_PANEL.appendChild(button);
		}
	}

	renderResouceInformation() {
		// If this.current is undefined, return
		if (this.current === undefined) {
			console.warn("No research loaded");
			return;
		}
		// Generate a set of inputs for the research
		RESOURCE_INFORMATION.innerHTML = "";

		const tlpanel = document.createElement("div") as HTMLDivElement;
		tlpanel.id = "tlpanel";
		const trpanel = document.createElement("div") as HTMLDivElement;
		trpanel.id = "trpanel";
		const bpanel = document.createElement("div") as HTMLDivElement;
		bpanel.id = "bpanel";

		// ID
		tlpanel.appendChild(this.generateTextInput("id", "ID", ["notEmpty", "regexId", "readonly"]));
		// Name
		tlpanel.appendChild(this.generateTextInput("name", "Name", ["spellcheck", "notEmpty", "regexName"]));
		// Symbol
		tlpanel.appendChild(this.generateTextInput("symbol", "Symbol"));
		// Description
		tlpanel.appendChild(this.generateTextArea("description", "Description", ["spellcheck"]));
		// On Unlock
		let onUnlockButton = document.createElement("button");
		onUnlockButton.innerHTML = "onUnlock Events";
		onUnlockButton.addEventListener("click", () => {
			this.generateOnUnlock(trpanel);
		});
		tlpanel.append(onUnlockButton);

		// Delete button
		bpanel.appendChild(this.generateDeleteButton(`${this.current.type}:${this.current.id}`));

		RESOURCE_INFORMATION.appendChild(tlpanel);
		RESOURCE_INFORMATION.appendChild(trpanel);
		RESOURCE_INFORMATION.appendChild(bpanel);
	}
}
// == Initialize editor ==
// Initialize editor, begin loading process and attach editor to window
const editor = new ResearchEditorClass();
editor.init();
window.editor = editor;

ADD_ID.addEventListener("input", () => {
	if (ADD_ID.value === "") {
		ADD_ID.classList.add("empty");
	} else {
		ADD_ID.classList.remove("empty");
	}
});
ADD_BUTTON.addEventListener("click", () => {
	editor.create();
});

SAVED_INDICATOR.addEventListener("click", () => {
	editor.save();
});

// Exports

const EXPORT_BUTTON = document.getElementById("export_current") as HTMLButtonElement;
EXPORT_BUTTON.addEventListener("click", () => {
	editor.saveExportData("current");
});

const EXPORT_ALL_BUTTON = document.getElementById("export_all") as HTMLButtonElement;
EXPORT_ALL_BUTTON.addEventListener("click", () => {
	editor.saveExportData("editor");
});

// =! Development Utilities =!
function generateExamples() {
	let names = ["mine_iron", "mine_copper", "mine_gold", "smelting_iron", "smelting_copper", "smelting_gold"];
	for (let i = 0; i < names.length; i++) {
		editor.current = editor.generateEmptyParcel(`example_${names[i]}`, names[i].replace("_", " "));
		editor.save();
	}
}
// generateExamples();
