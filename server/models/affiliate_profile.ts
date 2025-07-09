import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface AffiliateProfileAttributes {
  id: string;
  user_id: string;
  website?: string;
  social_media?: string;
  paypal_email?: string;
  bank_account?: string;
  commission_rate?: number;
}

// Making timestamps optional during creation
export interface AffiliateProfileCreationAttributes extends Optional<AffiliateProfileAttributes, 'id'> {}

export class AffiliateProfile extends Model<AffiliateProfileAttributes, AffiliateProfileCreationAttributes> implements AffiliateProfileAttributes {
  public id!: string;
  public user_id!: string;
  public website?: string;
  public social_media?: string;
  public paypal_email?: string;
  public bank_account?: string;
  public commission_rate?: number;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate(models: any): void {
    // Define association with User
    AffiliateProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    // Define association with FlaggedActivity
    AffiliateProfile.hasMany(models.FlaggedActivity, {
      foreignKey: 'affiliate_id',
      as: 'flagged_activities',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  }
}

export function initAffiliateProfile(sequelize: Sequelize) {
  AffiliateProfile.init(
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      website: DataTypes.STRING,
      social_media: DataTypes.STRING,
      paypal_email: DataTypes.STRING,
      bank_account: DataTypes.STRING,
      commission_rate: { type: DataTypes.DECIMAL(5, 2), defaultValue: 10.00 },
    },
    {
      sequelize,
      modelName: 'AffiliateProfile',
      tableName: 'affiliate_profiles',
      timestamps: true, // Let Sequelize manage timestamps
      underscored: true // Use snake_case for all field names
    }
  );

  AffiliateProfile.associate = function(models) {
    AffiliateProfile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return AffiliateProfile;
}
