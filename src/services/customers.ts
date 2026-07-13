import { createCrudService } from "./crud-factory";
import type { Customer } from "@/types/entities";

export const customersService = createCrudService<Customer>("customers");
