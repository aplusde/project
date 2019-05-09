
export  default (data=[],key)=>data.reduce((acc,next)=>{
  // {attitude}
  return [
    ...acc,
    next[key]
  ]
},[])