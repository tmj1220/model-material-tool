/* eslint-disable no-unused-vars */
declare interface BaseSource{
  id:string
  name:string
  type:'material'|'model'
  tags:{label:string, value:string}[]
  link:string
}

declare interface Model extends BaseSource{

}

declare interface Material extends BaseSource{

}
