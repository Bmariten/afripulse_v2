'use strict';

import { Model, DataTypes, Sequelize } from 'sequelize';

interface ProductImageAttributes {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export class ProductImage extends Model<ProductImageAttributes> implements ProductImageAttributes {
  public id!: string;
  public product_id!: string;
  public image_url!: string;
  public is_primary!: boolean;
  public display_order!: number;
  public created_at!: Date;
  public updated_at!: Date;

  // Static methods
  static associate(models: any) {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

export function initProductImage(sequelize: Sequelize): void {
  ProductImage.init(
    {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'id'
      },
      product_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        field: 'product_id'
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'image_url'
      },
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_primary'
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'display_order'
      },
      created_at: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updated_at: {
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'product_images',
      timestamps: true,
      underscored: false, // Don't use automatic conversion
      
      // Define timestamps explicitly
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      
      // Explicitly define field mappings to avoid camelCase/snake_case confusion
      indexes: [
        {
          fields: ['product_id']
        }
      ]
    }
  );
}
