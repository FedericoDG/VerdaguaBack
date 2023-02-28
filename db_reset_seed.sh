npx sequelize-cli db:drop
npx sequelize-cli db:create
node database_structure/sync/db_sync.js
npx sequelize-cli db:seed:all
