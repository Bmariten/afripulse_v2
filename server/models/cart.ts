import { Model, DataTypes, Sequelize } from 'sequelize';

export class Cart extends Model {
  public id!: string;
  public user_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export function initCart(sequelize: Sequelize): void {
  Cart.init({
    id: {
      type: DataTypes.STRING(36),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      unique: true, // Each user should have only one cart
      references: {
        model: 'users', // Use lowercase table name for reference
        key: 'id',
      },
    },
  }, {
    sequelize,
    tableName: 'carts', // Use lowercase table name
    underscored: true // Use snake_case for all field names
  });
}
