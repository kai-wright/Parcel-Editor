// ? regexID --> Contains only lowercase letters and underscores, cannot start or end with an underscore
export const regex_id = new RegExp("^[a-z]([a-z_]*[a-z])?$");
// ? regexName --> Contains only letters and spaces, cannot start or end with a space
export const regex_name = new RegExp("^[a-zA-Z](?:[a-zA-Z ]*[a-zA-Z])?$");
// ? regexFullID --> starts with a valid type, then a colon : then a valid regexID
export const regex_id_full = new RegExp(`^(resource|structure|research|unique|interaction|event)\:(([a-z]([a-z_]*[a-z])?))$`);
