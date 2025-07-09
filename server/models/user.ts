import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import bcrypt from 'bcrypt';

// These are all the attributes in the User model
interface UserAttributes {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'seller' | 'affiliate' | 'customer';
  is_email_verified: boolean;
  email_verification_token: string | null;
  password_reset_token: string | null;
  password_reset_expires: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Some attributes are optional in `User.create` call
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'is_email_verified' | 'email_verification_token' | 'password_reset_token' | 'password_reset_expires' | 'created_at' | 'updated_at'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'seller' | 'affiliate' | 'customer';
  public is_email_verified!: boolean;
  public email_verification_token!: string | null;
  public password_reset_token!: string | null;
  public password_reset_expires!: Date | null;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  
  // Association method - will be defined later
  public static associate: (models: any) => void;

  // Method to compare passwords
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export default (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'seller', 'affiliate', 'customer'),
      allowNull: false,
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    email_verification_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  });

  // Define association methods
  User.associate = function(models) {
    // User has one Profile
    User.hasOne(models.Profile, {
      foreignKey: 'user_id',
      as: 'profile',
    });

    // User has one SellerProfile
    User.hasOne(models.SellerProfile, {
      foreignKey: 'userId',
      as: 'sellerProfile',
    });

    // User has one AffiliateProfile
    User.hasOne(models.AffiliateProfile, {
      foreignKey: 'userId',
      as: 'affiliateProfile',
    });
  };

  User.associate = function(models) {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile',
    });
    User.hasOne(models.SellerProfile, {
      foreignKey: 'userId',
      as: 'sellerProfile',
    });
    User.hasOne(models.AffiliateProfile, {
      foreignKey: 'userId',
      as: 'affiliateProfile',
    });
  };

  return User;
};
