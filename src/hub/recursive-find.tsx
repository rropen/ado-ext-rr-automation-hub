

const isObject = (value:any):any => {
  return !!(value && typeof value === "object" && !Array.isArray(value));
};

/*
Exhaustive search for key and value matching in tree object. Can be multiple values.
Returns array of string[] of keys that match

const ob = { a: { 
                        b: { 
                            c: 'd' 
                        }, 
                        e: { 
                            f: {
                                g: "h"
                            },
                            f2: {
                                g: "h"
                            },
                            f3: {
                                g: "h3"
                            }
                        } 
                    } 
                };

findNestedObject(ob,"g","h")

returns [["a","e","f"],["a","e","f2"]]

*/

/**
 * Exhaustive search for key and value matching in tree object. Can be multiple values.
 * Returns array of string[] of keys that match
 * const ob = { a: { 
                        b: { 
                            c: 'd' 
                        }, 
                        e: { 
                            f: {
                                g: "h"
                            },
                            f2: {
                                g: "h"
                            },
                            f3: {
                                g: "h3"
                            }
                        } 
                    } 
                };

    findNestedObject(ob,"g","h")

    returns [["a","e","f"],["a","e","f2"]]

 * @param {any} data object 
 * @param {string} foundkeys keyToMatch, the key to match
 * @param {string} foundkeys valueToMatch, the value to match
 * @returns {Array<Array<string>>} foundkeys foundKeys
 */
export const findNestedObject = (object:any = {}, keyToMatch:string ="", valueToMatch:string = "", 
                                currentDepth:number=0, currentkeys:Array<string>=[], foundKeys:Array<Array<string>>=[]): Array<Array<string>> => {
  if (isObject(object)) {
    var d = currentDepth+1;
    
    // We'll work on finding our nested object here...
    const entries = Object.entries(object);
    //console.log(` entries  ${JSON.stringify(entries)} `)

    for (let i = 0; i < entries.length; i += 1) {
      const [objectKey, objectValue] = entries[i];
      
      // console.log(`checking key ${objectKey} ${keyToMatch} and value ${objectValue} ${valueToMatch}`)
      if (objectValue === valueToMatch && objectKey === keyToMatch) {
        // create copy via map, otherwise we will store a ref
        foundKeys.push(currentkeys.map((x)=>x))
      }
      currentkeys.push(objectKey)
      if (isObject(objectValue)) {
        const child = findNestedObject(objectValue, keyToMatch, valueToMatch, d, currentkeys,foundKeys);
      }
      currentkeys.pop()
    }
  }
  // console.log(` returning ${JSON.stringify(foundKeys)} `)
  return foundKeys;
};

export const testfindNestedObject = () => {
  const ob = { a: { 
                  b: { 
                      c: 'd' 
                  }, 
                  e: { 
                      f: {
                          g: "h"
                      },
                      f2: {
                          g: "h"
                      },
                      f3: {
                          g: "h3"
                      }
                  } 
              } 
            };
  //objectScan(['a.*.f'], { joined: true })(haystack);

  const foundkeys = findNestedObject(ob,"g","h")
  const expected:Array<Array<string>> = [["a","e","f"],["a","e","f2"]]

  if(JSON.stringify(expected) != JSON.stringify(foundkeys)){
    console.log("testFindNestedFail")
    
  }

  console.log(`foundkeys: ${JSON.stringify(foundkeys)}`)
  console.log(`expected: ${JSON.stringify(expected)}`)
};

