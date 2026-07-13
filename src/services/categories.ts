import { createCrudService } from "./crud-factory";
import type { Category } from "@/types/entities";

export const categoriesService = createCrudService<Category>("categories");
