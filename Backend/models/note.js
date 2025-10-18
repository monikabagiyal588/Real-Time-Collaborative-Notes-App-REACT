import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Note=sequelize.define('Note',{
    // title:{type:DataTypes.STRING,allowNull:false},
    note_id:{ type:DataTypes.STRING},
    content:{type:DataTypes.TEXT},
    updatedBy:{type:DataTypes.STRING}
});
export default Note;