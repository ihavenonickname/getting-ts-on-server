import 'reflect-metadata'
import * as routingControllers from 'routing-controllers'
import * as typeOrm from 'typeorm';
import { Container } from 'typedi'

routingControllers.useContainer(Container)
typeOrm.useContainer(Container)

typeOrm.createConnection({
   type: 'postgres',
   host: 'localhost',
   port: 5432,
   username: 'postgres',
   password: 'gabriel',
   database: "FutApostas",
   entities: [
       __dirname + "/models/*.js"
   ],
   synchronize: true,
})

routingControllers.createExpressServer({
   controllers: [__dirname + '/controllers/*Controller.js']
}).listen(3000)

console.log('Running...')