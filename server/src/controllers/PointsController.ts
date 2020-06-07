import { Request, Response } from "express";
import knex from '../database/connection';

class PointsController{
  async create(request: Request, response: Response){
    const {name, email, whatsapp, latitude, longitude, city, uf, items} = request.body;
    //trx = transacions(obs: a abreviação trx é um padrão adotado pela comunidade), são utilizadas
    //para criar uma dependencia entre queries, caso a segunda query não execute por exemplo
    // a primeira não deve ser executada. Um exemplo é tentar criar um point com um id de item
    //que não existe.

    const trx = await knex.transaction();
   
    const point = {
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60', 
      name, 
      email, 
      whatsapp, 
      latitude, 
      longitude, 
      city, 
      uf
    }

    // o insert do knex logo apos retornado apos sua execução, retorna os ids dos registros
    //nesse caso como é uma só execução é so pegar o ids na posição 0 do array
    const InsertedIds = await trx('points').insert(point).returning('id');
    
    const point_id = InsertedIds[0];
    
    const pointItems = items.map((item_id: number) =>{
      return {
        item_id,
        point_id
      }
    });
  
    await trx('point_items').insert(pointItems);

    await trx.commit();

    return response.json({
      point_id,
      ...point
    })
  }
  async index(request:Request, response:Response){
    const {city, uf, items} = request.query;
    console.log(city, uf, items);

    const parsedItems = String(items).split(',').map(item=> Number(item.trim()));

    const points = await knex('points')
    .join('point_items', 'points.id', '=', 'point_items.point_id')
    .whereIn('point_items.item_id', parsedItems)
    .where('city', String(city))
    .where('uf', String(uf))
    .distinct()
    .select('points.*');

    return response.json(points);
  }

  async show(request: Request, response: Response){
    const id = request.params.id;

    const point = await knex('points').where('id', id).first();

    if(!point){
      return response.status(400).json({"message": "Point not found."})
    }

    const items = await knex('items')
    .join('point_items', 'items.id', '=', 'point_items.item_id')
    .where('point_items.point_id', id).select('items.title');

    return response.json({point, items});
  }

}

export default PointsController;