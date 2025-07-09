'use strict';

import { Model, DataTypes, Sequelize } from 'sequelize';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  discount_price: number | null;
  category: string;
  inventory_count: number;
  featured: boolean;
  status: string;
  is_approved: boolean;
  seller_id: string;
  created_at: Date;
  updated_at: Date;
}

export class Product extends Model<ProductAttributes> implements ProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public long_description!: string;
  public price!: number;
  public discount_price!: number | null;
  public category!: string;
  public inventory_count!: number;
  public featured!: boolean;
  public status!: string;
  public is_approved!: boolean;
  public seller_id!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Static methods
  static associate(models: any) {
    Product.belongsTo(models.SellerProfile, {
      foreignKey: 'seller_id',
      as: 'seller',
    });

    Product.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images',
    });
  }
}

export function initProduct(sequelize: Sequelize): void {
  Product.init(
    {
      id: {
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'id'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name'
      },
      description: {
        type: DataTypes.TEXT,
        field: 'description'
      },
      long_description: {
        type: DataTypes.TEXT,
        field: 'long_description'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'price'
      },
      discount_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'discount_price'
      },
      category: {
        type: DataTypes.STRING,
        field: 'category'
      },
      inventory_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'inventory_count'
      },
      seller_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: {
          model: 'seller_profiles',
          key: 'id'
        },
        field: 'seller_id'
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'featured'
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        field: 'status'
      },
      is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_approved'
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
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
      underscored: false, // Don't use automatic conversion
      
      // Define timestamps explicitly
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      
      // Explicitly define field mappings to avoid camelCase/snake_case confusion
      indexes: [
        {
          fields: ['seller_id']
        }
      ]
    }
  );
}
