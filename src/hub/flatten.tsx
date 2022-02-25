
/**
 * Flattens object into string-dot chain 
 * 
 * a: {
 *    b : {
 *       c : "d"    
 *  }
 * }
 * 
 * becomes 
 * 
 * "a.b.c" : "d"
 * 
 * @param {any} data object 
 * @param {string} c key to pass per recursion
 * @returns {string}
 */
export function flatten(data: any, c:string) : any {
    var result:any = {}
    for(var i in data) {
      if(typeof data[i] == 'object') Object.assign(result, flatten(data[i], c + '.' + i))
      else result[(c + '.' + i).replace(/^\./, "")] = data[i]
    }
    return result
  }

