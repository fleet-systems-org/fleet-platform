import { z } from "zod";

// Canonical transport syntax only: scale, sign constraints and rounding are
// feature policies. Never coerce through number or normalize away input digits.
export const decimalStringSchema = z.string().regex(/^-?(?:0|[1-9]\d*)(?:\.\d+)?$(?![\s\S])/);

export type DecimalString = z.infer<typeof decimalStringSchema>;
