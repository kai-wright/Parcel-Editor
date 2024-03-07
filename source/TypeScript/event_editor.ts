import { BaseEditorClass, inputProperties } from "./editor_base";
import { event_interface, resource_interface } from "./parcel_interfaces";
import { regex_hash_number, regex_id, regex_id_full, regex_name, regex_number } from "./regexes";

// Empty add id manager
const ADD_BUTTON = document.getElementById("add_event") as HTMLButtonElement;

const RESOURCE_PANEL = document.getElementById("show_panel") as HTMLDivElement;
const RESOURCE_INFORMATION = document.getElementById("resource_information") as HTMLDivElement;
const SAVED_INDICATOR = document.getElementById("saved_indicator") as HTMLDivElement;

// == Register editor ==
class EventEditorClass extends BaseEditorClass {
	public editorType: "event" = "event";
	public editorVersion: number = 1;

	public current: event_interface;

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

	generateEmptyParcel(id: number): event_interface {
		return {
			id: `#${id}`,
			type: "event",
			messages: [],
			action: [],
		};
	}

	create(): boolean {
		if (!this.confirmChangestateSave()) {
			console.log("Cannot create parcel, was unable to save currently loaded parcel");
			return false;
		}

		// Get a list of ids from this.events
		let existingIds = [];
		// New id is an ID that is not currently in use
		let newID = 1;

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
		for (let i = 0; i < this.events.length; i++) {
			const button = document.createElement("button");
			button.innerHTML = this.events[i];
			button.addEventListener("click", () => {
				console.log(`Loaded : ${this.events[i]}`);
				this.load(this.events[i]);
				this.renderResouceInformation();
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

		// On Unlock
		let onUnlockButton = document.createElement("button");
		onUnlockButton.innerHTML = "onUnlock Events";
		onUnlockButton.addEventListener("click", () => {
			trpanel.innerHTML = "";
			trpanel.append(this.generateOnUnlock());
		});
		tlpanel.append(onUnlockButton);
		// On Reach
		// Delete button
		bpanel.appendChild(this.generateDeleteButton(`${this.current.type}:${this.current.id}`));

		RESOURCE_INFORMATION.appendChild(tlpanel);
		RESOURCE_INFORMATION.appendChild(trpanel);
		RESOURCE_INFORMATION.appendChild(bpanel);
	}
}
// == Initialize editor ==
// Initialize editor, begin loading process and attach editor to window
const editor = new EventEditorClass();
editor.init();
window.editor = editor;

ADD_BUTTON.addEventListener("click", () => {
	editor.create();
});

SAVED_INDICATOR.addEventListener("click", () => {
	editor.save();
});

// =! Development Utilities =!
function generateExamples() {
	let names = [11, 22, 33, 44, 55, 66, 77, 88, 99];
	for (let i = 0; i < names.length; i++) {
		editor.current = editor.generateEmptyParcel(names[i]);
		editor.current.messages[0] = `Message for ${names[i]}`;
		editor.current.action[0] = ["resource:example", names[i]];
		editor.save();
	}
}
// generateExamples();
