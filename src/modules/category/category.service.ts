import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateCategoryDto, UpdateCategoryDto} from "./dto/category.dto";
import {CategoryEntity} from "./entity/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) {}
  async create(dto: CreateCategoryDto) {
    const {title, description, slug} = dto;
    await this.categoryRepository.insert({title, description, slug});
    return {
      message: "با موفقیت ایجاد شد",
    };
  }
  async find() {
    return this.categoryRepository.findBy({});
  }
  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({id});
    if (!category) throw new NotFoundException("دسته بندی یافت نشد");
    return category;
  }
  async update(id: number, dto: UpdateCategoryDto) {
    const {title, description, slug} = dto;
    const category = await this.findOne(id);
    if (title) category.title = title;
    if (description) category.description = description;
    if (slug) category.slug = slug;
    await this.categoryRepository.save(category);
    return {
      message: "به روزرسانی با موفقیت انجام شد",
    };
  }
  async delete(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return {
      message: "با موفقیت حذف شد",
    };
  }
}
