import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Transcription = sequelize.define('Transcription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'transcribing', 'analyzing', 'completed', 'error'),
    defaultValue: 'pending'
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  transcriptionText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  analysis: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  error: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default Transcription;