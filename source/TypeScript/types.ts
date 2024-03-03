export type id = string;

export type parcel_type = "resource" | "research" | "structure" | "unique";
export type interaction_type = "interaction";
export type event_type = "event";

export type full_id = `${parcel_type}:${id}`;
export type any_id = `${parcel_type | interaction_type | event_type}:${id}`;

export type parcel_quantity = [full_id, number];
export type parcel_charges = [parcel_quantity[], number];

export type invalid_register = [full_id, boolean];
