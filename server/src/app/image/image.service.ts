import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import cheerio from 'cheerio';
import { Repository } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
const axios = require('axios');

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private ImageRepository: Repository<Image>
  ) {}

  async findById(id: number): Promise<Image> {
    return await this.ImageRepository.findOneBy({ id });
  }

  async saveImageData(url: string): Promise<Image> {
    const newImage = this.ImageRepository.create({ path: url });
    await this.ImageRepository.save(newImage);
    return newImage;
  }

  isValidUrl = (url: string) => {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(url);
  };

  async saveImageFromUrlToDB(url: string, productName: string): Promise<Image> {
    const { data } = await axios.get(url);

    if (data) {
      const $ = cheerio.load(data);

      let imagePath: string;

      // * End product name ------

      $('img').map(async (idx, image) => {
        var alt = $(image).attr('alt') || '';
        // If the alt of the image has the same name of the product name then this is the image I want to fetch it
        if (alt?.includes(productName) && !imagePath) {
          imagePath = $(image).attr('src');
        }
      });

      // if there's no image path then set the default image
      if (!imagePath || !this.isValidUrl(imagePath)) {
        const defaultImage = await this.ImageRepository.findOneBy({
          path: 'https://www.eps.org/global_graphics/default-store-350x350.jpg',
        });

        // if the default image is not exists, create it
        if (!defaultImage) {
          const img = this.ImageRepository.create({
            path: 'https://www.eps.org/global_graphics/default-store-350x350.jpg',
          });

          return await this.ImageRepository.save(img);
        }

        return defaultImage;
      }

      const createImage = this.ImageRepository.create({
        path: imagePath,
      });

      const img = await this.ImageRepository.save(createImage);

      return img;
    } else {
      throw new HttpException(
        'The product link is not valid, please try another link.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async uploadImage(
    folder: string,
    file: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);

        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
