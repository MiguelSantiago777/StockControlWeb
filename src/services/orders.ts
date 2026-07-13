import { createCrudService } from "./crud-factory";
import type { Order } from "@/types/entities";

export const ordersService = createCrudService<Order>("orders");
