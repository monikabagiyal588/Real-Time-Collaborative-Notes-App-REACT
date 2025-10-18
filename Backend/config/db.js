import {Sequelize}  from 'sequelize';

const sequelize = new Sequelize('notesdb','root','password',{
host:'localhost',
dialect:'mysql',
});

sequelize.authenticate()
.then(()=> console.log('Mysql database connected'))
.catch((err)=>console.log(' Error:',err))

export default sequelize;

