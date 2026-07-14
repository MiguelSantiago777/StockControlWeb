import { createCrudService } from "./crud-factory";
import type { Vehicle } from "@/types/entities";

export const vehiclesService = createCrudService<Vehicle>("vehicles");
