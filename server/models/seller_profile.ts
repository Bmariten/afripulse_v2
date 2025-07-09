import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface SellerProfileAttributes {
  id: string;
  user_id: string; // Changed to snake_case to match DB column
  business_name?: string; // Changed to snake_case
  description?: string;
  paypal_email?: string; // Changed to snake_case
  bank_account?: string; // Changed to snake_case
  verified?: boolean;
}

// Making timestamps optional during creation
export interface SellerProfileCreationAttributes extends Optional<SellerProfileAttributes, 'id'> {}

export class SellerProfile extends Model<SellerProfileAttributes, SellerProfileCreationAttributes> implements SellerProfileAttributes {
  public id!: string;
  public user_id!: string;
  public business_name?: string;
  public description?: string;
  public paypal_email?: string;
  public bank_account?: string;
  public verified?: boolean;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate: (models: any) => void;
}

export function initSellerProfile(sequelize: Sequelize) {
  SellerProfile.init(
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'id'
      },
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        field: 'user_id'
      },
      business_name: { 
        type: DataTypes.STRING, 
        field: 'business_name' 
      },
      description: { 
        type: DataTypes.TEXT,
        field: 'description'
      },
      paypal_email: { 
        type: DataTypes.STRING, 
        field: 'paypal_email' 
      },
      bank_account: { 
        type: DataTypes.STRING, 
        field: 'bank_account' 
      },
      verified: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: false,
        field: 'verified'
      },
    },
    {
      sequelize,
      modelName: 'SellerProfile',
      tableName: 'seller_profiles',
      timestamps: true,
      underscored: false, // Don't use automatic conversion
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  SellerProfile.associate = function(models) {
    SellerProfile.hasMany(models.Product, {
      foreignKey: 'seller_id',
      as: 'products',
    });
    SellerProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return SellerProfile;
}
