npx sequelize-cli db:drop
npx sequelize-cli db:create
node database_structure/sync/db_sync.js
npx sequelize-cli db:seed --seed 2022121516100-init-roles.js
npx sequelize-cli db:seed --seed 2022121516200-init-super-admin-user.js
npx sequelize-cli db:seed --seed 2022121517000-parametros.js