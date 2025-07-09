import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

// These are all the attributes in the Profile model
interface ProfileAttributes {
  id: string;
  user_id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  created_at: Date;
  updated_at: Date;
}

// Some attributes are optional in `Profile.create` call
interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id' | 'avatar' | 'bio' | 'website' | 'phone' | 'address' | 'city' | 'state' | 'zip_code' | 'country' | 'created_at' | 'updated_at'> {}

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: string;
  public user_id!: string;
  public name!: string;
  public avatar!: string | null;
  public bio!: string | null;
  public website!: string | null;
  public phone!: string | null;
  public address!: string | null;
  public city!: string | null;
  public state!: string | null;
  public zip_code!: string | null;
  public country!: string | null;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  
  // associations
  // This will be available after association is defined
  // public readonly user?: User;
  
  // Association method - will be defined later
  public static associate: (models: any) => void;
}

export default (sequelize: Sequelize) => {
  Profile.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    timestamps: true,
    underscored: true,
  });

  // Define association methods
  Profile.associate = function(models) {
    // Profile belongs to User
    Profile.belongsTo(models.User, { 
      foreignKey: 'userId',
      as: 'user' 
    });
  };

  Profile.associate = function(models) {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Profile;
};
