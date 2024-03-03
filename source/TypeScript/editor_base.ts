import { editor_version } from "./logging";
import { resource_interface, structure_interface, research_interface, unique_interface, interaction_interface } from "./parcel_interfaces";
import { regex_id_full } from "./regexes";
import { full_id, id, invalid_register } from "./types";

export type inputProperties = "spellcheck" | "notEmpty" | "readonly" | "regexId" | "regexName" | "notZero" | "notNegative";

export abstract class BaseEditorClass {
	abstract editorType: "resource" | "structure" | "research" | "unique" | "interaction" | "event"; // Type of object this editor edits
	abstract editorVersion: number; // Version of this specific editor
	private saveTimeout: number | undefined;
	public isSaved: boolean = true;

	// The object currently loaded in the editor. Each editor chooses a single type to edit
	public current: resource_interface | structure_interface | research_interface | unique_interface | interaction_interface | undefined;

	// List of all parcels information
	public parcels: full_id[] = [];
	// List of each type of parcel
	public resources: full_id[] = [];
	public structures: full_id[] = [];
	public research: full_id[] = [];
	public unique: full_id[] = [];

	// List of interactions and events
	public interactions: full_id[] = [];
	public events: full_id[] = [];

	init() {
		console.log(
			`Parcel Editor Version ${editor_version} - Starting up.\nLoading ${this.editorType} editor - Version ${this.editorVersion}`
		);
		this.checkStorage();
		this.logStorageCount();
		this.logStorage();
	}

	update() {
		this.checkStorage();
	}

	checkStorage() {
		this.parcels = [];
		for (let i = 0; i < localStorage.length; i++) {
			if (!regex_id_full.test(localStorage.key(i) as string)) {
				continue;
			}
			this.parcels.push(localStorage.key(i) as full_id);
		}
		this.sortStorage();
	}
	private sortStorage(): void {
		this.parcels.sort((a, b) => a.localeCompare(b));
		// Assign all "resource:" to this.resources
		this.resources = this.parcels.filter((id) => id.startsWith("resource:"));
		// Assign all "structure:" to this.structures
		this.structures = this.parcels.filter((id) => id.startsWith("structure:"));
		// Assign all "research:" to this.research
		this.research = this.parcels.filter((id) => id.startsWith("research:"));
		// Assign all "unique:" to this.unique
		this.unique = this.parcels.filter((id) => id.startsWith("unique:"));
		// Assign all "interaction:" to this.interactions
		this.interactions = this.parcels.filter((id) => id.startsWith("interaction:"));
		// Assign all "event:" to this.events
		this.events = this.parcels.filter((id) => id.startsWith("event:"));
	}
	logStorage() {
		console.table({
			Resources: this.resources,
			Structures: this.structures,
			Research: this.research,
			Unique: this.unique,
			Interactions: this.interactions,
			Events: this.events,
		});
	}
	logStorageCount() {
		console.table({
			Total: [this.parcels.length],
			Resources: [this.resources.length],
			Structures: [this.structures.length],
			Research: [this.research.length],
			Unique: [this.unique.length],
			Interactions: [this.interactions.length],
			Events: [this.events.length],
		});
	}
	save() {
		if (!this.checkValidToSave()) {
			console.warn("Parcel is not valid and cannot be saved");
			// Fail
			return false;
		}

		// Get the full id
		const fullId = `${this.editorType}:${this.current!.id}`;
		// Clear delayed saving
		if (this.saveTimeout) {
			clearTimeout(this.saveTimeout); // Clear the previous timeout if it exists
		}
		// Save it
		localStorage.setItem(fullId, JSON.stringify(this.current));
		// Update saved state and saved status
		this.isSaved = true;
		this.updateSaveStatus();
		// Log saved
		console.info(`Saved ${fullId}`);
		// Success
		return true;
	}
	checkValidToSave(): boolean {
		if (this.current === undefined) {
			console.warn("No parcel loaded, not saving");
			return false;
		}
		const fullId = `${this.editorType}:${this.current.id}`;
		// Validate the full id
		if (!regex_id_full.test(fullId)) {
			console.warn(`Given invalid full ID: ${fullId} to save`);
			return false;
		}
		// All checks passed
		return true;
	}
	delayedSave() {
		this.isSaved = false; // Reset isSaved to false
		if (this.saveTimeout) {
			clearTimeout(this.saveTimeout); // Clear the previous timeout if it exists
		}
		this.saveTimeout = window.setTimeout(() => {
			this.save();
		}, 5000);
		this.updateSaveStatus();
	}
	abstract updateSaveStatus(): void;

	confirmChangestateSave(): boolean {
		if (this.current === undefined) {
			// If there is nothing to save, we can continue
			return true;
		}
		if (!this.save()) {
			if (confirm("Unable to save, are you sure you would like to continue?")) {
				// Unable to save but continue anyway
				return true;
			} else {
				// Unable to save, not continuing
				return false;
			}
		} else {
			// Saved and can continue
			return true;
		}
	}

	load(full_id: full_id): boolean {
		if (!this.confirmChangestateSave()) {
			// Has object loaded, isn't saved, and cannot be saved for some reason.
			// User does not want to continue
			return false;
		}
		// If the ID is invalid, don't load
		if (regex_id_full.test(full_id) === false) {
			console.warn(`Given invalid full ID: ${full_id} to load`);
			return false;
		}
		// If this is the wrong type of editor, don't load
		if (full_id.startsWith(this.editorType) === false) {
			console.warn(`Given wrong editor type: ${full_id} to load\n Expected: ${this.editorType}`);
			return false;
		}
		// Load it from storage into tempParcel
		let tempParcel = JSON.parse(localStorage.getItem(full_id) as string);

		// If it doesn't exist, don't load
		if (tempParcel === null) {
			console.warn(`Given parcel doesn't exist: ${full_id} to load`);
			return false;
		}

		let baseParcel = this.generateEmptyParcel(tempParcel.id, "Undefined Name");
		Object.assign(baseParcel, tempParcel);

		this.current = baseParcel;

		return true;
	}

	abstract generateEmptyParcel(
		id: id,
		name: string
	): resource_interface | structure_interface | research_interface | unique_interface | interaction_interface;

	abstract create();

	delete(full_id) {
		if (regex_id_full.test(full_id) === false) {
			console.warn(`Given invalid full ID: ${full_id} to delete`);
			return false;
		}
		if (this.current !== undefined && `${this.current.type}:${this.current.id}` === full_id) {
				this.current = undefined;
				this.clearRender();
		}
		localStorage.removeItem(full_id);
		console.log(`Deleted ${full_id}`);
		this.update();
		return true;
	}

	abstract clearRender();

	registerInvalid(full_id) {
		if (regex_id_full.test(full_id) === false) {
			console.warn(`Given invalid full ID: ${full_id} to register as invalid`);
			return false;
		}
		let knownInvalids: invalid_register[] = JSON.parse(localStorage.getItem("editor_knownInvalids") || "[]") as invalid_register[];
		knownInvalids.push([full_id, true]);
		return true;
	}

	public generateTextInput(property: string, property_name: string, properties: inputProperties[] = []): HTMLDivElement {
		const wrapper = document.createElement("div");

		const label = document.createElement("label");
		label.innerHTML = property_name;

		const text = document.createElement("input");
		text.value = this.current![property];
		text.addEventListener("input", () => {
			this.current![property] = text.value;
			this.delayedSave();
		});

		// Special properties
		if (properties.includes("spellcheck")) {
			text.spellcheck = true;
		}
		if (properties.includes("notEmpty")) {
			text.minLength = 1;
			text.required = true;
		}
		if (properties.includes("readonly")) {
			text.readOnly = true;
		}
		if (properties.includes("regexId")) {
			text.pattern = "[a-z]([a-z_]*[a-z])?";
		} else if (properties.includes("regexName")) {
			text.pattern = "[a-zA-Z](?:[a-zA-Z ]*[a-zA-Z])?";
		}

		wrapper.appendChild(label);
		wrapper.appendChild(text);

		return wrapper;
	}
	public generateTextArea(property: string, property_name: string, properties: inputProperties[] = []): HTMLDivElement {
		const wrapper = document.createElement("div");

		const label = document.createElement("label");
		label.innerHTML = property_name;

		const text = document.createElement("textarea");
		text.value = this.current![property];
		text.rows = 4;
		text.addEventListener("input", () => {
			this.current![property] = text.value;
			this.delayedSave();
		});

		// Special properties
		if (properties.includes("spellcheck")) {
			text.spellcheck = true;
		}
		if (properties.includes("notEmpty")) {
			text.minLength = 1;
			text.required = true;
		}
		if (properties.includes("readonly")) {
			text.readOnly = true;
		}

		wrapper.appendChild(label);
		wrapper.appendChild(text);

		return wrapper;
	}
	public generateNumberInput(property: string, property_name: string, properties: inputProperties[] = []): HTMLDivElement {
		const wrapper = document.createElement("div");

		const label = document.createElement("label");
		label.innerHTML = property_name;

		const text = document.createElement("input");
		text.type = "number";
		text.value = this.current![property];
		text.addEventListener("input", () => {
			this.current![property] = Number(text.value);
			this.delayedSave();
		});

		// Special properties
		if (properties.includes("notNegative")) {
			text.min = "0";
		} else if (properties.includes("notZero")) {
			text.min = "1";
		}
		if (properties.includes("notEmpty")) {
			text.required = true;
		}

		wrapper.appendChild(label);
		wrapper.appendChild(text);

		return wrapper;
	}
	public generateDeleteButton(full_id: full_id): HTMLDivElement {
		const wrapper = document.createElement("div");
		wrapper.className = "delete";

		const button = document.createElement("button");
		button.innerHTML = "Delete";
		button.addEventListener("click", () => {
			this.delete(full_id);
		});

		wrapper.append(button);
		return wrapper;
	}
}

declare global {
	interface Window {
		editor: BaseEditorClass;
	}
}