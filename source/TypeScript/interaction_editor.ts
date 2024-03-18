import { BaseEditorClass } from "./editor_base";
import { event_interface } from "./parcel_interfaces";
import { regex_hash_number } from "./regexes";

// Empty add id manager
const ADD_BUTTON = document.getElementById("add_event") as HTMLButtonElement;

const RESOURCE_PANEL = document.getElementById("show_panel") as HTMLDivElement;
const RESOURCE_INFORMATION = document.getElementById("resource_information") as HTMLDivElement;
const SAVED_INDICATOR = document.getElementById("saved_indicator") as HTMLDivElement;

// == Register editor ==
class EventEditorClass extends BaseEditorClass {
	public editorType = "event" as const;
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
			comment: "",
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
		const existingIds = this.events.map((elem) => Number(elem.split("#")[1]));
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
		for (let i = 0; i < this.events.length; i++) {
			const button = document.createElement("button");
			button.innerHTML = this.events[i];
			button.addEventListener("click", () => {
				console.log(`Loaded : ${this.events[i]}`);
				this.load(this.events[i]);
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

		// Messages (add/remove messages)
		const messages_button = document.createElement("button");
		messages_button.innerHTML = "messages";
		tlpanel.appendChild(messages_button);
		messages_button.addEventListener("click", () => {
			this.renderMessagePanel();
		});

		// Actions (add/remove resources)
		const actions_button = document.createElement("button");
		actions_button.innerHTML = "actions";
		tlpanel.appendChild(actions_button);
		actions_button.addEventListener("click", () => {
			this.renderQuantityPanel();
		});

		// Delete button
		bpanel.appendChild(this.generateDeleteButton(`${this.current.type}:${this.current.id}`));

		RESOURCE_INFORMATION.appendChild(tlpanel);
		RESOURCE_INFORMATION.appendChild(trpanel);
		RESOURCE_INFORMATION.appendChild(bpanel);
	}
	renderQuantityPanel() {
		console.log("Rendering Quantity Panel");
		const trpanel = document.getElementById("trpanel")! as HTMLDivElement;
		this.generateQuantityPanel("action", trpanel);
	}
	renderMessagePanel() {
		const trpanel = document.getElementById("trpanel")!;
		trpanel.innerHTML = "";
		trpanel.className = "messages doubles";

		if (this.current.messages.length == 0) {
			const notice = document.createElement("h2");
			notice.innerHTML = "No messages";
			trpanel.appendChild(notice);
		}

		for (const i in this.current.messages) {
			const wrapper = document.createElement("div");

			const input = document.createElement("textarea") as HTMLTextAreaElement;
			input.value = this.current.messages[i];
			input.addEventListener("change", () => {
				this.current.messages[i] = input.value;
				this.delayedSave();
			});
			const inputDelete = document.createElement("button");
			inputDelete.innerHTML = "X";
			inputDelete.addEventListener("click", () => {
				this.current.messages.splice(Number(i), 1);
				this.renderMessagePanel();
				this.delayedSave();
			});

			wrapper.appendChild(input);
			wrapper.appendChild(inputDelete);
			trpanel.appendChild(wrapper);
		}

		const add_button = document.createElement("button");
		add_button.className = "add";
		add_button.innerHTML = "Add new message";
		add_button.addEventListener("click", () => {
			this.current.messages.push("");
			this.renderMessagePanel();
		});
		trpanel.append(add_button);
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

// Exports

const EXPORT_BUTTON = document.getElementById("export_current") as HTMLButtonElement;
EXPORT_BUTTON.addEventListener("click", () => {
	editor.saveExportData("current");
});

const EXPORT_ALL_BUTTON = document.getElementById("export_all") as HTMLButtonElement;
EXPORT_ALL_BUTTON.addEventListener("click", () => {
	editor.saveExportData("editor");
});