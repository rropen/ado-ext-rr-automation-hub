import {ROARR, Roarr, logLevels,getLogLevelName} from 'roarr';
import {serializeError} from 'serialize-error';
  
ROARR.write = (message) => {
  const payload = JSON.parse(message);

  payload.context.logLevelName = getLogLevelName(payload.context.logLevel)

  if (payload.context.logLevel > logLevels.debug) {
    console.log(payload);
  }

};

export const Logger = Roarr.child({
    // .foo property is going to appear only in the logs that are created using
    // the current instance of a Roarr logger.
    application: 'ado-ext-rr-automation-hub'
  });


export const LogError = (e:any | Error) => {
  (e instanceof Error) ? Logger.error({error:serializeError(e)},e.message) : Logger.error(JSON.stringify(e))
}