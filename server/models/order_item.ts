import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface OrderItemAttributes {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  affiliate_id?: string;
}

export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: string;
  public order_id!: string;
  public product_id?: string;
  public product_name!: string;
  public quantity!: number;
  public price_per_unit!: number;
  public affiliate_id?: string;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate: (models: any) => void;
}

export function initOrderItem(sequelize: Sequelize) {
  OrderItem.init(
    {
      id: {
        type: DataTypes.STRING(36), // UUID
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      order_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: DataTypes.STRING(36),
        references: { model: 'products', key: 'id' },
        onDelete: 'SET NULL',
      },
      product_name: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price_per_unit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      affiliate_id: {
        type: DataTypes.STRING(36),
        references: { model: 'affiliate_profiles', key: 'id' },
        onDelete: 'SET NULL',
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      timestamps: true, // Let Sequelize manage timestamps
      underscored: true // Use snake_case for all field names
    }
  );

  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
    OrderItem.belongsTo(models.AffiliateProfile, {
      foreignKey: 'affiliate_id',
      as: 'affiliate',
    });
  };

  return OrderItem;
}
