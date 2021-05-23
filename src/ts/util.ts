/**
 * Get the value of a GET parameter
 * @param parameterName The name of the parameter
 * @returns The value of the requested parameter. Null if parameter doesn't exist
 */
 export function findGetParameter(parameterName: string): string {
    let result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}