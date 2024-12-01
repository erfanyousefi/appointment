import {isNumber} from "class-validator";
import {PaginationDto} from "../dto/pagination.dto";

export function paginationSolver(paginationDto: PaginationDto) {
  let {limit = 10, page = 0} = paginationDto;
  if (!limit || limit == 0 || !isNumber(limit) || limit <= 0) limit = 10;
  if (!page || page <= 1 || !isNumber(page)) page = 0;
  if (page >= 1) page = page - 1;
  return {
    page,
    limit,
    skip: page * limit,
  };
}

export const paginationGenerator = (
  page: number,
  limit: number,
  count: number
) => {
  const skip = page * limit;
  return {
    skip,
    page,
    limit,
    total_count: count,
  };
};
