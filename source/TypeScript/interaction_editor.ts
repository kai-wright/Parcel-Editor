import { BaseEditorClass } from "./editor_base";
import { interaction_interface } from "./parcel_interfaces";
import { regex_hash_number } from "./regexes";

// Empty add id manager
const ADD_BUTTON = document.getElementById("add_event") as HTMLButtonElement;

const RESOURCE_PANEL = document.getElementById("show_panel") as HTMLDivElement;
const RESOURCE_INFORMATION = document.getElementById("resource_information") as HTMLDivElement;
const SAVED_INDICATOR = document.getElementById("saved_indicator") as HTMLDivElement;

// == Register editor ==
class InteractionEditorClass extends BaseEditorClass {
	public editorType = "interaction" as const;
	public editorVersion: number = 1;

	public current: interaction_interface;

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

	generateEmptyParcel(id: number): interaction_interface {
		return {
			id: `#${id}`,
			type: "interaction",
			comment: "",
			result: [],
			requires: [],
			consumes: [],
		};
	}

	create(): boolean {
		if (!this.confirmChangestateSave()) {
			console.log("Cannot create parcel, was unable to save currently loaded parcel");
			return false;
		}

		// Get a list of ids from this.interactions
		const existingIds = this.interactions.map((elem) => Number(elem.split("#")[1]));
		// New id is an ID that is not currently in use
		let newID = 1;
		let isNewID = false;

		while (!isNewID) {
			if (existingIds.includes(newID)) {
				newID++;
			} else {
				isNewID = true;
			}
		}

		this.current = this.generateEmptyParcel(newID);

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
		if (!regex_hash_number.test(this.current.id)) {
			console.warn(`Given invalid ID: ${this.current.id} to save`);
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
		for (let i = 0; i < this.interactions.length; i++) {
			const button = document.createElement("button");
			button.innerHTML = this.interactions[i];
			button.addEventListener("click", () => {
				console.log(`Loaded : ${this.interactions[i]}`);
				this.load(this.interactions[i]);
				this.renderResouceInformation();
				this.updateSaveStatus();
			});
			RESOURCE_PANEL.appendChild(button);
		}
	}

	renderResouceInformation() {
		// If this.current is undefined, return
		if (this.current === undefined) {
			console.warn("No resource loaded");
			return;
		}
		// Generate a set of inputs for the resource
		RESOURCE_INFORMATION.innerHTML = "";

		const tlpanel = document.createElement("div") as HTMLDivElement;
		tlpanel.id = "tlpanel";
		const trpanel = document.createElement("div") as HTMLDivElement;
		trpanel.id = "trpanel";
		const bpanel = document.createElement("div") as HTMLDivElement;
		bpanel.id = "bpanel";

		// ID
		tlpanel.appendChild(this.generateTextInput("id", "ID", ["notEmpty", "readonly"]));
		// Comment
		tlpanel.appendChild(this.generateTextArea("comment", "Comment", ["spellcheck"]));

		// Result (add/remove resources)
		const result_button = document.createElement("button");
		result_button.innerHTML = "result";
		result_button.addEventListener("click", () => {
			this.generateQuantityPanel("result", trpanel);
		});
		tlpanel.appendChild(result_button);
		// Requires (add/remove resources)
		const requires_button = document.createElement("button");
		requires_button.innerHTML = "requires";
		requires_button.addEventListener("click", () => {
			this.generateQuantityPanel("requires", trpanel);
		});
		tlpanel.appendChild(requires_button);
		// Consumes (add/remove resources)
		const consumes_button = document.createElement("button");
		consumes_button.innerHTML = "consumes";
		consumes_button.addEventListener("click", () => {
			this.generateQuantityPanel("consumes", trpanel);
		});
		tlpanel.appendChild(consumes_button);

		// Delete button
		bpanel.appendChild(this.generateDeleteButton(`${this.current.type}:${this.current.id}`));

		RESOURCE_INFORMATION.appendChild(tlpanel);
		RESOURCE_INFORMATION.appendChild(trpanel);
		RESOURCE_INFORMATION.appendChild(bpanel);
	}
}
// == Initialize editor ==
// Initialize editor, begin loading process and attach editor to window
const editor = new InteractionEditorClass();
editor.init();
window.editor = editor;

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
