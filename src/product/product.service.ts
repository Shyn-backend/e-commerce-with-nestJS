/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/shared/uploadFile.service';
import { product } from 'src/types/product';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';

@Injectable()
export class ProductService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(@InjectModel('Product') private productModel: Model<product>,
  private uploadfileService: FilesService) { }

  async findAll(page: number = 1, perPage: number = 10, query: any) {
    const pageNo = Number(page);
    const size = Number(perPage);
    const queryPage = {
      skip: size * (pageNo - 1),
      limit: size
    }
    
    const products = await this.productModel.find(query, {}, queryPage)
      .populate('category')
      .sort({ 'createDate': -1 });

    const productsCount = await this.productModel.count(query);
    const totalPages = Math.ceil(productsCount / size)
    return { products, totalPages }
  }

  // filter 
  async filterFindAll(page: any, filterBody: CreateProductDTO) {
    const filter = filterBody;
    const pageNo = page.page;
    const size = 10;
    const query = {
      skip: size * (pageNo - 1),
      limit: size
    }


    const products = await this.productModel.find(filter, {}, query)
      .populate('category')
      .sort({ 'createDate': -1 });

    const productsCount = products.length;
    const totalPages = Math.ceil(productsCount / size)
    return { products, totalPages }

  }
  // by category
  async findByCategory(id: any, page: number = 1, perPage: number = 10) {
    const pageNo =Number(page);
    const size = Number(perPage);
    const query = {
      skip: size * (pageNo - 1),
      limit: size
    }

    const products = await this.productModel.find({ category: id }, {}, query)
      .populate('category')
      .sort({ 'createDate': -1 });

    const productsCount = await this.productModel.count({ category: id });
    const totalPages = Math.ceil(productsCount / size)
    return { products, totalPages }
  }

  async findById(id: string): Promise<product> {
    const product = await this.productModel.findById(id).populate('category');
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NO_CONTENT);
    }
    return product;
  }

  async create(productDTO: CreateProductDTO): Promise<product> {
    const product = await this.productModel.create({
      ...productDTO
    });
    await product.save();
    return product.populate('category');
  }

  async update(
    id: string,
    productDTO: UpdateProductDTO,
  ): Promise<product> {
    const product = await this.productModel.findById(id);

    await product.update(productDTO);
    return await this.productModel.findById(id).populate('category');
  }


  async delete(id: string): Promise<product> {
    const product = await this.productModel.findById(id);

    await product.remove();
    return product.populate('owner');
  }
  
 
  async deleteImage( params: any ) {
    const {key , id , type} = params;
    const product = await this.productModel.findById(id);
    this.uploadfileService.deletePublicFile(key)
    if(type == 'image') {
      const images = product.image;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
       product.image = images.filter( el =>el.key !== key );   
      product.save();
    }
    else if(type == 'thumbnail') {
      product.thumbnail = null;
      product.save();
    }
    else{
      product.video = null
      product.save();
    }
    return "Deleted";
  }
}
