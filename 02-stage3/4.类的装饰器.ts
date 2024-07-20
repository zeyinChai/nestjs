function logged(value, ctx) {
  console.log(value, ctx);
  const kind = ctx.kind;
  const name = ctx.name;
  if(kind === 'class'){
    return class extends value{
        constructor(...args){
            super(...args)
            console.log(`constructing an instance of ${name} with args ${args.join(',')}`);
        }
    }
  }
}
// @ts-ignore
@logged
class Class {
    constructor(public a:number){}
}

new Class(123)

export {}