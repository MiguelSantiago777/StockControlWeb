import { createCrudService } from "./crud-factory";
import type { User } from "@/types/entities";

export const usersService = createCrudService<User>("users");
