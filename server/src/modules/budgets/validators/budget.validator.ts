import { CreateBudgetSchema } from '../dto/create-budget.dto';
import { UpdateBudgetSchema } from '../dto/update-budget.dto';

export function validateCreateBudget(data: unknown) {
  return CreateBudgetSchema.safeParse(data);
}

export function validateUpdateBudget(data: unknown) {
  return UpdateBudgetSchema.safeParse(data);
}
