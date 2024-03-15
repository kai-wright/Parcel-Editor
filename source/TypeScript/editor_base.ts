import { editor_version } from "./logging";
import { resource_interface, structure_interface, research_interface, all_interfaces, event_reference } from "./parcel_interfaces";
import { regex_id_full } from "./regexes";
import { any_id, full_id, id, interface_types, invalid_register } from "./types";

export type inputProperties = "spellcheck" | "notEmpty" | "readonly" | "regexId" | "regexName" | "notZero" | "notNegative";

export abstract class BaseEditorClass {
	abstract editorType: "resource" | "structure" | "research" | "unique" | "interaction" | "event"; // Type of object this editor edits
	abstract editorVersion: number; // Version of this specific editor
	private saveTimeout: number | undefined;
	public isSaved: boolean = true;
	public isError: boolean = false;

	// The object currently loaded in the editor. Each editor chooses a single type to edit
	public current: all_interfaces | undefined;

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
			this.isError = true;
			this.updateSaveStatus();
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
		this.isError = false;
		this.updateSaveStatus();
		// Log saved
		console.info(`Saved ${fullId}`);
		// Success
		return true;
	}
	checkValidToSave(): boolean {
		if (this.current === undefined) {
			console.warn("No parcel loaded, not saving");
			this.isError = true;
			this.updateSaveStatus();
			return false;
		}
		const fullId = `${this.editorType}:${this.current.id}`;
		// Validate the full id
		if (!regex_id_full.test(fullId)) {
			console.warn(`Given invalid full ID: ${fullId} to save`);
			this.isError = true;
			this.updateSaveStatus();
			return false;
		}
		if (!this.checkAllInputValidity()) {
			console.warn(`There is an invalid input in the editor!`);
			this.isError = true;
			this.updateSaveStatus();
			return false;
		}
		// All checks passed
		this.isError = false;
		return true;
	}
	abstract checkAllInputValidity(): boolean;
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

	exportData(full_id: full_id): string | undefined {
		// Update storage
		this.save();
		// Convert to an object
		let dataString = localStorage.getItem(full_id);
		if (dataString === null) {
			console.error(`Given ${full_id} to export, failed to find in localStorage`);
			return;
		}
		return dataString;
	}
	exportAllData(editor: "resources" | "structures" | "research" | "unique" | "interactions" | "events"): string | undefined {
		// Update storage
		this.checkStorage();
		// If the editor is wrong or unset
		if (this[editor] === undefined) {
			console.error(`${editor} is not a valid parcel type. Unable to export data.`);
			return;
		}

		let data: { [index: any_id]: object } = {};

		for (const parcel of this[editor]) {
			let parcel_data = this.exportData(parcel);
			if (parcel_data === undefined) {
				console.error(`Was unable to load ${parcel}. Unable to export data.`);
				return;
			}
			data[parcel] = JSON.parse(parcel_data);
		}

		console.table(data);

		return;
	}

	saveExportData(full_id: full_id | "current" | "editor") {
		// Internal variables
		let data: string | undefined;
		let blob: Blob;

		// Special start functionality
		switch (full_id) {
			case "editor":
				blob = new Blob(["Not yet implemented"], { type: "text/plain" });
				break;
			case "current":
				full_id = `${this.editorType}:${this.current!.id}` as full_id;
			default: {
				data = this.exportData(full_id);
				if (data === undefined) {
					return false;
				}
				blob = new Blob([data], { type: "text/plain" });
			}
		}

		// Save as a text file with the full id as the name.
		this.generateFile(blob, `${full_id}.json`);
		return true;
	}

	private generateFile(data: Blob, filename: string) {
		let url = URL.createObjectURL(data);
		let link = document.createElement("a");
		link.download = filename;
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
	}

	abstract generateEmptyParcel(id: id | number, name: string): all_interfaces;

	abstract create(): boolean;

	delete(full_id: any_id) {
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

	abstract clearRender(): void;

	registerInvalid(full_id: full_id) {
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
			if (!Number.isNaN(text.valueAsNumber)) {
				this.current![property] = Number(text.valueAsNumber);
			} else {
				this.isError = true;
			}
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
	public generateDeleteButton(full_id: any_id): HTMLDivElement {
		const wrapper = document.createElement("div");
		wrapper.className = "delete";

		const button = document.createElement("button");
		button.innerHTML = "Delete";
		button.addEventListener("click", () => {
			if (confirm("Deletion is permanent, are you sure you want to continue?")) {
				this.delete(full_id);
			}
		});

		wrapper.append(button);
		return wrapper;
	}
	public generateOnUnlock(wrapper: HTMLDivElement): boolean {
		if (
			(this.current as research_interface | structure_interface | research_interface) === undefined ||
			(this.current as research_interface | structure_interface | research_interface).onUnlock === undefined
		) {
			// throw new Error("Current editor is not designed for use with the onUnlock generator");
			return false;
		}
		wrapper.className = "onUnlockWrapper doubles";
		wrapper.innerHTML = "";
		// If no events exist generate a no events found message
		if (this.events.length == 0) {
			const notice = document.createElement("h2");
			notice.innerHTML = "No events found";
			wrapper.appendChild(notice);
			return false;
		}
		if ((this.current as research_interface | structure_interface | research_interface).onUnlock.length == 0) {
			const notice = document.createElement("h2");
			notice.innerHTML = `No onUnlock`;
			wrapper.appendChild(notice);
		}

		// Generate element for each onUnlock
		// Generate a delete button for each onUnlock
		for (const i in (this.current as research_interface | structure_interface | research_interface).onUnlock) {
			const inner_wrapper = document.createElement("div");
			console.log((this.current as research_interface | structure_interface | research_interface).onUnlock);
			console.log((this.current as research_interface | structure_interface | research_interface).onUnlock[i]);

			const eventInput = this.generateSelectElement(["events"]);
			eventInput.value = (this.current as research_interface | structure_interface | research_interface).onUnlock[i];
			eventInput.addEventListener("change", () => {
				(this.current as research_interface | structure_interface | research_interface).onUnlock[i] =
					eventInput.value as event_reference;
				this.delayedSave();
				this.generateOnUnlock(wrapper);
			});

			const inputDelete = document.createElement("button");
			inputDelete.innerHTML = "X";
			inputDelete.addEventListener("click", () => {
				(this.current as research_interface | structure_interface | research_interface).onUnlock.splice(Number(i), 1);
				this.delayedSave();
				this.generateOnUnlock(wrapper);
			});

			inner_wrapper.appendChild(eventInput);
			inner_wrapper.appendChild(inputDelete);
			wrapper.append(inner_wrapper);
		}

		// Generate a add button
		const add_button = document.createElement("button");
		add_button.className = "add";
		add_button.innerHTML = "Add new onUnlock event";
		add_button.addEventListener("click", () => {
			(this.current as research_interface | structure_interface | research_interface).onUnlock.push(`#0`);
			this.delayedSave();
			this.generateOnUnlock(wrapper);
		});
		wrapper.append(add_button);

		// Return
		return true;
	}
	public generateOnReach(wrapper: HTMLDivElement): boolean {
		if (
			(this.current as resource_interface | structure_interface) === undefined ||
			(this.current as resource_interface | structure_interface).onReach === undefined
		) {
			// throw new Error("Current editor is not designed for use with the onReach generator");
			return false;
		}
		wrapper.className = "onReachWrapper triples";
		wrapper.innerHTML = "";
		// If no events exist generate a no events found message
		if (this.events.length == 0) {
			const notice = document.createElement("h2");
			notice.innerHTML = "No events found";
			wrapper.appendChild(notice);
			return false;
		}
		if ((this.current as resource_interface | structure_interface).onReach.length == 0) {
			const notice = document.createElement("h2");
			notice.innerHTML = `No onReach`;
			wrapper.appendChild(notice);
		}

		// Generate element for each onReach
		// Generate a delete button for each onReach
		for (const i in (this.current as resource_interface | structure_interface).onReach) {
			const inner_wrapper = document.createElement("div");

			const number_input = document.createElement("input") as HTMLInputElement;
			number_input.value = String((this.current as resource_interface | structure_interface).onReach[i][0]);
			number_input.type = "number";
			number_input.addEventListener("change", () => {
				(this.current as resource_interface | structure_interface).onReach[i][0] = number_input.valueAsNumber;
				this.delayedSave();
			});

			const eventInput = this.generateSelectElement(["events"]);
			eventInput.value = (this.current as resource_interface | structure_interface).onReach[i][1];
			eventInput.addEventListener("change", () => {
				(this.current as resource_interface | structure_interface).onReach[i][1] = eventInput.value as event_reference;
				this.delayedSave();
				this.generateOnReach(wrapper);
			});

			const inputDelete = document.createElement("button");
			inputDelete.innerHTML = "X";
			inputDelete.addEventListener("click", () => {
				(this.current as resource_interface | structure_interface).onReach.splice(Number(i), 1);
				this.delayedSave();
				this.generateOnReach(wrapper);
			});

			inner_wrapper.appendChild(number_input);
			inner_wrapper.appendChild(eventInput);
			inner_wrapper.appendChild(inputDelete);
			wrapper.append(inner_wrapper);
		}

		// Generate a add button
		const add_button = document.createElement("button");
		add_button.className = "add";
		add_button.innerHTML = "Add new onReach event";
		add_button.addEventListener("click", () => {
			(this.current as resource_interface | structure_interface).onReach.push([5, `#0`]);
			this.delayedSave();
			this.generateOnReach(wrapper);
		});
		wrapper.append(add_button);

		// Return
		return true;
	}

	public generateSelectElement(types: interface_types[]): HTMLSelectElement {
		const select = document.createElement("select") as HTMLSelectElement;

		for (const i in types) {
			const currentType = types[i];
			for (const j in this[currentType]) {
				const option = document.createElement("option");
				option.innerHTML = this[currentType][j];
				option.value = this[currentType][j];
				select.appendChild(option);
			}
		}

		return select;
	}
	generateQuantityPanel(property: "action" | "resultIn" | "requires" | "consumes", main_wrapper: HTMLDivElement): boolean {
		console.log("Generating");
		main_wrapper.innerHTML = "";
		main_wrapper.className = `${property} triples`;

		if (this.current === undefined) {
			return false;
		}

		if (this.current[property].length == 0) {
			const notice = document.createElement("h2");
			notice.innerHTML = `No ${property}`;
			main_wrapper.appendChild(notice);
		}

		let validParcelType: interface_types[] = [];

		if (property == "action") {
			validParcelType = ["resources", "structures", "research"];
		} else if (property == "consumes") {
			validParcelType = ["resources"];
		} else {
			validParcelType = ["resources", "structures", "research"];
		}

		for (const i in this.current[property]) {
			const wrapper = document.createElement("div");

			const resource_input = this.generateSelectElement(validParcelType);
			resource_input.value = this.current[property][i][0];
			resource_input.addEventListener("change", () => {
				this.current![property][i][0] = resource_input.value;
				this.delayedSave();
			});

			const number_input = document.createElement("input") as HTMLInputElement;
			number_input.value = this.current[property][i][1];
			number_input.type = "number";
			number_input.addEventListener("change", () => {
				this.current![property][i][1] = number_input.valueAsNumber;
				this.delayedSave();
			});
			const inputDelete = document.createElement("button");
			inputDelete.innerHTML = "X";
			inputDelete.addEventListener("click", () => {
				this.current![property].splice(Number(i), 1);
				this.generateQuantityPanel(property, main_wrapper);
				this.delayedSave();
			});
			wrapper.appendChild(resource_input);
			wrapper.appendChild(number_input);
			wrapper.appendChild(inputDelete);
			main_wrapper.append(wrapper);
		}

		const add_button = document.createElement("button");
		add_button.className = "add";
		add_button.innerHTML = "Add new " + property;
		add_button.addEventListener("click", () => {
			this.current![property].push(["", 0]);
			this.generateQuantityPanel(property, main_wrapper);
		});
		main_wrapper.append(add_button);

		return true;
	}
}

declare global {
	interface Window {
		editor: BaseEditorClass;
	}
}
