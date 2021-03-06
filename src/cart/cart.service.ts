/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { String } from 'aws-sdk/clients/cloudwatchevents';
import { Model } from 'mongoose';
import { Cart } from 'src/types/cart';
import { CartDTO } from './cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private cartModel: Model<Cart>) {}

  async create(cartDto: CartDTO, userId: string): Promise<Cart> {
    const userCart = await this.cartModel.findOne({ user: userId });
    if (userCart) {
      for (let i = 0; i < cartDto.products.length; i++)
        userCart.products.push(cartDto.products[i]);

      await userCart.save();

      return userCart;
    } else {
      const createCart = {
        user: userId,
        products: cartDto.products,
      };
      const cart = await this.cartModel.create(createCart);
      return cart;
    }
  }

  async getCartList(userId: string) {
    const products = await this.cartModel
      .findOne({ user: userId })
      .populate('products.productId ');

    if (!products) {
      throw new HttpException('No Orders Found', HttpStatus.NO_CONTENT);
    }

    return products;
  }
}
