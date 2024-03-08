import { parcel_charges, parcel_quantity, parcel_type } from "./types";

interface parcel_interface {
	id: string;
	type: parcel_type;

	name: string;
	description: string;
	symbol: string;
}

// =? Parcels

export interface resource_interface extends parcel_interface {
	type: "resource";

	minvalue: number; // Minimum value of the resource
	maxvalue: number; // Maximum value of the resource

	onUnlock: event_reference[]; // When first aquired
	onReach: trigger_quantity[]; // When quantity reaches
}

export interface structure_interface extends parcel_interface {
	type: "structure";

	passive: number; // Passive rate at which it completes tasks.
	additives: parcel_charges[]; // Requirements to additivley increase the task completion rate
	multipliers: parcel_charges[]; // Requirements to multiplicativley increase the task completion rate

	onUnlock: event_reference[]; // When first aquired
	onReach: trigger_quantity[]; // When level reaches
}

export interface research_interface extends parcel_interface {
	type: "research";

	// Has been researched?
	researched: boolean;
	
	// Triggers when researched
	onUnlock: event_reference[];
}

export interface unique_interface extends parcel_interface {
	type: "unique";
	// Unique entities are mysterious and dont follow a structure
}

// =? Interactions

type interaction_reference = `#${number}`;
export interface interaction_interface {
	type: "interaction";
	id: interaction_reference;

	resultIn: parcel_quantity[];
	requires: parcel_quantity[];
	consumes: parcel_quantity[];
}

// =? Events

export type event_reference = `#${number}`;
export interface event_interface {
	type: "event";
	id: event_reference;
	comment: string;

	messages: string[];
	action: parcel_quantity[]; // Increase or decrease resouces
}


type trigger_quantity = [number, event_reference]; // Quantity to reach, event to trigger
type trigger_event = [event_reference[], event_reference]; // Events that must have already triggered, event to trigger

export type all_interfaces = resource_interface | structure_interface | research_interface | unique_interface | interaction_interface | event_interface;

// public currentResource: resource_interface | structure_interface | research_interface | unique_interface | interaction_interface;
