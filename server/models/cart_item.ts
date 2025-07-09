import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CartItemAttributes {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
}

export interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

export class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  public id!: string;
  public cart_id!: string;
  public product_id!: string;
  public quantity!: number;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate: (models: any) => void;
}

export function initCartItem(sequelize: Sequelize) {
  CartItem.init(
    {
      id: {
        type: DataTypes.STRING(36), // UUID
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cart_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: { model: 'carts', key: 'id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'CartItem',
      tableName: 'cart_items',
      timestamps: true, // Let Sequelize manage timestamps
      underscored: true // Use snake_case for all field names
    }
  );

  CartItem.associate = function(models) {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'cart',
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  };

  return CartItem;
}
