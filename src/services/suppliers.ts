import { createCrudService } from "./crud-factory";
import type { Supplier } from "@/types/entities";

export const suppliersService = createCrudService<Supplier>("suppliers");
