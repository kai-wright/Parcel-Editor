import { BaseEditorClass } from "./editor_base";
import { structure_interface } from "./parcel_interfaces";
import { regex_id, regex_name } from "./regexes";
import { parcel_charges } from "./types";

// Empty add id manager
const ADD_ID = document.getElementById("resource_add_id") as HTMLInputElement;
const ADD_BUTTON = document.getElementById("resource_add_button") as HTMLButtonElement;

const RESOURCE_PANEL = document.getElementById("show_panel") as HTMLDivElement;
const RESOURCE_INFORMATION = document.getElementById("resource_information") as HTMLDivElement;
const SAVED_INDICATOR = document.getElementById("saved_indicator") as HTMLDivElement;

// == Register editor ==
class StructureEditorClass extends BaseEditorClass {
	public editorType = "structure" as const;
	public editorVersion: number = 1;

	public current: structure_interface;

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

	generateEmptyParcel(id: string, name: string): structure_interface {
		return {
			id: id,
			type: "structure",
			name: name,
			description: "",
			symbol: "",
			passive: 0,
			additives: [],
			multipliers: [],
			onUnlock: [],
			onReach: [],
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
		for (let i = 0; i < this.structures.length; i++) {
			const button = document.createElement("button");
			button.innerHTML = this.structures[i];
			button.addEventListener("click", () => {
				console.log(`Loaded : ${this.structures[i]}`);
				this.load(this.structures[i]);
				this.renderResouceInformation();
			});
			RESOURCE_PANEL.appendChild(button);
		}
	}

	renderResouceInformation() {
		// If this.current is undefined, return
		if (this.current === undefined) {
			console.warn("No structure loaded");
			return;
		}
		// Generate a set of inputs for the structure
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

		// Passive generation
		tlpanel.appendChild(this.generateNumberInput("passive", "Passive", ["notNegative"]));
		// Additive charges
		const additiveButton = document.createElement("button");
		additiveButton.innerHTML = "Additive charges";
		additiveButton.addEventListener("click", () => {
			this.generateChargesPanel(trpanel, "additives");
		});
		tlpanel.append(additiveButton);
		// Multiplicative charges
		const multiplicativeButton = document.createElement("button");
		multiplicativeButton.innerHTML = "Multiplicative charges";
		multiplicativeButton.addEventListener("click", () => {
			this.generateChargesPanel(trpanel, "multipliers");
		});
		tlpanel.append(multiplicativeButton);

		// On Unlock
		const onUnlockButton = document.createElement("button");
		onUnlockButton.innerHTML = "onUnlock Events";
		onUnlockButton.addEventListener("click", () => {
			this.generateOnUnlock(trpanel);
		});
		tlpanel.append(onUnlockButton);
		// On Reach
		const onReachButton = document.createElement("button");
		onReachButton.innerHTML = "onReach Events";
		onReachButton.addEventListener("click", () => {
			this.generateOnReach(trpanel);
		});
		tlpanel.append(onReachButton);
		// Delete button
		bpanel.appendChild(this.generateDeleteButton(`${this.current.type}:${this.current.id}`));

		RESOURCE_INFORMATION.appendChild(tlpanel);
		RESOURCE_INFORMATION.appendChild(trpanel);
		RESOURCE_INFORMATION.appendChild(bpanel);
	}
	generateChargesPanel(WRAPPER: HTMLDivElement, property: "additives" | "multipliers") {
		WRAPPER.innerHTML = "";
		WRAPPER.className = "chargeWrapper doubles";
		console.log("Rendering charges wrapper");

		if (this.current[property].length == 0) {
			const notice = document.createElement("h2");
			notice.innerHTML = `No ${property}`;
			WRAPPER.appendChild(notice);
		}

		for (const i in this.current[property]) {
			const inner_wrapper = document.createElement("div");

			const button = document.createElement("button");
			button.innerHTML = `Charge ${i}`;
			button.addEventListener("click", () => {
				this.generateChargeEditingPanel(WRAPPER, this.current[property][i]);
			});
			inner_wrapper.append(button);

			const inputDelete = document.createElement("button");
			inputDelete.innerHTML = "X";
			inputDelete.addEventListener("click", () => {
				this.current[property].splice(Number(i), 1);
				this.delayedSave();
				this.generateChargesPanel(WRAPPER, property);
			});

			inner_wrapper.append(inputDelete);
			WRAPPER.append(inner_wrapper);
		}

		const add_button = document.createElement("button");
		add_button.className = "add";
		add_button.innerHTML = "Add new onReach event";
		add_button.addEventListener("click", () => {
			this.current[property].push([[], 0]);
			this.delayedSave();
			this.generateChargesPanel(WRAPPER, property);
		});
		WRAPPER.append(add_button);
	}
	generateChargeEditingPanel(WRAPPER: HTMLDivElement, target: parcel_charges) {
		WRAPPER.innerHTML = "";
		console.log(`Editing charge ${target[0]}`);
		return;
	}
}
// == Initialize editor ==
// Initialize editor, begin loading process and attach editor to window
const editor = new StructureEditorClass();
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
	editor.saveExportData("current")
})

const EXPORT_ALL_BUTTON = document.getElementById("export_all") as HTMLButtonElement;
EXPORT_ALL_BUTTON.addEventListener("click", () => {
	editor.saveExportData("editor");
});